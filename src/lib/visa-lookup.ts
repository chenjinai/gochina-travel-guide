/**
 * 签证查询工具 — 根据国籍快速返回免签/签证状态
 */

interface VisaResult {
  type: "unilateral" | "mutual" | "transit" | "required";
  label: string;       // 免签类型标签，如 "单方面免签"
  stay: string;        // 停留天数，如 "15天"
  note: string;        // 补充说明
  color: string;       // 状态颜色
}

// 单方面免签国家（2024年12月起，2025年扩展）
const UNILATERAL: Record<string, string> = {
  france: "法国", germany: "德国", italy: "意大利", netherlands: "荷兰",
  spain: "西班牙", switzerland: "瑞士", ireland: "爱尔兰", hungary: "匈牙利",
  austria: "奥地利", belgium: "比利时", luxembourg: "卢森堡",
  "new zealand": "新西兰", australia: "澳大利亚", poland: "波兰", malaysia: "马来西亚",
};

// 互免签证协议国家
const MUTUAL: Record<string, { stay: string; note?: string }> = {
  singapore: { stay: "30天", note: "每自然年不超过90天" },
  thailand: { stay: "30天", note: "2024年3月起生效" },
  georgia: { stay: "30天" },
  azerbaijan: { stay: "30天" },
  kazakhstan: { stay: "14天", note: "2024年新增" },
  serbia: { stay: "30天" },
  "bosnia": { stay: "90天", note: "每180天周期内" },
  belarus: { stay: "30天" },
  albania: { stay: "90天", note: "每180天周期内" },
  uae: { stay: "30天", note: "2018年1月起" },
  maldives: { stay: "30天" },
  jamaica: { stay: "30天" },
};

// 144小时过境免签适用国家（53国）
const TRANSIT_COUNTRIES = new Set([
  "france", "germany", "italy", "spain", "portugal", "netherlands", "belgium",
  "luxembourg", "austria", "switzerland", "sweden", "denmark", "norway", "finland",
  "iceland", "greece", "czech", "slovakia", "hungary", "poland", "slovenia",
  "croatia", "estonia", "latvia", "lithuania", "malta", "cyprus", "romania",
  "bulgaria", "liechtenstein",
  "united kingdom", "ireland", "russia",
  "united states", "canada", "brazil", "mexico", "argentina", "chile",
  "australia", "new zealand",
  "south korea", "japan", "singapore", "brunei",
  "uae", "qatar", "bahrain", "kuwait", "saudi arabia", "oman",
  "serbia", "bosnia", "montenegro", "north macedonia", "albania",
  "iran", "tunisia", "kazakhstan",
]);

function normalizeCountry(input: string): string {
  return input.trim().toLowerCase();
}

export function lookupVisa(nationality: string): VisaResult | null {
  const country = normalizeCountry(nationality);
  if (!country) return null;

  // 1. 优先匹配互免签证
  const mutual = MUTUAL[country];
  if (mutual) {
    return {
      type: "mutual",
      label: "互免签证",
      stay: mutual.stay,
      note: mutual.note || "",
      color: "green",
    };
  }

  // 2. 匹配单方面免签
  if (UNILATERAL[country]) {
    return {
      type: "unilateral",
      label: "单方面免签",
      stay: "15天",
      note: "仅限旅游、商务或探亲，不可工作或学习",
      color: "green",
    };
  }

  // 3. 匹配144小时过境免签
  if (TRANSIT_COUNTRIES.has(country)) {
    return {
      type: "transit",
      label: "144小时过境免签",
      stay: "6天（144小时）",
      note: "需持有第三国联程机票，限指定口岸入境",
      color: "amber",
    };
  }

  // 4. 需要签证
  return {
    type: "required",
    label: "需要办理签证",
    stay: "",
    note: "请前往中国签证申请服务中心办理L（旅游）签证",
    color: "red",
  };
}

/** 获取常用国籍列表用于下拉建议 */
export const POPULAR_NATIONALITIES = [
  "United States", "United Kingdom", "Canada", "Australia", "New Zealand",
  "France", "Germany", "Italy", "Spain", "Netherlands",
  "Singapore", "Malaysia", "Thailand", "Japan", "South Korea",
  "Russia", "Brazil", "India", "UAE", "Serbia",
];
