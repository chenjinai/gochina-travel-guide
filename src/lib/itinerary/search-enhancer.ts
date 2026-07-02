/**
 * 行程搜索增强模块
 * 通过 Tavily Search API 实时验证和增强行程信息：
 *   - 景点真实性验证（是否开放、存在）
 *   - 门票价格校准
 *   - 营业时间补充
 *   - 注意事项提醒
 */

import type { ItineraryResult, DayItinerary, ItineraryAttraction } from "./types";

// ==================== 配置 ====================

const TAVILY_API_URL = "https://api.tavily.com/search";
const MAX_SEARCHES = 5; // 每次行程最多搜索次数（控制成本）

// ==================== 类型定义 ====================

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
}

interface SearchTask {
  query: string;
  dayIndex: number;
  slotKey: "morning" | "afternoon" | "evening";
  attrIndex: number;
  purpose: "verify" | "price" | "hours" | "tips";
}

interface AttractionEnhancement {
  verifiedOpen: boolean;
  latestPrice?: number;
  openingHours?: string;
  tips: string[];
  searchedAt: string;
}

// ==================== API 调用 ====================

async function tavilySearch(query: string, apiKey: string): Promise<TavilyResponse> {
  const response = await fetch(TAVILY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: 3,
      include_answer: true,
      include_domains: [],
      exclude_domains: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API 返回错误 (${response.status})`);
  }

  return response.json() as Promise<TavilyResponse>;
}

// ==================== 搜索任务构建 ====================

function buildSearchTasks(days: DayItinerary[]): SearchTask[] {
  const tasks: SearchTask[] = [];
  const seen = new Set<string>();

  for (let di = 0; di < days.length; di++) {
    const day = days[di];
    const slots: ("morning" | "afternoon" | "evening")[] = ["morning", "afternoon", "evening"];

    for (const slot of slots) {
      const attractions = day[slot];
      for (let ai = 0; ai < attractions.length; ai++) {
        const attr = attractions[ai];
        const key = `${attr.name}-${day.cityName}`;
        if (seen.has(key)) continue;
        seen.add(key);

        // 核心任务：验证 + 价格
        tasks.push({
          query: `${attr.name} ${day.cityName} 景点 开放时间 门票价格 2026`,
          dayIndex: di,
          slotKey: slot,
          attrIndex: ai,
          purpose: "verify",
        });
      }
    }
  }

  return tasks.slice(0, MAX_SEARCHES);
}

// ==================== 结果解析 ====================

function parseEnhancement(
  results: TavilyResult[],
  answer: string | undefined,
  attractionName: string,
): AttractionEnhancement {
  const allText = [answer ?? "", ...results.map((r) => r.content)].join("\n");
  const tips: string[] = [];

  // 判断是否开放
  const closedKeywords = ["闭园", "闭馆", "关闭", "暂停开放", "维修", "修缮", "已关闭", "永久关闭"];
  const verifiedOpen = !closedKeywords.some((kw) => allText.includes(kw));

  // 提取价格
  const pricePatterns = [
    /门票[：:]\s*(\d+)\s*元/,
    /票价[：:]\s*(\d+)\s*元/,
    /门票(\d+)\s*元/,
    /(\d+)\s*元\/人/,
    /价格[：:]\s*(\d+)\s*元/,
  ];
  let latestPrice: number | undefined;
  for (const pattern of pricePatterns) {
    const match = allText.match(pattern);
    if (match) {
      latestPrice = parseInt(match[1], 10);
      break;
    }
  }

  // 提取开放时间
  const hoursPatterns = [
    /(?:开放|营业)时间[：:]\s*([^\n。，,]+)/,
    /(?:开放|营业)[：:]\s*([^\n。，,]+)/,
    /(\d{1,2}:\d{2}\s*[-–—至到]\s*\d{1,2}:\d{2})/,
  ];
  let openingHours: string | undefined;
  for (const pattern of hoursPatterns) {
    const match = allText.match(pattern);
    if (match) {
      openingHours = match[1].trim().slice(0, 60);
      break;
    }
  }

  // 提取注意事项
  const tipsKeywords: [RegExp, string][] = [
    [/(?:注意|提醒|提示)[：:]\s*([^\n。，]{4,40})/g, ""],
    [/(?:建议|推荐)(?:提前|务必|尽量)([^\n。，]{4,40})/g, "建议"],
    [/(?:需|需要)(?:提前|预约|排队)([^\n。，]{4,40})/g, "需"],
    [/(?:最佳|推荐)(?:游览|观赏|参观)([^\n。，]{4,40})/g, "推荐"],
    [/(?:周一|周二|周三|周四|周五|周六|周日|每天)(?:闭馆|闭园|不开放|休息)/g, "闭馆日"],
    [/(?:禁止|不允许|不能|不得)([^\n。，]{4,40})/g, "禁止"],
  ];

  for (const [pattern, prefix] of tipsKeywords) {
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(allText)) !== null) {
      const tip = prefix ? `${prefix}${match[1].trim()}` : match[1].trim();
      if (!tips.includes(tip)) {
        tips.push(tip);
      }
    }
  }

  // 从搜索结果标题和摘要中提取有价值的信息
  for (const result of results) {
    const snippet = (result.title + " " + result.content).slice(0, 200);
    // 检查是否有关键提醒
    if (/闭馆|关闭|维修|暂停/.test(snippet) && !tips.some((t) => t.includes("闭馆") || t.includes("关闭"))) {
      tips.push("⚠️ 搜索结果提示该景点可能有临时变动，建议出行前确认");
    }
    if (/免费/.test(snippet) && latestPrice === undefined) {
      latestPrice = 0;
    }
  }

  return {
    verifiedOpen,
    latestPrice,
    openingHours,
    tips: tips.slice(0, 5),
    searchedAt: new Date().toISOString(),
  };
}

// ==================== 主函数 ====================

export async function enhanceItinerary(
  itinerary: ItineraryResult,
  apiKey?: string,
): Promise<ItineraryResult> {
  const key = apiKey || process.env.TAVILY_API_KEY;
  if (!key) {
    console.warn("[SearchEnhancer] No TAVILY_API_KEY, skipping enhancement");
    return itinerary;
  }

  const tasks = buildSearchTasks(itinerary.days);
  if (tasks.length === 0) {
    return itinerary;
  }

  console.log(`[SearchEnhancer] Starting ${tasks.length} search tasks...`);

  // 存储每个景点的增强数据
  const enhancementMap = new Map<string, AttractionEnhancement>();

  // 并行执行所有搜索
  const searchResults = await Promise.allSettled(
    tasks.map(async (task) => {
      try {
        const response = await tavilySearch(task.query, key);
        const day = itinerary.days[task.dayIndex];
        const attr = day[task.slotKey][task.attrIndex];
        const key_ = `${attr.name}-${day.cityName}`;
        const enhancement = parseEnhancement(response.results, response.answer, attr.name);
        return { key: key_, enhancement, task };
      } catch (err) {
        console.warn(`[SearchEnhancer] Search failed for "${task.query}":`, err);
        return null;
      }
    }),
  );

  // 收集结果
  for (const result of searchResults) {
    if (result.status === "fulfilled" && result.value) {
      const { key: mapKey, enhancement } = result.value;
      if (!enhancementMap.has(mapKey)) {
        enhancementMap.set(mapKey, enhancement);
      }
    }
  }

  console.log(`[SearchEnhancer] Got ${enhancementMap.size} enhancements`);

  // 应用增强数据到行程
  const enhancedDays = itinerary.days.map((day) => {
    const newDay = { ...day };

    const slots: ("morning" | "afternoon" | "evening")[] = ["morning", "afternoon", "evening"];
    for (const slot of slots) {
      newDay[slot] = day[slot].map((attr) => {
        const mapKey = `${attr.name}-${day.cityName}`;
        const enhancement = enhancementMap.get(mapKey);
        if (!enhancement) return attr;

        const enhancedAttr: ItineraryAttraction = { ...attr };

        // 更新票价
        if (enhancement.latestPrice !== undefined && enhancement.latestPrice !== attr.ticketPrice) {
          enhancedAttr.ticketPrice = enhancement.latestPrice;
        }

        return enhancedAttr;
      });
    }

    return newDay;
  });

  // 收集全局增强信息
  const allTips: string[] = [];
  const priceUpdates: string[] = [];
  const closedWarnings: string[] = [];

  for (const [mapKey, enhancement] of enhancementMap) {
    const name = mapKey.split("-").slice(0, -1).join("-");
    if (!enhancement.verifiedOpen) {
      closedWarnings.push(`⚠️ 「${name}」搜索结果提示可能有临时关闭，建议出行前电话确认`);
    }
    if (enhancement.latestPrice !== undefined) {
      // 找到原始景点数据对比
      const origDay = itinerary.days.find((d) => {
        const allAttrs = [...d.morning, ...d.afternoon, ...d.evening];
        return allAttrs.some((a) => `${a.name}-${d.cityName}` === mapKey);
      });
      if (origDay) {
        const origAttr = [...origDay.morning, ...origDay.afternoon, ...origDay.evening].find(
          (a) => `${a.name}-${origDay.cityName}` === mapKey,
        );
        if (origAttr && enhancement.latestPrice !== origAttr.ticketPrice) {
          const label = enhancement.latestPrice === 0 ? "免费" : `${enhancement.latestPrice}元`;
          priceUpdates.push(`「${name}」门票已更新：${origAttr.ticketPrice}元 → ${label}`);
        }
      }
    }
    for (const tip of enhancement.tips) {
      allTips.push(`💡 「${name}」${tip}`);
    }
  }

  // 重新计算总票价
  const newTotalTicketCost = enhancedDays.reduce((sum, day) => {
    const allAttrs = [...day.morning, ...day.afternoon, ...day.evening];
    return sum + allAttrs.reduce((s, a) => s + a.ticketPrice, 0);
  }, 0);

  // 合并优化建议
  const searchOptimizations = [
    ...priceUpdates.slice(0, 3),
    ...allTips.slice(0, 4),
  ];

  return {
    ...itinerary,
    days: enhancedDays,
    totalTicketCost: newTotalTicketCost,
    optimizations: [...itinerary.optimizations, ...searchOptimizations].slice(0, 10),
    warnings: [...itinerary.warnings, ...closedWarnings].slice(0, 8),
  };
}
