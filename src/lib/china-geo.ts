/**
 * 中国地理数据：区域 → 省份 → 城市 三级映射。
 * 作为整个目的地系统的单一数据源 (Single Source of Truth)。
 *
 * - REGIONS: 7大地理区域的显示顺序
 * - PROVINCES: 省份/直辖市 → 省会城市列表
 * - ALL_CITIES: 所有城市的平面数组（用于 key 推导和遍历）
 */

/* ---------- 区域 ---------- */
export const REGIONS = [
  "north" as const,
  "east" as const,
  "central" as const,
  "south" as const,
  "southwest" as const,
  "northwest" as const,
  "northeast" as const,
];

export type RegionKey = (typeof REGIONS)[number];

export const REGION_LABELS: Record<RegionKey, { en: string; zh: string }> = {
  north: { en: "North China", zh: "华北" },
  east: { en: "East China", zh: "华东" },
  central: { en: "Central China", zh: "华中" },
  south: { en: "South China", zh: "华南" },
  southwest: { en: "Southwest China", zh: "西南" },
  northwest: { en: "Northwest China", zh: "西北" },
  northeast: { en: "Northeast China", zh: "东北" },
};

/* ---------- 省份 ---------- */
export type ProvinceKey =
  | "beijing"
  | "shanghai"
  | "jiangsu"
  | "zhejiang"
  | "anhui"
  | "fujian"
  | "jiangxi"
  | "shandong"
  | "hubei"
  | "hunan"
  | "guangdong"
  | "guangxi"
  | "sichuan"
  | "shaanxi"
  | "qinghai"
  | "gansu"
  | "liaoning"
  | "heilongjiang"
  | "jilin";

export interface ProvinceDef {
  en: string;
  zh: string;
  region: RegionKey;
  cities: string[]; // CityKey[]
}

export const PROVINCES: Record<ProvinceKey, ProvinceDef> = {
  beijing: { en: "Beijing", zh: "北京", region: "north", cities: ["beijing"] },
  shanghai: { en: "Shanghai", zh: "上海", region: "east", cities: ["shanghai"] },
  jiangsu: { en: "Jiangsu", zh: "江苏", region: "east", cities: ["nanjing", "suzhou"] },
  zhejiang: { en: "Zhejiang", zh: "浙江", region: "east", cities: ["hangzhou"] },
  anhui: { en: "Anhui", zh: "安徽", region: "east", cities: ["hefei"] },
  fujian: { en: "Fujian", zh: "福建", region: "east", cities: ["fuzhou"] },
  jiangxi: { en: "Jiangxi", zh: "江西", region: "east", cities: ["nanchang"] },
  shandong: { en: "Shandong", zh: "山东", region: "east", cities: ["jinan"] },
  hubei: { en: "Hubei", zh: "湖北", region: "central", cities: ["wuhan"] },
  hunan: { en: "Hunan", zh: "湖南", region: "central", cities: ["changsha", "zhangjiajie"] },
  guangdong: { en: "Guangdong", zh: "广东", region: "south", cities: ["guangzhou"] },
  guangxi: { en: "Guangxi", zh: "广西", region: "south", cities: ["nanning"] },
  sichuan: { en: "Sichuan", zh: "四川", region: "southwest", cities: ["chengdu", "jiuzhaigou"] },
  shaanxi: { en: "Shaanxi", zh: "陕西", region: "northwest", cities: ["xian"] },
  qinghai: { en: "Qinghai", zh: "青海", region: "northwest", cities: ["xining", "qinghaihu", "chaka", "delingha", "dachaidan"] },
  gansu: { en: "Gansu", zh: "甘肃", region: "northwest", cities: ["dunhuang", "jiayuguan", "zhangye", "lanzhou"] },
  liaoning: { en: "Liaoning", zh: "辽宁", region: "northeast", cities: ["dalian", "shenyang"] },
  heilongjiang: { en: "Heilongjiang", zh: "黑龙江", region: "northeast", cities: ["harbin", "daqing"] },
  jilin: { en: "Jilin", zh: "吉林", region: "northeast", cities: ["changchun", "jilin", "yanji"] },
};

/* ---------- 城市（核心联合类型） ---------- */
export const ALL_CITIES = [
  "beijing", "nanjing", "xian", "shanghai", "suzhou", "zhangjiajie",
  "hangzhou", "guangzhou", "chengdu", "jiuzhaigou", "wuhan", "changsha",
  "fuzhou", "jinan", "hefei", "nanchang", "nanning",
  "dalian", "shenyang", "harbin", "daqing", "changchun", "jilin", "yanji",
  // 青甘大环线
  "xining", "qinghaihu", "chaka", "delingha", "dachaidan",
  "dunhuang", "jiayuguan", "zhangye", "lanzhou",
] as const;

export type CityKey = (typeof ALL_CITIES)[number];

/* ---------- 城市 ↔ 省份反向查询 ---------- */
export function getProvince(city: CityKey): ProvinceKey | null {
  for (const [pkey, pdef] of Object.entries(PROVINCES)) {
    if ((pdef as ProvinceDef).cities.includes(city)) return pkey as ProvinceKey;
  }
  return null;
}

/* ---------- 区域 → 省份列表 ---------- */
export function getProvincesByRegion(region: RegionKey): ProvinceKey[] {
  return (Object.keys(PROVINCES) as ProvinceKey[]).filter(
    (p) => PROVINCES[p].region === region,
  );
}

/* ---------- 城市显示名（中英） ---------- */
export const CITY_LABELS_EN: Record<CityKey, string> = {
  beijing: "Beijing", nanjing: "Nanjing", xian: "Xi'an",
  shanghai: "Shanghai", suzhou: "Suzhou", zhangjiajie: "Zhangjiajie",
  hangzhou: "Hangzhou", guangzhou: "Guangzhou", chengdu: "Chengdu",
  wuhan: "Wuhan", changsha: "Changsha",
  fuzhou: "Fuzhou", jinan: "Jinan", hefei: "Hefei",
  nanchang: "Nanchang", nanning: "Nanning",
  dalian: "Dalian", shenyang: "Shenyang", harbin: "Harbin",
  daqing: "Daqing", changchun: "Changchun", jilin: "Jilin", yanji: "Yanji",
  xining: "Xining", qinghaihu: "Qinghai Lake", chaka: "Chaka Salt Lake",
  delingha: "Delingha", dachaidan: "Dachaidan",
  dunhuang: "Dunhuang", jiayuguan: "Jiayuguan", zhangye: "Zhangye", lanzhou: "Lanzhou",
  jiuzhaigou: "Jiuzhaigou",
};

export const CITY_LABELS_ZH: Record<CityKey, string> = {
  beijing: "北京", nanjing: "南京", xian: "西安",
  shanghai: "上海", suzhou: "苏州", zhangjiajie: "张家界",
  hangzhou: "杭州", guangzhou: "广州", chengdu: "成都",
  wuhan: "武汉", changsha: "长沙",
  fuzhou: "福州", jinan: "济南", hefei: "合肥",
  nanchang: "南昌", nanning: "南宁",
  dalian: "大连", shenyang: "沈阳", harbin: "哈尔滨",
  daqing: "大庆", changchun: "长春", jilin: "吉林", yanji: "延吉",
  xining: "西宁", qinghaihu: "青海湖", chaka: "茶卡盐湖",
  delingha: "德令哈", dachaidan: "大柴旦",
  dunhuang: "敦煌", jiayuguan: "嘉峪关", zhangye: "张掖", lanzhou: "兰州",
  jiuzhaigou: "九寨沟",
};

/* ---------- 城市地理坐标 (lat, lng) ---------- */
export interface CityCoord {
  lat: number;
  lng: number;
}

export const CITY_COORDS: Record<CityKey, CityCoord> = {
  beijing: { lat: 39.9042, lng: 116.4074 },
  shanghai: { lat: 31.2304, lng: 121.4737 },
  nanjing: { lat: 32.0603, lng: 118.7969 },
  hangzhou: { lat: 30.2741, lng: 120.1551 },
  xian: { lat: 34.3416, lng: 108.9398 },
  zhangjiajie: { lat: 29.1171, lng: 110.4792 },
  guangzhou: { lat: 23.1291, lng: 113.2644 },
  chengdu: { lat: 30.5728, lng: 104.0668 },
  wuhan: { lat: 30.5928, lng: 114.3055 },
  changsha: { lat: 28.2282, lng: 112.9388 },
  fuzhou: { lat: 26.0745, lng: 119.2965 },
  jinan: { lat: 36.6512, lng: 117.1201 },
  hefei: { lat: 31.8206, lng: 117.2272 },
  nanchang: { lat: 28.6820, lng: 115.8579 },
  nanning: { lat: 22.8170, lng: 108.3665 },
  dalian: { lat: 38.9140, lng: 121.6147 },
  shenyang: { lat: 41.8057, lng: 123.4315 },
  harbin: { lat: 45.8038, lng: 126.5340 },
  daqing: { lat: 46.5902, lng: 125.1031 },
  changchun: { lat: 43.8171, lng: 125.3235 },
  jilin: { lat: 43.8378, lng: 126.5496 },
  yanji: { lat: 42.9047, lng: 129.5136 },
  xining: { lat: 36.6171, lng: 101.7785 },
  qinghaihu: { lat: 36.8824, lng: 100.1867 },
  chaka: { lat: 36.7920, lng: 99.0850 },
  delingha: { lat: 37.3740, lng: 97.3700 },
  dachaidan: { lat: 37.8550, lng: 95.3600 },
  dunhuang: { lat: 40.1421, lng: 94.6619 },
  jiayuguan: { lat: 39.7725, lng: 98.2892 },
  zhangye: { lat: 38.9318, lng: 100.4553 },
  lanzhou: { lat: 36.0611, lng: 103.8343 },
  jiuzhaigou: { lat: 33.2634, lng: 103.8988 },
};
