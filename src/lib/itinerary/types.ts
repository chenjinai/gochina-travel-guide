/**
 * 通用行程规划引擎 —— 类型定义层
 * 所有数据契约，不绑定任何具体城市
 */

// ==================== 基础类型 ====================

/** 坐标 [经度, 纬度] */
export type GeoCoord = [number, number];

/** 景点类型 */
export type AttractionType = "历史古迹" | "自然风光" | "博物馆" | "商圈美食" | "夜景演出";

/** 节奏档位 */
export type PaceType = "宽松版" | "标准版" | "紧凑版";

/** 同伴类型 */
export type CompanionType = "独自旅行" | "情侣/夫妻" | "朋友结伴" | "家庭出行" | "亲子出游";

/** 预算档位 */
export type BudgetLevel = "low" | "mid" | "high";

// ==================== 数据结构 ====================

/** 城市元数据 */
export interface CityMeta {
  cityId: string;
  cityName: string;
  province: string;
  cityLevel: string; // 如 "一线", "新一线", "二线"
  geoCoord: GeoCoord; // [lng, lat]
  defaultAreas: string[]; // 默认片区排序
  /** 城市标签，用于偏好匹配 */
  tags: Record<string, number>; // { "历史古都": 8, "美食城市": 6 }
}

/** 景点通用字段 —— 算法只依赖字段名，不绑定具体数据 */
export interface Attraction {
  id: string;
  name: string;
  cityId: string; // 所属城市
  area: string; // 所属片区
  type: AttractionType;
  duration: number; // 游玩时长（小时）
  intensity: 1 | 2 | 3 | 4 | 5; // 体力强度 1-5
  ticketPrice: number; // 门票价格（元，0表示免费）
  isClosedOnMonday: boolean;
  geoCoord: GeoCoord; // [lng, lat]
}

/** 用户输入参数 */
export interface UserParams {
  days: string; // 如 "3-4天"
  companions: CompanionType;
  preferences: string[]; // 偏好标签
  pace: PaceType;
  budget: string; // 如 "1000-2000元"
  destination: string[]; // 目标城市列表，空数组表示自动推荐
}

/** 内部解析后的用户参数 */
export interface ParsedUserParams {
  totalDays: number;
  companions: CompanionType;
  preferences: string[];
  pace: PaceType;
  budgetLevel: BudgetLevel;
  destination: string; // "auto" 或 "北京,上海" 或 "还没有明确想法，请推荐"
}

// ==================== 行程数据结构 ====================

/** 单个景点在行程中的实例 */
export interface ItineraryAttraction {
  id: string;
  name: string;
  type: AttractionType;
  duration: number;
  intensity: number;
  ticketPrice: number;
  area: string;
  geoCoord: GeoCoord;
}

/** 一天中的时段枚举 */
export type TimeSlot = "morning" | "afternoon" | "evening";

/** 单景点 + 时段信息 */
export interface TimeSlotItem {
  attraction: ItineraryAttraction;
  slot: TimeSlot;
  /** 与上一个景点之间的交通时间（分钟） */
  transitMinutes?: number;
}

/** 单天行程 */
export interface DayItinerary {
  day: number; // 第几天（1-based）
  cityId: string;
  cityName: string;
  area: string; // 当日核心片区
  isTravelDay: boolean; // 是否为移动日
  travelInfo?: {
    fromCity: string;
    toCity: string;
    transport: string;
    durationHours: number;
    departureTime: string;
    arrivalTime: string;
  };
  morning: ItineraryAttraction[];
  afternoon: ItineraryAttraction[];
  evening: ItineraryAttraction[];
  meals: {
    lunch: { duration: number; note: string };
    dinner: { duration: number; note: string };
  };
  transport: string;
  accommodation: string;
  /** 当日步行约几公里 */
  walkingKm: number;
  /** 节奏标签 */
  paceLabel: string;
  /** 总游玩时长（小时） */
  totalDuration: number;
}

/** 完整行程结果 */
export interface ItineraryResult {
  days: DayItinerary[];
  cities: string[]; // 涉及的城市名
  totalWalkingKm: number;
  totalTicketCost: number;
  /** 行程合理性评分（0-100） */
  score: number;
  /** 优化说明 */
  optimizations: string[];
  /** 校验警告 */
  warnings: string[];
}

// ==================== 校验相关 ====================

/** 校验问题级别 */
export type ValidationLevel = "error" | "warning" | "info";

/** 校验结果项 */
export interface ValidationIssue {
  level: ValidationLevel;
  rule: string; // 规则名，如 "area_mismatch"
  message: string;
  dayIndex?: number; // 关联的日期索引
  autoFixed: boolean; // 是否已自动修复
}

/** 校验结果 */
export interface ValidationResult {
  score: number; // 0-100
  issues: ValidationIssue[];
}

// ==================== 配置参数 ====================

/** 节奏配置 */
export interface PaceConfig {
  name: PaceType;
  maxHoursPerDay: number;
  maxIntensity: number;
  maxAttractionsPerDay: number;
  description: string;
}

/** 预算配置 */
export interface BudgetConfig {
  level: BudgetLevel;
  maxTicketPerDay: number;
  transportType: string;
  hotelLevel: string;
  description: string;
}

/** 人群适配配置 */
export interface CompanionConfig {
  type: CompanionType;
  intensityCap: number; // 强度上限
  attractionMultiplier: number; // 景点数量乘数
  enableNightActivity: boolean;
  preferPublicTransport: boolean;
  description: string;
}
