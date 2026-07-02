/**
 * PDF导出工具：静态地图生成 + 图片加载辅助函数。
 * 用于在行程PDF中为每个城市嵌入景点分布地图。
 */

import { CITY_MAPS } from "./city-maps-data";
import type { CityKey } from "./china-geo";
import type { ItineraryDay } from "./planner";

/**
 * 为指定城市的景点列表生成OpenStreetMap静态地图URL（免费，无需API Key）。
 * 自动根据所有标记点居中地图。
 */
export function getStaticMapUrl(
  city: CityKey,
  attractionIndices: number[],
): string {
  const cityData = CITY_MAPS[city];
  if (!cityData || attractionIndices.length === 0) return "";

  // 收集有坐标的景点
  const markers: { lat: number; lng: number }[] = [];
  for (const idx of attractionIndices) {
    if (idx < cityData.attractions.length) {
      const a = cityData.attractions[idx];
      markers.push({ lat: a.position[0], lng: a.position[1] });
    }
  }
  if (markers.length === 0) return "";

  // 根据所有标记计算中心点
  const centerLat =
    markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const centerLng =
    markers.reduce((s, m) => s + m.lng, 0) / markers.length;

  // 根据跨度估算合适缩放级别
  const latSpan = Math.max(...markers.map((m) => m.lat)) -
    Math.min(...markers.map((m) => m.lat));
  const lngSpan = Math.max(...markers.map((m) => m.lng)) -
    Math.min(...markers.map((m) => m.lng));
  const maxSpan = Math.max(latSpan, lngSpan);
  let zoom = 13;
  if (maxSpan > 0.5) zoom = 10;
  else if (maxSpan > 0.2) zoom = 11;
  else if (maxSpan > 0.08) zoom = 12;

  // 构建标记字符串：lat,lng,marker-style
  const markerStr = markers
    .map((m) => `${m.lat.toFixed(4)},${m.lng.toFixed(4)},red-pushpin`)
    .join("|");

  return (
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${centerLat.toFixed(4)},${centerLng.toFixed(4)}` +
    `&zoom=${zoom}` +
    `&size=600x380` +
    `&maptype=mapnik` +
    `&markers=${markerStr}`
  );
}

/**
 * 从URL加载图片并返回base64 data URL。
 * 使用Image + Canvas方式避免CORS限制。
 */
export function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timeout = setTimeout(() => {
      reject(new Error("Image load timeout"));
    }, 8000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        reject(new Error("Canvas conversion failed"));
      }
    };
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load: ${url}`));
    };
    img.src = url;
  });
}

/**
 * 获取某城市所有行程天的地图图片。
 * 汇总该城市所有天的景点，生成一张总览地图。
 * 返回base64 data URL，失败返回null。
 */
export async function getCityMapImage(
  city: CityKey,
  days: ItineraryDay[],
): Promise<string | null> {
  const indices = new Set<number>();
  for (const day of days) {
    if (day.city !== city) continue;
    for (const item of day.items) {
      indices.add(item.index);
    }
  }

  const url = getStaticMapUrl(city, [...indices]);
  if (!url) return null;

  try {
    return await loadImageAsBase64(url);
  } catch {
    return null; // 静默失败——地图加载失败时用文字替代
  }
}

/**
 * 景点分类对应的emoji图标
 */
export const CATEGORY_EMOJI: Record<string, string> = {
  history: "🏛️",
  nature: "🌿",
  urban: "🏙️",
  "food-shopping": "🛍️",
  family: "🎢",
};

/**
 * 体力强度对应的显示标签
 */
export const INTENSITY_LABELS: Record<string, { label: string; color: [number, number, number] }> = {
  Low:    { label: "Easy Going",  color: [22, 163, 74] },  // green
  Medium: { label: "Moderate",    color: [217, 119, 6]  },  // amber
  High:   { label: "Challenging", color: [220, 38, 38]  },  // red
};
