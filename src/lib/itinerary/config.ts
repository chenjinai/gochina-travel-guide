/**
 * 通用行程规划引擎 —— 配置参数层
 * 所有可调节的阈值、常量集中管理
 */

import type { PaceConfig, BudgetConfig, CompanionConfig, PaceType, BudgetLevel, CompanionType } from "./types";

// ==================== 节奏配置 ====================

export const PACE_CONFIGS: Record<PaceType, PaceConfig> = {
  "宽松版": {
    name: "宽松版",
    maxHoursPerDay: 7,
    maxIntensity: 3,
    maxAttractionsPerDay: 3,
    description: "悠闲慢逛，充分休息",
  },
  "标准版": {
    name: "标准版",
    maxHoursPerDay: 9,
    maxIntensity: 4,
    maxAttractionsPerDay: 4,
    description: "节奏适中，张弛有度",
  },
  "紧凑版": {
    name: "紧凑版",
    maxHoursPerDay: 11,
    maxIntensity: 5,
    maxAttractionsPerDay: 5,
    description: "高效利用，充实紧凑",
  },
};

// ==================== 预算配置 ====================

export const BUDGET_CONFIGS: Record<BudgetLevel, BudgetConfig> = {
  low: {
    level: "low",
    maxTicketPerDay: 150,
    transportType: "公共交通",
    hotelLevel: "经济型",
    description: "精打细算，免费优先",
  },
  mid: {
    level: "mid",
    maxTicketPerDay: 350,
    transportType: "地铁+打车",
    hotelLevel: "舒适型",
    description: "性价比高，舒适出行",
  },
  high: {
    level: "high",
    maxTicketPerDay: 800,
    transportType: "专车/租车",
    hotelLevel: "高端酒店",
    description: "品质优先，舒适享受",
  },
};

// ==================== 人群适配配置 ====================

export const COMPANION_CONFIGS: Record<CompanionType, CompanionConfig> = {
  "独自旅行": {
    type: "独自旅行",
    intensityCap: 5,
    attractionMultiplier: 1.0,
    enableNightActivity: true,
    preferPublicTransport: true,
    description: "灵活自由，公共交通优先",
  },
  "情侣/夫妻": {
    type: "情侣/夫妻",
    intensityCap: 4,
    attractionMultiplier: 1.0,
    enableNightActivity: true,
    preferPublicTransport: false,
    description: "浪漫为主，兼顾舒适",
  },
  "朋友结伴": {
    type: "朋友结伴",
    intensityCap: 5,
    attractionMultiplier: 1.1,
    enableNightActivity: true,
    preferPublicTransport: false,
    description: "活力满满，夜生活丰富",
  },
  "家庭出行": {
    type: "家庭出行",
    intensityCap: 3,
    attractionMultiplier: 0.85,
    enableNightActivity: false,
    preferPublicTransport: true,
    description: "老少皆宜，节奏舒缓",
  },
  "亲子出游": {
    type: "亲子出游",
    intensityCap: 3,
    attractionMultiplier: 0.8,
    enableNightActivity: false,
    preferPublicTransport: true,
    description: "趣味为主，安全第一",
  },
};

// ==================== 时间常量（小时） ====================

export const TIME_CONSTANTS = {
  /** 景点间交通时间（小时） */
  transitBetweenAttractions: 0.5,
  /** 午餐时长 */
  lunchDuration: 1.5,
  /** 晚餐时长 */
  dinnerDuration: 1.0,
  /** 每日缓冲时间 */
  dailyBuffer: 0.5,
  /** 跨城日游玩时长上限（仅半天） */
  travelDayMaxHours: 4,
  /** 移动日默认交通时间 */
  defaultTravelHours: 3,
  /** 相邻景点最大允许通勤时间（小时），超过视为异常 */
  maxCommuteHours: 1.5,
} as const;

// ==================== 评分权重 ====================

export const SCORE_WEIGHTS = {
  /** 片区集中度 */
  areaConcentration: 25,
  /** 时间合理性 */
  timeReasonableness: 20,
  /** 体力分配 */
  intensityBalance: 20,
  /** 动线优化 */
  routeOptimization: 15,
  /** 预算匹配 */
  budgetMatch: 10,
  /** 偏好匹配 */
  preferenceMatch: 10,
} as const;

// ==================== 地理估算规则 ====================

/** 城市间交通时长估算（小时） */
export function estimateTravelHours(cityA: string, cityB: string): number {
  // 同省城市
  const sameProvince: Record<string, string[]> = {
    "浙江": ["杭州", "绍兴", "宁波"],
    "江苏": ["南京", "苏州", "无锡", "徐州"],
    "辽宁": ["沈阳", "大连"],
    "陕西": ["西安"],
    "北京": ["北京"],
    "上海": ["上海"],
    "四川": ["成都"],
    "广东": ["广州", "深圳"],
    "湖南": ["长沙", "张家界"],
    "湖北": ["武汉"],
    "福建": ["福州", "厦门"],
    "山东": ["济南", "青岛"],
    "安徽": ["合肥"],
    "江西": ["南昌"],
    "广西": ["南宁"],
    "吉林": ["延吉"],
    "青海": ["西宁", "青海湖", "茶卡盐湖", "德令哈", "大柴旦"],
    "甘肃": ["敦煌", "嘉峪关", "张掖", "兰州"],
  };

  const getProvince = (city: string) => {
    for (const [prov, cities] of Object.entries(sameProvince)) {
      if (cities.includes(city)) return prov;
    }
    return null;
  };

  const provA = getProvince(cityA);
  const provB = getProvince(cityB);

  if (!provA || !provB) return 4; // 未知城市默认4小时
  if (provA === provB) return 1.5 + Math.random() * 1; // 同省 1.5-2.5h
  if (Math.abs(provA.length - provB.length) < 2) return 2.5 + Math.random() * 1.5; // 邻近省 2.5-4h
  return 4 + Math.random() * 4; // 跨大区 4-8h
}

// ==================== 辅助函数 ====================

/** 解析天数文本 → 数字 */
export function parseDays(daysText: string): number {
  const match = daysText.match(/(\d+)(?:-(\d+))?/);
  if (!match) return 4;
  if (match[2]) {
    return Math.floor((parseInt(match[1]) + parseInt(match[2])) / 2);
  }
  return parseInt(match[1]);
}

/** 解析预算 → 档位 */
export function parseBudget(budgetText: string): BudgetLevel {
  if (budgetText.includes("500") && !budgetText.includes("1000")) return "low";
  if (budgetText.includes("3000") || budgetText.includes("以上")) return "high";
  return "mid";
}

/** 解析节奏 → 标准格式 */
export function parsePace(paceText: string): PaceType {
  if (paceText.includes("轻松") || paceText.includes("宽松")) return "宽松版";
  if (paceText.includes("紧凑") || paceText.includes("挑战")) return "紧凑版";
  return "标准版";
}
