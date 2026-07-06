/**
 * 签证查询工具 — 根据国籍快速返回免签/签证状态
 * 数据基于 2026 年最新中国签证政策
 */

interface VisaResult {
  type: "unilateral" | "mutual" | "transit" | "required";
  label: string;       // 免签类型标签
  stay: string;        // 停留天数
  note: string;        // 补充说明
  color: string;       // 状态颜色
}

// ==================== 互免签证协议国家 ====================
// 双方公民均可免签进入对方国家
const MUTUAL: Record<string, { stay: string; note?: string }> = {
  singapore:        { stay: "30天", note: "每自然年不超过90天" },
  thailand:         { stay: "30天", note: "中泰互免，2024年3月起永久生效" },
  malaysia:         { stay: "30天", note: "中马互免，2023年12月起生效" },
  georgia:          { stay: "30天", note: "单次停留不超过30天" },
  kazakhstan:       { stay: "30天", note: "每180天内累计不超过90天" },
  azerbaijan:       { stay: "30天" },
  armenia:          { stay: "90天", note: "每180天周期内" },
  serbia:           { stay: "30天" },
  bosnia:           { stay: "90天", note: "每180天周期内" },
  belarus:          { stay: "30天" },
  albania:          { stay: "90天", note: "每180天周期内" },
  uae:              { stay: "30天", note: "2018年1月起" },
  qatar:            { stay: "30天" },
  maldives:         { stay: "30天" },
  mauritius:        { stay: "30天", note: "每60天内累计不超过30天" },
  seychelles:       { stay: "30天" },
  bahamas:          { stay: "30天" },
  barbados:         { stay: "30天" },
  fiji:             { stay: "30天" },
  grenada:          { stay: "30天" },
  ecuador:          { stay: "90天" },
  dominica:         { stay: "30天" },
  tonga:            { stay: "30天" },
  suriname:         { stay: "30天" },
  jamaica:          { stay: "30天" },
  "san marino":     { stay: "90天" },
  brunei:           { stay: "14天" },
};

// ==================== 单方面免签国家（2024年11月起扩展至38国，停留30天）====================
// 中国单方面允许这些国家公民免签入境（旅游、商务、探亲、过境）
const UNILATERAL: Record<string, string> = {
  // 西欧
  france: "法国", germany: "德国", italy: "意大利", netherlands: "荷兰",
  spain: "西班牙", switzerland: "瑞士", ireland: "爱尔兰", austria: "奥地利",
  belgium: "比利时", luxembourg: "卢森堡", portugal: "葡萄牙", greece: "希腊",
  // 北欧
  norway: "挪威", denmark: "丹麦", finland: "芬兰", iceland: "冰岛", sweden: "瑞典",
  // 中东欧
  poland: "波兰", hungary: "匈牙利", czech: "捷克", slovakia: "斯洛伐克",
  slovenia: "斯洛文尼亚", croatia: "克罗地亚", estonia: "爱沙尼亚",
  latvia: "拉脱维亚", lithuania: "立陶宛", bulgaria: "保加利亚", romania: "罗马尼亚",
  // 南欧
  malta: "马耳他", cyprus: "塞浦路斯", montenegro: "黑山", "north macedonia": "北马其顿",
  // 微型国家
  monaco: "摩纳哥", liechtenstein: "列支敦士登", andorra: "安道尔",
  // 亚太
  "south korea": "韩国", japan: "日本", australia: "澳大利亚", "new zealand": "新西兰",
};

// ==================== 240小时过境免签（原144小时，2024年12月升级为240小时）====================
// 适用于从中国过境前往第三国的旅客，限指定口岸
const TRANSIT_COUNTRIES = new Set([
  // 美洲
  "united states", "canada", "brazil", "mexico", "argentina", "chile", "peru",
  // 欧洲（尚未在互免/单免列表中的）
  "united kingdom", "russia", "ukraine", "moldova",
  // 中东
  "saudi arabia", "kuwait", "bahrain", "oman", "iran", "israel", "turkey",
  // 非洲
  "tunisia", "morocco", "south africa", "egypt",
  // 亚洲
  "india", "indonesia", "vietnam", "philippines", "mongolia", "pakistan",
  "bangladesh", "myanmar", "laos", "cambodia", "nepal", "sri lanka",
  // 中亚
  "uzbekistan", "tajikistan", "kyrgyzstan", "turkmenistan",
]);

// ==================== 中文别名映射 ====================
// 支持用户输入中文国家名
const CN_ALIASES: Record<string, string> = {
  "中国": "china", "中国大陆": "china", "香港": "hong kong", "澳门": "macau", "台湾": "taiwan",
  "美国": "united states", "美国/usa": "united states", "usa": "united states",
  "英国": "united kingdom", "uk": "united kingdom",
  "加拿大": "canada", "澳大利亚": "australia", "澳洲": "australia",
  "新西兰": "new zealand", "日本": "japan", "韩国": "south korea",
  "新加坡": "singapore", "马来西亚": "malaysia", "泰国": "thailand",
  "法国": "france", "德国": "germany", "意大利": "italy",
  "西班牙": "spain", "荷兰": "netherlands", "瑞士": "switzerland",
  "比利时": "belgium", "奥地利": "austria", "爱尔兰": "ireland",
  "葡萄牙": "portugal", "希腊": "greece", "瑞典": "sweden",
  "丹麦": "denmark", "挪威": "norway", "芬兰": "finland", "冰岛": "iceland",
  "波兰": "poland", "匈牙利": "hungary", "捷克": "czech",
  "斯洛伐克": "slovakia", "克罗地亚": "croatia", "保加利亚": "bulgaria",
  "罗马尼亚": "romania", "卢森堡": "luxembourg", "马耳他": "malta",
  "爱沙尼亚": "estonia", "拉脱维亚": "latvia", "立陶宛": "lithuania",
  "印度": "india", "俄罗斯": "russia", "巴西": "brazil", "墨西哥": "mexico",
  "阿联酋": "uae", "塞尔维亚": "serbia", "卡塔尔": "qatar",
  "沙特": "saudi arabia", "沙特阿拉伯": "saudi arabia",
  "越南": "vietnam", "菲律宾": "philippines", "印尼": "indonesia",
  "印度尼西亚": "indonesia", "土耳其": "turkey", "南非": "south africa",
  "文莱": "brunei", "格鲁吉亚": "georgia", "哈萨克斯坦": "kazakhstan",
  "白俄罗斯": "belarus", "阿塞拜疆": "azerbaijan", "亚美尼亚": "armenia",
  "马尔代夫": "maldives", "阿尔巴尼亚": "albania", "牙买加": "jamaica",
  "斐济": "fiji", "巴哈马": "bahamas", "巴巴多斯": "barbados",
  "厄瓜多尔": "ecuador", "苏里南": "suriname", "多米尼克": "dominica",
  "毛里求斯": "mauritius", "塞舌尔": "seychelles", "格林纳达": "grenada",
  "汤加": "tonga", "圣马力诺": "san marino", "波黑": "bosnia", "黑山": "montenegro",
  "斯洛文尼亚": "slovenia", "塞浦路斯": "cyprus",
};

function normalizeCountry(input: string): string {
  const trimmed = input.trim().toLowerCase();
  // 先检查中文别名
  if (CN_ALIASES[trimmed]) {
    return CN_ALIASES[trimmed];
  }
  return trimmed;
}

export function lookupVisa(nationality: string): VisaResult | null {
  const country = normalizeCountry(nationality);
  if (!country) return null;

  // 1. 中国公民/港澳台 → 不需要签证
  if (["china", "hong kong", "macau", "taiwan"].includes(country)) {
    return {
      type: "mutual",
      label: "无需签证",
      stay: "无限期",
      note: "中国公民及港澳台居民可自由往来",
      color: "green",
    };
  }

  // 2. 互免签证（最优）
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

  // 3. 单方面免签
  if (UNILATERAL[country]) {
    return {
      type: "unilateral",
      label: "单方面免签",
      stay: "30天",
      note: "旅游、商务、探亲或过境均可，无需任何手续",
      color: "green",
    };
  }

  // 4. 240小时过境免签
  if (TRANSIT_COUNTRIES.has(country)) {
    return {
      type: "transit",
      label: "240小时过境免签",
      stay: "10天（240小时）",
      note: "需持有前往第三国的联程机票，限指定口岸入境。可在允许区域内跨省旅行",
      color: "amber",
    };
  }

  // 5. 需要签证
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
