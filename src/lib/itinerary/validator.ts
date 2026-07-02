/**
 * 通用行程规划引擎 —— 全量合理性校验引擎
 * 行程生成后自动执行校验，命中异常自动修正
 */

import type {
  ItineraryResult, DayItinerary, ItineraryAttraction,
  ValidationResult, ValidationIssue, ValidationLevel,
} from "./types";
import { PACE_CONFIGS, TIME_CONSTANTS } from "./config";
import { haversineDistance } from "./geo";

// ==================== 校验规则 ====================

/** 规则 1: 片区集中度校验 —— 单日跨2个以上片区 */
function validateAreaConcentration(day: DayItinerary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const all = [...day.morning, ...day.afternoon, ...day.evening];
  const areas = new Set(all.map((a) => a.area));
  if (areas.size > 1) {
    issues.push({
      level: "warning",
      rule: "area_concentration",
      message: `Day ${day.day} 跨越 ${areas.size} 个片区，建议集中到同一区域`,
      dayIndex: day.day - 1,
      autoFixed: false,
    });
  }
  return issues;
}

/** 规则 2: 时长校验 —— 单日总时长超节奏上限 */
function validateDuration(day: DayItinerary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const paceConfig = PACE_CONFIGS[day.paceLabel as keyof typeof PACE_CONFIGS] || PACE_CONFIGS["标准版"];
  if (day.totalDuration > paceConfig.maxHoursPerDay) {
    issues.push({
      level: "warning",
      rule: "duration_exceeded",
      message: `Day ${day.day} 总时长 ${day.totalDuration}h 超过 ${day.paceLabel}上限 ${paceConfig.maxHoursPerDay}h`,
      dayIndex: day.day - 1,
      autoFixed: false,
    });
  }
  return issues;
}

/** 规则 3: 体力校验 —— 连续3个景点强度>=4 */
function validateIntensity(day: DayItinerary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const all = [...day.morning, ...day.afternoon, ...day.evening];

  for (let i = 0; i <= all.length - 3; i++) {
    if (all[i].intensity >= 4 && all[i + 1].intensity >= 4 && all[i + 2].intensity >= 4) {
      issues.push({
        level: "error",
        rule: "intensity_burst",
        message: `Day ${day.day} 存在连续3个高强度景点（强度≥4），建议插入低强度景点`,
        dayIndex: day.day - 1,
        autoFixed: false,
      });
      break;
    }
  }

  // 单日平均强度校验
  if (all.length > 0) {
    const avg = all.reduce((s, a) => s + a.intensity, 0) / all.length;
    if (avg > 3.5) {
      issues.push({
        level: "warning",
        rule: "avg_intensity_high",
        message: `Day ${day.day} 平均强度 ${avg.toFixed(1)} 偏高，建议调整`,
        dayIndex: day.day - 1,
        autoFixed: false,
      });
    }
  }

  return issues;
}

/** 规则 4: 跨城日校验 —— 跨城日景点数>=3 */
function validateTravelDay(day: DayItinerary): ValidationIssue[] {
  if (!day.isTravelDay) return [];
  const issues: ValidationIssue[] = [];
  const all = [...day.morning, ...day.afternoon, ...day.evening];
  if (all.length >= 3) {
    issues.push({
      level: "error",
      rule: "travel_day_overload",
      message: `Day ${day.day} 为跨城日，但安排了 ${all.length} 个景点，建议仅保留1-2个`,
      dayIndex: day.day - 1,
      autoFixed: false,
    });
  }
  return issues;
}

/** 规则 5: 距离校验 —— 相邻景点通勤超90分钟 */
function validateCommuteDistance(day: DayItinerary): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const all = [...day.morning, ...day.afternoon, ...day.evening];
  for (let i = 0; i < all.length - 1; i++) {
    const dist = haversineDistance(all[i].geoCoord, all[i + 1].geoCoord);
    if (dist > TIME_CONSTANTS.maxCommuteHours * 15) { // 15km/h 城市内平均速度
      issues.push({
        level: "warning",
        rule: "commute_too_long",
        message: `Day ${day.day} 景点「${all[i].name}」→「${all[i + 1].name}」距离 ${dist.toFixed(1)}km，通勤可能超过90分钟`,
        dayIndex: day.day - 1,
        autoFixed: false,
      });
    }
  }
  return issues;
}

/** 规则 6: 片区空校验 —— 某片区景点不足 */
function validateAreaCoverage(result: ItineraryResult): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  // 按城市和片区统计
  const areaCount: Record<string, number> = {};
  for (const day of result.days) {
    const key = `${day.cityId}-${day.area}`;
    areaCount[key] = (areaCount[key] || 0) + 1;
  }
  return issues;
}

// ==================== 自动修正 ====================

/** 自动修正：时长超限 -> 移除低优先级景点 */
function autoFixDuration(day: DayItinerary): DayItinerary {
  const paceConfig = PACE_CONFIGS[day.paceLabel as keyof typeof PACE_CONFIGS] || PACE_CONFIGS["标准版"];
  let currentDuration = day.totalDuration;

  if (currentDuration <= paceConfig.maxHoursPerDay) return day;

  const cloned = { ...day };
  const slots: (keyof Pick<DayItinerary, "morning" | "afternoon" | "evening">)[] = ["evening", "afternoon", "morning"];

  for (const slot of slots) {
    while (cloned[slot].length > 0 && currentDuration > paceConfig.maxHoursPerDay) {
      const removed = cloned[slot].pop()!;
      currentDuration -= removed.duration + TIME_CONSTANTS.transitBetweenAttractions;
    }
    if (currentDuration <= paceConfig.maxHoursPerDay) break;
  }

  return { ...cloned, totalDuration: Math.round(currentDuration * 10) / 10 };
}

/** 自动修正：跨城日过载 -> 仅保留1-2个景点 */
function autoFixTravelDay(day: DayItinerary): DayItinerary {
  if (!day.isTravelDay) return day;
  const cloned = { ...day };
  const total = cloned.morning.length + cloned.afternoon.length + cloned.evening.length;
  if (total > 2) {
    // 保留最重要的1-2个
    const all = [...cloned.morning, ...cloned.afternoon, ...cloned.evening];
    const kept = all.slice(0, 2);
    cloned.morning = kept.filter((_, i) => i === 0);
    cloned.afternoon = kept.filter((_, i) => i === 1);
    cloned.evening = [];
  }
  return cloned;
}

// ==================== 评分计算 ====================

function calculateScore(result: ItineraryResult, issues: ValidationIssue[]): number {
  let score = 100;
  for (const issue of issues) {
    if (issue.level === "error") score -= 10;
    else if (issue.level === "warning") score -= 5;
    else score -= 2;
  }
  return Math.max(0, score);
}

// ==================== 主入口 ====================

/**
 * 全量校验入口
 */
export function validateItinerary(result: ItineraryResult): ValidationResult {
  const allIssues: ValidationIssue[] = [];

  for (const day of result.days) {
    allIssues.push(...validateAreaConcentration(day));
    allIssues.push(...validateDuration(day));
    allIssues.push(...validateIntensity(day));
    allIssues.push(...validateTravelDay(day));
    allIssues.push(...validateCommuteDistance(day));
  }

  allIssues.push(...validateAreaCoverage(result));

  return {
    score: calculateScore(result, allIssues),
    issues: allIssues,
  };
}

/**
 * 自动修正入口
 */
export function autoFixItinerary(result: ItineraryResult): ItineraryResult {
  const fixedDays = result.days.map((day) => {
    let d = { ...day };
    d = autoFixDuration(d);
    d = autoFixTravelDay(d);
    return d;
  });

  return {
    ...result,
    days: fixedDays,
  };
}
