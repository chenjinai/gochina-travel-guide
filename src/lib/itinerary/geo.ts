/**
 * 通用行程规划引擎 —— 地理计算工具
 * 距离计算、最近邻排序、片区邻接关系
 */

import type { GeoCoord } from "./types";

/** 地球半径（公里） */
const EARTH_RADIUS_KM = 6371;

/** 计算两点间球面距离（公里） —— Haversine 公式 */
export function haversineDistance(coord1: GeoCoord, coord2: GeoCoord): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** 按最短路径排序景点（TSP 贪心近似） */
export function sortByShortestPath<T extends { geoCoord: GeoCoord }>(
  items: T[],
  startCoord?: GeoCoord
): T[] {
  if (items.length <= 1) return [...items];

  const unvisited = [...items];
  const sorted: T[] = [];

  // 从起始点或第一个点开始
  let current = startCoord ? unvisited.reduce((closest, item) => {
    const closestDist = haversineDistance(closest.geoCoord, startCoord);
    const itemDist = haversineDistance(item.geoCoord, startCoord);
    return itemDist < closestDist ? item : closest;
  }, unvisited[0]) : unvisited[0];

  sorted.push(current);
  unvisited.splice(unvisited.indexOf(current), 1);

  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let minDist = Infinity;
    for (const item of unvisited) {
      const dist = haversineDistance(current.geoCoord, item.geoCoord);
      if (dist < minDist) {
        minDist = dist;
        nearest = item;
      }
    }
    sorted.push(nearest);
    unvisited.splice(unvisited.indexOf(nearest), 1);
    current = nearest;
  }

  return sorted;
}

/** 计算一组点之间的总步行距离（公里） */
export function calculateWalkingDistance(points: { geoCoord: GeoCoord }[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(points[i].geoCoord, points[i + 1].geoCoord);
  }
  return Math.round(total * 10) / 10;
}

/** 基于经纬度对城市进行最近邻排序（单向无折返） */
export function sortCitiesByNearestNeighbor<
  T extends { cityName: string; geoCoord: GeoCoord }
>(cities: T[], startCityName?: string): T[] {
  if (cities.length <= 1) return [...cities];

  const unvisited = [...cities];
  const sorted: T[] = [];

  // 确定起点
  let current: T;
  if (startCityName) {
    const found = unvisited.find((c) => c.cityName === startCityName);
    current = found || unvisited[0];
  } else {
    current = unvisited[0];
  }

  sorted.push(current);
  unvisited.splice(unvisited.indexOf(current), 1);

  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let minDist = Infinity;
    for (const city of unvisited) {
      const dist = haversineDistance(current.geoCoord, city.geoCoord);
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    sorted.push(nearest);
    unvisited.splice(unvisited.indexOf(nearest), 1);
    current = nearest;
  }

  return sorted;
}

/** 估算两个坐标点之间的通勤时间（分钟） */
export function estimateCommuteMinutes(coord1: GeoCoord, coord2: GeoCoord): number {
  const distance = haversineDistance(coord1, coord2);
  // 城市内平均时速 15km/h（步行+地铁+公交混合）
  const minutes = (distance / 15) * 60;
  return Math.max(15, Math.min(90, Math.round(minutes / 5) * 5));
}
