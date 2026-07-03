/**
 * 豆包搜索 Global版 模块
 * 在生成行程前根据用户表单关键词搜索实时参考信息，注入 DeepSeek prompt
 *
 * API: https://open.feedcoopapi.com/search_api/global_search
 * 限流: 5 QPS，每月免费 500 次
 */

import type { UserParams } from "./types";

// ==================== API 配置 ====================

const VOLCSEARCH_API_URL = "https://open.feedcoopapi.com/search_api/global_search";
const SEARCH_TIMEOUT_MS = 8000;

// ==================== 类型定义 ====================

interface VolcSearchSnippet {
  Type: string; // "text" | "image"
  Text?: string;
}

interface VolcSearchDocument {
  Rank: number;
  Url: string;
  Title: string;
  Snippet: VolcSearchSnippet[];
}

interface VolcSearchResult {
  TotalDocCount: number;
  Documents: VolcSearchDocument[];
  ErrorCode: number;
  ErrorMsg: string;
}

interface VolcSearchResponse {
  ResponseMetadata: {
    RequestId: string;
    Error?: { Code: string; Message: string };
  };
  Result: VolcSearchResult | null;
}

// ==================== API 调用 ====================

async function volcSearchSingle(query: string, apiKey: string): Promise<VolcSearchDocument[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const response = await fetch(VOLCSEARCH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        Query: query.slice(0, 100), // API 限制 1-100 字符
        DocCount: 5,
        MaxSnippetLength: 800,
        MaxImageCountPerDoc: 0, // 不需要图片，减少数据量
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`豆包搜索 API 返回错误 (${response.status})`);
    }

    const data = (await response.json()) as VolcSearchResponse;

    if (data.ResponseMetadata.Error) {
      throw new Error(`豆包搜索错误: ${data.ResponseMetadata.Error.Message}`);
    }

    if (!data.Result || data.Result.ErrorCode !== 0) {
      throw new Error(`豆包搜索结果错误: ${data.Result?.ErrorMsg || "未知错误"}`);
    }

    return data.Result.Documents || [];
  } finally {
    clearTimeout(timeoutId);
  }
}

// ==================== 搜索关键词构建 ====================

/**
 * 根据用户表单参数，智能构建 3-5 条搜索 query
 */
export function buildSearchQueries(params: UserParams): string[] {
  const queries: string[] = [];
  const destinations = params.destination?.filter(
    (d) => d && d !== "还没有明确想法，请推荐"
  ) || [];

  // 1. 每个目的地：核心景点 + 门票价格
  for (const dest of destinations.slice(0, 3)) {
    queries.push(`${dest} 旅游攻略 必去景点 门票价格 开放时间 2026`);
  }

  // 2. 偏好标签匹配
  if (params.preferences?.length > 0) {
    const pref = params.preferences.slice(0, 2).join(" ");
    const city = destinations.length > 0 ? destinations[0] : "中国";
    queries.push(`${city} ${pref} 景点推荐 游玩建议`);
  }

  // 3. 预算 + 同伴类型适配
  if (destinations.length > 0) {
    const budgetLabel = params.budget?.includes("500") ? "穷游省钱" :
      params.budget?.includes("3000") ? "品质高端" : "性价比";
    const companionLabel = params.companions?.includes("亲子") ? "亲子游" :
      params.companions?.includes("情侣") ? "情侣打卡" :
      params.companions?.includes("家庭") ? "家庭出行" : "自由行";
    queries.push(`${destinations[0]} ${budgetLabel} ${companionLabel} 行程推荐`);
  }

  // 4. 多城联游（≥2个目的地且≥5天）
  if (destinations.length >= 2 && params.days && parseInt(params.days) >= 5) {
    queries.push(`${destinations.join(" ")} 联游路线 ${params.days}天 行程安排`);
  }

  // 5. 无明确目的地时，用偏好推荐
  if (destinations.length === 0 && params.preferences?.length > 0) {
    queries.push(`中国 ${params.preferences.slice(0, 2).join(" ")} 旅游目的地推荐 ${params.days || ""}天`);
  }

  // 6. 住宿美食
  if (destinations.length > 0) {
    queries.push(`${destinations[0]} 住宿推荐 美食攻略 人均消费`);
  }

  // 去重 & 限制最多5条
  return [...new Set(queries)].slice(0, 5);
}

// ==================== 结果格式化 ====================

/**
 * 将搜索结果格式化为可注入 prompt 的文本
 */
function formatSearchDocs(docs: VolcSearchDocument[]): string {
  if (docs.length === 0) return "";

  const lines: string[] = [];

  for (const doc of docs) {
    const title = doc.Title?.trim();
    const texts = doc.Snippet
      .filter((s) => s.Type === "text" && s.Text)
      .map((s) => s.Text!.trim())
      .join("\n");

    if (texts) {
      lines.push(`### ${title || "搜索结果"}`);
      // 截断过长内容，保留关键信息
      lines.push(texts.slice(0, 500));
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ==================== 主入口 ====================

interface SearchContextResult {
  /** 格式化后的搜索上下文文本，可直接注入 prompt */
  context: string;
  /** 搜索覆盖的 query 数量 */
  queryCount: number;
  /** 成功获取的文档数 */
  docCount: number;
}

/**
 * 根据用户表单参数进行搜索，返回可注入 DeepSeek prompt 的上下文。
 * 所有搜索并行执行，单次失败不影响其他；整体失败返回空上下文（降级）。
 */
export async function searchForContext(
  params: UserParams,
  apiKey?: string,
): Promise<SearchContextResult> {
  const key = apiKey || process.env.VOLCENGINE_SEARCH_API_KEY;

  if (!key) {
    console.warn("[VolcSearch] No API key available, skipping search");
    return { context: "", queryCount: 0, docCount: 0 };
  }

  const queries = buildSearchQueries(params);
  if (queries.length === 0) {
    return { context: "", queryCount: 0, docCount: 0 };
  }

  console.log(`[VolcSearch] Starting ${queries.length} parallel searches...`);

  // 并行执行所有搜索
  const results = await Promise.allSettled(
    queries.map((q) => volcSearchSingle(q, key))
  );

  // 收集所有文档
  const allDocs: VolcSearchDocument[] = [];
  let successCount = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      allDocs.push(...result.value);
      successCount++;
    }
  }

  console.log(`[VolcSearch] ${successCount}/${queries.length} queries succeeded, ${allDocs.length} docs total`);

  if (allDocs.length === 0) {
    return { context: "", queryCount: queries.length, docCount: 0 };
  }

  const context = formatSearchDocs(allDocs);
  return {
    context,
    queryCount: queries.length,
    docCount: allDocs.length,
  };
}
