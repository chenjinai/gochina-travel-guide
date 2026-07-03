/**
 * AI 行程生成器 — 通过 DeepSeek API 智能生成行程
 * 使用 createServerFn 确保 API Key 仅在服务端使用
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ItineraryResult, TimeSlot } from "../itinerary/types";
import { CITIES, ATTRACTIONS } from "../itinerary/data";
import { PACE_CONFIGS, BUDGET_CONFIGS, COMPANION_CONFIGS, TIME_CONSTANTS, parseDays, parseBudget, parsePace } from "../itinerary/config";
import { generateItinerary } from "../itinerary/generator";
import { searchForContext } from "../itinerary/volcsearch";

// ==================== DeepSeek API 配置 ====================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// ==================== Zod 输入验证 ====================

const userParamsSchema = z.object({
  days: z.string(),
  companions: z.string(),
  preferences: z.array(z.string()),
  pace: z.string(),
  budget: z.string(),
  destination: z.array(z.string()),
});

// ==================== Prompt 构建 ====================

function buildSystemPrompt(searchContext?: string): string {
  const citiesJson = JSON.stringify(
    CITIES.map((c) => ({
      cityId: c.cityId,
      cityName: c.cityName,
      province: c.province,
      tags: c.tags,
      defaultAreas: c.defaultAreas,
      geoCoord: c.geoCoord,
    })),
    null,
    0
  );

  const attractionsJson = JSON.stringify(
    ATTRACTIONS.map((a) => ({
      id: a.id,
      name: a.name,
      cityId: a.cityId,
      area: a.area,
      type: a.type,
      duration: a.duration,
      intensity: a.intensity,
      ticketPrice: a.ticketPrice,
      isClosedOnMonday: a.isClosedOnMonday,
      geoCoord: a.geoCoord,
    })),
    null,
    0
  );

  const outputTypeDef = `{
  "days": [{
    "day": number,
    "cityId": string,
    "cityName": string,
    "area": string,
    "isTravelDay": boolean,
    "morning": [{ "id": string, "name": string, "type": string, "duration": number, "intensity": number, "ticketPrice": number, "area": string, "geoCoord": [number, number] }],
    "afternoon": [...],
    "evening": [...],
    "meals": { "lunch": { "duration": 1.5, "note": string }, "dinner": { "duration": 1.0, "note": string } },
    "transport": string,
    "accommodation": string,
    "walkingKm": number,
    "paceLabel": string,
    "totalDuration": number
  }],
  "cities": string[],
  "totalWalkingKm": number,
  "totalTicketCost": number,
  "score": number,
  "optimizations": string[],
  "warnings": string[]
}`;

  const searchSection = searchContext
    ? `## 🔍 实时搜索结果（参考以下最新信息辅助规划）\n${searchContext}\n\n`
    : "";

  return `你是一个专业的中国旅游行程规划专家。请根据用户偏好、可用景点数据和实时搜索结果，生成一份详尽、合理、一致的多日行程。

${searchSection}## 可用城市
${citiesJson}

## 可用景点（必须严格从这里选择，禁止编造任何景点或城市）
${attractionsJson}

## 行程生成规则（必须严格遵守）
1. **景点真实性**：只能使用上面提供的城市与景点。禁止编造不存在的城市、景点或片区。
2. **跨天一致性**：
   - 如果某天住宿或交通提示中写明"前往XX"，第二天（或下一个非返程日）的 cityName 必须等于 XX。
   - 如果某天结束时不换城市，第二天的 cityName 必须与前一天一致。
   - 返程日只能出现在最后一天或倒数第二天，且返程日当天早上/上午仍应安排该城市景点，不要把完整的一天只用来返程。
3. **每天必须有景点**：除返程日外，每天上午、下午或晚上必须安排至少2-3个真实景点。不能把一天只写成午餐+晚餐+"返程"而无任何景点。
4. **片区集中**：每天景点应在同一个片区（area），避免跨区奔波。
5. **强度分配**：高强度景点（intensity≥4）安排在上午，低强度（≤2）安排在下午。
6. **闭馆日**：isClosedOnMonday=true 的景点不要安排在周一。
7. **时长控制**：宽松版≤7h/天，标准版≤9h/天，紧凑版≤11h/天（含交通、餐饮、步行）。
8. **预算匹配**：低预算选免费/低价景点，高预算可包含高门票景点。
9. **人群适配**：亲子出行强度上限3，独自/朋友旅行强度上限5。
10. **动线优化**：同一天内景点按地理位置就近排列，减少来回折返。
11. **跨城日**：城际交通日必须明确标注 isTravelDay=true，景点数≤2个，交通提示中写明目的地城市。
12. **每天至少安排午餐和晚餐**：午餐约1.5小时，晚餐约1小时。
13. **免费优先**：同类型景点中优先推荐免费或低价的。
14. **景点唯一性**：同一个景点（id 或 name 相同）在整个行程中只能安排一次，不能跨天重复。如果某个城市需要多天游览，应安排不同的景点。

## 输出格式
只返回一个有效的 JSON 对象，不要包含任何其他文字、解释或 markdown 标记。JSON 结构如下：
${outputTypeDef}

## 自检清单（生成完成后请逐项检查）
- [ ] 所有 cityId、cityName、area 都来自可用城市数据
- [ ] 所有景点 id、name 都来自可用景点数据
- [ ] 每一天都有至少2-3个真实景点，除返程日外
- [ ] 跨城日的交通提示与后一天的 cityName 完全一致
- [ ] 没有"空白天"只有午餐和晚餐
- [ ] 没有景点在整个行程中重复出现（id 或 name 相同）
- [ ] 总天数、城市列表与日程一致`;
}

function buildUserPrompt(params: z.infer<typeof userParamsSchema>): string {
  const totalDays = parseDays(params.days);
  const paceConfig = PACE_CONFIGS[parsePace(params.pace)];
  const budgetConfig = BUDGET_CONFIGS[parseBudget(params.budget)];
  const companionConfig = COMPANION_CONFIGS[params.companions as keyof typeof COMPANION_CONFIGS];

  return JSON.stringify({
    instruction: "请根据以下用户偏好生成行程",
    userPreferences: {
      totalDays,
      companions: params.companions,
      companionDesc: companionConfig?.description || "",
      intensityCap: companionConfig?.intensityCap || 5,
      enableNightActivity: companionConfig?.enableNightActivity ?? true,
      preferences: params.preferences,
      pace: parsePace(params.pace),
      paceDesc: paceConfig?.description || "",
      maxHoursPerDay: paceConfig?.maxHoursPerDay || 9,
      budget: params.budget,
      budgetLevel: parseBudget(params.budget),
      budgetDesc: budgetConfig?.description || "",
      maxTicketPerDay: budgetConfig?.maxTicketPerDay || 350,
      destination: params.destination,
    },
    importantNotes: params.destination && params.destination.length > 0 &&
      !params.destination.includes("还没有明确想法，请推荐")
      ? `用户指定了目的地：${params.destination.join("、")}，请优先在这些城市安排行程，合理分配各城市天数。`
      : "用户没有指定目的地，请根据偏好标签自动推荐最合适的1-3个城市。",
  });
}

// ==================== JSON 清理与验证 ====================

function extractJson(text: string): string {
  // 移除可能的 markdown 代码块标记
  let cleaned = text.replace(/```json?\s*/gi, "").replace(/```\s*/g, "").trim();

  // 尝试找到第一个 { 和最后一个 }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
}

function validateItineraryJson(data: unknown): ItineraryResult {
  if (!data || typeof data !== "object") {
    throw new Error("AI 返回的不是有效的 JSON 对象");
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.days)) {
    throw new Error("行程缺少 days 数组");
  }

  const days = obj.days.map((day: any, index: number) => {
    return {
      day: typeof day.day === "number" ? day.day : index + 1,
      cityId: String(day.cityId || ""),
      cityName: String(day.cityName || ""),
      area: String(day.area || ""),
      isTravelDay: Boolean(day.isTravelDay),
      morning: Array.isArray(day.morning) ? day.morning : [],
      afternoon: Array.isArray(day.afternoon) ? day.afternoon : [],
      evening: Array.isArray(day.evening) ? day.evening : [],
      meals: {
        lunch: {
          duration: day.meals?.lunch?.duration || TIME_CONSTANTS.lunchDuration,
          note: String(day.meals?.lunch?.note || "推荐品尝当地特色美食"),
        },
        dinner: {
          duration: day.meals?.dinner?.duration || TIME_CONSTANTS.dinnerDuration,
          note: String(day.meals?.dinner?.note || "享受当地美食，补充能量"),
        },
      },
      transport: String(day.transport || "地铁/公交可达"),
      accommodation: String(day.accommodation || "舒适型酒店"),
      walkingKm: typeof day.walkingKm === "number" ? day.walkingKm : 5,
      paceLabel: String(day.paceLabel || "标准版"),
      totalDuration: typeof day.totalDuration === "number" ? day.totalDuration : 8,
    };
  });

  const result: ItineraryResult = {
    days,
    cities: Array.isArray(obj.cities) ? obj.cities.map(String) : [],
    totalWalkingKm: typeof obj.totalWalkingKm === "number" ? obj.totalWalkingKm : 0,
    totalTicketCost: typeof obj.totalTicketCost === "number" ? obj.totalTicketCost : 0,
    score: typeof obj.score === "number" ? Math.min(100, Math.max(0, obj.score)) : 80,
    optimizations: Array.isArray(obj.optimizations) ? obj.optimizations.map(String) : [],
    warnings: Array.isArray(obj.warnings) ? obj.warnings.map(String) : [],
  };

  return result;
}

// ==================== 后处理：修正 AI 生成的常见问题 ====================

function postProcessItinerary(result: ItineraryResult): ItineraryResult {
  const warnings: string[] = [...result.warnings];
  const days = [...result.days];

  // 1. 移除完全空白的非返程最后一天（只有餐饮，没有景点）
  if (days.length >= 2) {
    const lastDay = days[days.length - 1];
    const lastAttractions = [...lastDay.morning, ...lastDay.afternoon, ...lastDay.evening];
    if (lastAttractions.length === 0 && !lastDay.isTravelDay) {
      warnings.push(`第${lastDay.day}天未安排景点，已移除该空白日`);
      days.pop();
    }
  }

  // 2. 检查并修复跨天城市不一致
  for (let i = 0; i < days.length - 1; i++) {
    const today = days[i];
    const tomorrow = days[i + 1];

    // 如果今天交通或住宿里提到"前往XX"，明天必须到达XX
    const travelMatch = (today.transport + " " + today.accommodation).match(/前往([\u4e00-\u9fa5]+)/);
    if (travelMatch) {
      const targetCity = travelMatch[1];
      if (tomorrow.cityName !== targetCity) {
        warnings.push(`第${today.day}天提到前往${targetCity}，但第${tomorrow.day}天显示为${tomorrow.cityName}，已自动修正为${targetCity}`);
        tomorrow.cityName = targetCity;
        // 尝试从城市数据找到匹配的 cityId
        const matchedCity = CITIES.find((c) => c.cityName === targetCity);
        if (matchedCity) {
          tomorrow.cityId = matchedCity.cityId;
          tomorrow.area = matchedCity.defaultAreas?.[0] || tomorrow.area;
        }
      }
    }
  }

  // 3. 检查空白天并添加警告
  days.forEach((day) => {
    const attractions = [...day.morning, ...day.afternoon, ...day.evening];
    if (attractions.length === 0 && !day.isTravelDay) {
      warnings.push(`第${day.day}天（${day.cityName}）未安排任何景点，建议增加行程`);
    }
  });

  // 4. 景点去重：同一个 id 或 name 的景点在整个行程中只能出现一次
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  days.forEach((day) => {
    const slots: TimeSlot[] = ["morning", "afternoon", "evening"];
    slots.forEach((slot) => {
      const items = day[slot];
      const deduped: typeof items = [];
      items.forEach((item) => {
        const id = String(item.id || "");
        const name = String(item.name || "");
        if ((id && seenIds.has(id)) || (name && seenNames.has(name))) {
          warnings.push(`第${day.day}天重复安排了「${name || id}」，已自动去重`);
          return;
        }
        if (id) seenIds.add(id);
        if (name) seenNames.add(name);
        deduped.push(item);
      });
      day[slot] = deduped;
    });
  });


  // 5. 检查去重后是否产生新的空白天
  days.forEach((day) => {
    const attractions = [...day.morning, ...day.afternoon, ...day.evening];
    if (attractions.length === 0 && !day.isTravelDay) {
      warnings.push(`第${day.day}天（${day.cityName}）去重后未安排任何景点，建议增加行程`);
    }
  });

  // 6. 重新计算 cities 数组，确保与实际使用的城市一致
  const actualCities = Array.from(new Set(days.map((d) => d.cityName).filter(Boolean)));

  return {
    ...result,
    days,
    cities: actualCities.length > 0 ? actualCities : result.cities,
    warnings: warnings.slice(0, 6),
  };
}

// ==================== 服务端函数 ====================

/** 检查用户指定的城市是否在支持列表中 */
function isCitySupported(destination: string[]): boolean {
  if (!destination || destination.length === 0) return true;
  if (destination.includes("还没有明确想法，请推荐")) return true;
  return destination.every((dest) =>
    CITIES.some((c) =>
      c.cityName === dest ||
      c.cityId === dest ||
      dest.includes(c.cityName) ||
      c.cityName.includes(dest)
    )
  );
}

export const generateAiItinerary = createServerFn({ method: "POST" })
  .validator(userParamsSchema)
  .handler(async ({ data }): Promise<ItineraryResult> => {
    // 检查用户指定的城市是否在支持列表中
    if (!isCitySupported(data.destination)) {
      console.log(`[AI Itinerary] City "${data.destination}" not in supported list, falling back to local engine`);
      return generateItinerary({
        days: data.days,
        companions: data.companions as any,
        preferences: data.preferences,
        pace: data.pace as any,
        budget: data.budget,
        destination: data.destination,
      });
    }

    // 在 handler 内部读取（非模块顶层），兼容 Cloudflare Workers
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("缺少 DEEPSEEK_API_KEY 环境变量，请在 .env 文件中配置");
    }

    // 先搜索参考信息
    const searchApiKey = process.env.VOLCENGINE_SEARCH_API_KEY;
    let searchContext = "";
    if (searchApiKey) {
      try {
        const searchResult = await searchForContext(data as any, searchApiKey);
        searchContext = searchResult.context;
        console.log(`[AI Itinerary] Search complete: ${searchResult.docCount} docs from ${searchResult.queryCount} queries`);
      } catch (err) {
        console.warn("[AI Itinerary] Search failed, proceeding without search context:", err);
      }
    } else {
      console.log("[AI Itinerary] No VOLCENGINE_SEARCH_API_KEY, skipping search");
    }

    const systemPrompt = buildSystemPrompt(searchContext || undefined);
    const userPrompt = buildUserPrompt(data);

    console.log("[AI Itinerary] Starting generation for:", {
      days: data.days,
      companions: data.companions,
      pace: data.pace,
      destination: data.destination,
    });

    async function tryGenerate(attempt: number): Promise<ItineraryResult> {
      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: attempt > 1 ? `${userPrompt}\n\n注意：上一次生成的行程存在城市不一致、空白日或重复景点等问题，请严格按照规则重新生成，确保每个景点在整个行程中只出现一次。` : userPrompt },
            ],
            temperature: 0.5,
            max_tokens: 8192,
            response_format: { type: "json_object" },
            thinking: { type: "disabled" },
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[AI Itinerary] API error:", response.status, errorText);
          throw new Error(`DeepSeek API 返回错误 (${response.status}): ${errorText.slice(0, 200)}`);
        }

        const json = await response.json() as any;
        const content = json.choices?.[0]?.message?.content;

        if (!content) {
          console.error("[AI Itinerary] Empty response:", JSON.stringify(json).slice(0, 500));
          throw new Error("AI 未返回任何内容");
        }

        console.log("[AI Itinerary] Raw response length:", content.length);

        const cleaned = extractJson(content);
        const parsed = JSON.parse(cleaned);
        const itinerary = validateItineraryJson(parsed);

        console.log("[AI Itinerary] Generated:", {
          days: itinerary.days.length,
          cities: itinerary.cities,
          score: itinerary.score,
        });

        return postProcessItinerary(itinerary);
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error("[AI Itinerary] JSON parse error:", error.message);
          throw new Error("AI 返回的数据格式有误，请稍后重试");
        }
        throw error;
      }
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await tryGenerate(attempt);
        // 如果后处理没有严重警告，直接进入搜索增强
        const severeWarnings = result.warnings.filter((w) =>
          w.includes("未安排任何景点") || w.includes("不一致") || w.includes("重复")
        );
        if (severeWarnings.length === 0 || attempt === 2) {
          return result;
        }
        console.warn("[AI Itinerary] Severe warnings found, retrying:", severeWarnings);
      } catch (err) {
        if (attempt === 2) throw err;
        console.warn("[AI Itinerary] Attempt failed, retrying:", err);
      }
    }

    throw new Error("AI 行程生成失败，请稍后重试");
  });
