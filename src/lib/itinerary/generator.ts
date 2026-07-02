/**
 * 通用行程规划引擎 —— 核心生成算法
 * 不依赖任何具体城市/景点名，纯数据驱动
 */

import type {
  CityMeta, Attraction, UserParams, ParsedUserParams,
  ItineraryResult, DayItinerary, ItineraryAttraction,
  PaceType, BudgetLevel, CompanionType,
} from "./types";
import { CITIES, ATTRACTIONS, getCityById, getAttractionsByCity, getAttractionsByArea, getAreasByCity, recommendCitiesByPreferences, fuzzyMatchCity } from "./data";
import { PACE_CONFIGS, BUDGET_CONFIGS, COMPANION_CONFIGS, TIME_CONSTANTS, parseDays, parseBudget, parsePace } from "./config";
import { sortByShortestPath, sortCitiesByNearestNeighbor, calculateWalkingDistance, haversineDistance } from "./geo";

// ==================== 类型转换 ====================

function toItineraryAttraction(a: Attraction): ItineraryAttraction {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    duration: a.duration,
    intensity: a.intensity,
    ticketPrice: a.ticketPrice,
    area: a.area,
    geoCoord: a.geoCoord,
  };
}

function parseUserParams(params: UserParams): ParsedUserParams {
  return {
    totalDays: parseDays(params.days),
    companions: params.companions as CompanionType,
    preferences: params.preferences,
    pace: parsePace(params.pace),
    budgetLevel: parseBudget(params.budget),
    destination: params.destination?.length ? params.destination.join(",") : "auto",
  };
}

// ==================== 城市选择与分配 ====================

interface CityAllocation {
  city: CityMeta;
  days: number;
}

/**
 * 确定行程涉及的城市及天数分配
 */
function allocateCities(parsed: ParsedUserParams): CityAllocation[] {
  const totalDays = parsed.totalDays;

  // 用户指定了城市（单城或多城）
  if (parsed.destination && parsed.destination !== "auto" && parsed.destination !== "还没有明确想法，请推荐") {
    // 解析多城市（逗号分隔）
    const destinations = parsed.destination.split(",").map((d) => d.trim()).filter(Boolean);
    const matchedCities: CityMeta[] = [];
    for (const dest of destinations) {
      const cityId = fuzzyMatchCity(dest);
      if (cityId) {
        const city = getCityById(cityId);
        if (city) matchedCities.push(city);
      }
    }

    if (matchedCities.length > 0) {
      if (matchedCities.length === 1) {
        return [{ city: matchedCities[0], days: totalDays }];
      }
      // 多城分配天数
      const sorted = sortCitiesByNearestNeighbor(matchedCities);
      const cities = sorted.slice(0, Math.min(matchedCities.length, totalDays));
      const baseDays = Math.floor(totalDays / cities.length);
      const remainder = totalDays - baseDays * cities.length;
      return cities.map((city, i) => ({
        city,
        days: baseDays + (i < remainder ? 1 : 0),
      }));
    }
  }

  // 无指定：按偏好推荐
  const recommended = recommendCitiesByPreferences(parsed.preferences);
  if (recommended.length === 0) {
    // 默认推荐
    return [{ city: CITIES[0], days: totalDays }];
  }

  // 多城模式（天数>=7且推荐城市>=2）
  if (totalDays >= 7 && recommended.length >= 2) {
    // 最近邻排序
    const sorted = sortCitiesByNearestNeighbor(recommended.slice(0, 3));
    const cities = sorted.slice(0, Math.min(3, Math.floor(totalDays / 3)));
    const allocations: CityAllocation[] = [];
    const baseDays = Math.floor(totalDays / cities.length);
    const remainder = totalDays - baseDays * cities.length;
    cities.forEach((city, i) => {
      allocations.push({ city, days: baseDays + (i < remainder ? 1 : 0) });
    });
    return allocations;
  }

  // 单城
  return [{ city: recommended[0], days: totalDays }];
}

// ==================== 单日行程生成 ====================

interface DailyPlan {
  area: string;
  morning: ItineraryAttraction[];
  afternoon: ItineraryAttraction[];
  evening: ItineraryAttraction[];
  walkingKm: number;
  totalDuration: number;
}

/**
 * 生成单日行程（锁定单个片区）
 */
function generateDailyPlan(
  cityId: string,
  area: string,
  dayIndex: number,
  paceConfig: typeof PACE_CONFIGS[PaceType],
  companionConfig: typeof COMPANION_CONFIGS[CompanionType],
  budgetConfig: typeof BUDGET_CONFIGS[BudgetLevel],
  usedAttractions: Set<string>
): DailyPlan | null {
  const allAttractions = getAttractionsByArea(cityId, area);
  if (allAttractions.length === 0) return null;

  // 过滤已使用的
  const available = allAttractions.filter((a) => !usedAttractions.has(a.id));
  if (available.length === 0) return null;

  // 预算过滤
  const budgetFiltered = available.filter((a) => a.ticketPrice <= budgetConfig.maxTicketPerDay);

  // 强度过滤
  const intensityFiltered = budgetFiltered.filter((a) => a.intensity <= companionConfig.intensityCap);

  // 按类型分组
  const byType: Record<string, Attraction[]> = {};
  for (const a of intensityFiltered) {
    if (!byType[a.type]) byType[a.type] = [];
    byType[a.type].push(a);
  }

  const morning: ItineraryAttraction[] = [];
  const afternoon: ItineraryAttraction[] = [];
  const evening: ItineraryAttraction[] = [];

  // 上午：强度>=3的户外/历史
  const morningCandidates = intensityFiltered
    .filter((a) => a.intensity >= 3 && (a.type === "历史古迹" || a.type === "自然风光"))
    .slice(0, 2);
  morning.push(...morningCandidates.map(toItineraryAttraction));

  // 下午：强度<=2的博物馆/商圈
  const afternoonCandidates = intensityFiltered
    .filter((a) => !morningCandidates.includes(a) && (a.type === "博物馆" || a.type === "商圈美食"))
    .slice(0, 2);
  afternoon.push(...afternoonCandidates.map(toItineraryAttraction));

  // 晚上：夜景演出
  if (companionConfig.enableNightActivity) {
    const eveningCandidates = intensityFiltered
      .filter((a) => !morningCandidates.includes(a) && !afternoonCandidates.includes(a) && a.type === "夜景演出")
      .slice(0, 1);
    evening.push(...eveningCandidates.map(toItineraryAttraction));
  }

  // 动线排序（最短路径）
  if (morning.length > 1) {
    const sorted = sortByShortestPath(morning);
    morning.length = 0;
    morning.push(...sorted);
  }
  if (afternoon.length > 1) {
    const sorted = sortByShortestPath(afternoon);
    afternoon.length = 0;
    afternoon.push(...sorted);
  }

  // 计算总时长
  const allItems = [...morning, ...afternoon, ...evening];
  const totalDuration = allItems.reduce((s, a) => s + a.duration, 0) +
    (allItems.length - 1) * TIME_CONSTANTS.transitBetweenAttractions +
    TIME_CONSTANTS.lunchDuration +
    TIME_CONSTANTS.dinnerDuration +
    TIME_CONSTANTS.dailyBuffer;

  // 步行距离
  const walkingKm = calculateWalkingDistance(allItems) + 1; // +1公里缓冲

  // 标记已使用
  allItems.forEach((a) => usedAttractions.add(a.id));

  return {
    area,
    morning,
    afternoon,
    evening,
    walkingKm,
    totalDuration: Math.round(totalDuration * 10) / 10,
  };
}

// ==================== 主入口 ====================

/**
 * 核心行程生成函数
 */
export function generateSmartItinerary(params: UserParams): ItineraryResult {
  const parsed = parseUserParams(params);
  const paceConfig = PACE_CONFIGS[parsed.pace];
  const companionConfig = COMPANION_CONFIGS[parsed.companions];
  const budgetConfig = BUDGET_CONFIGS[parsed.budgetLevel];

  // 城市分配
  const cityAllocations = allocateCities(parsed);
  const days: DayItinerary[] = [];
  const usedAttractions = new Set<string>();
  let dayCounter = 1;

  for (const allocation of cityAllocations) {
    const city = allocation.city;
    const cityDays = allocation.days;
    const areas = getAreasByCity(city.cityId);

    for (let d = 0; d < cityDays; d++) {
      const area = areas[d % areas.length];
      const plan = generateDailyPlan(
        city.cityId,
        area,
        d,
        paceConfig,
        companionConfig,
        budgetConfig,
        usedAttractions
      );

      if (plan) {
        days.push({
          day: dayCounter,
          cityId: city.cityId,
          cityName: city.cityName,
          area: plan.area,
          isTravelDay: false,
          morning: plan.morning,
          afternoon: plan.afternoon,
          evening: plan.evening,
          meals: {
            lunch: { duration: TIME_CONSTANTS.lunchDuration, note: "推荐品尝当地特色美食" },
            dinner: { duration: TIME_CONSTANTS.dinnerDuration, note: "享受当地美食，补充能量" },
          },
          transport: `地铁/公交可达 ${plan.area}片区`,
          accommodation: budgetConfig.hotelLevel,
          walkingKm: plan.walkingKm,
          paceLabel: parsed.pace,
          totalDuration: plan.totalDuration,
        });
        dayCounter++;
      }
    }
  }

  // 重新编号
  days.forEach((day, i) => { day.day = i + 1; });

  // 计算总数据
  const totalWalking = days.reduce((s, d) => s + d.walkingKm, 0);
  const totalTicket = days.reduce((s, d) => {
    const dayCost = [...d.morning, ...d.afternoon, ...d.evening].reduce((sum, a) => sum + a.ticketPrice, 0);
    return s + dayCost;
  }, 0);

  // 简单评分
  const score = Math.min(100, Math.round(
    80 +
    (days.length > 0 ? 10 : 0) +
    (totalWalking < 50 ? 5 : 0) +
    (totalTicket < 1000 ? 5 : 0)
  ));

  return {
    days,
    cities: cityAllocations.map((a) => a.city.cityName),
    totalWalkingKm: Math.round(totalWalking * 10) / 10,
    totalTicketCost: totalTicket,
    score,
    optimizations: ["自动锁定片区，避免跨区折返", "按最短路径排序景点"],
    warnings: [],
  };
}

// ==================== 兼容旧接口 ====================

export function generateItinerary(params: UserParams): ItineraryResult {
  return generateSmartItinerary(params);
}
