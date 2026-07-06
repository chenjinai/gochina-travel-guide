// Metadata for each attraction (city + index), kept separately from i18n so we
// don't mutate translation dictionaries. Index order matches `t.destinations.cities[city].attractions`.
// Attractions are sorted by travel popularity (highest first).

import type { CityKey } from "./china-geo";

export type { CityKey } from "./china-geo";

export type Intensity = "Low" | "Medium" | "High";

/** Category for filtering attractions by type */
export type AttractionCategory = "history" | "nature" | "urban" | "food-shopping" | "family";

export const CATEGORY_LABELS: Record<AttractionCategory, { en: string; zh: string }> = {
  history: { en: "History & Culture", zh: "历史文化" },
  nature: { en: "Nature & Scenery", zh: "自然风光" },
  urban: { en: "Modern City", zh: "现代都市" },
  "food-shopping": { en: "Food & Shopping", zh: "美食购物" },
  family: { en: "Family Fun", zh: "亲子娱乐" },
};

export type AttractionMeta = {
  /** Estimated visit duration in hours. */
  duration: number;
  intensity: Intensity;
  /** Category for filtering */
  category: AttractionCategory;
};

export const ATTRACTION_META: Record<CityKey, AttractionMeta[]> = {
  // ===== 北京 (14) — sorted by popularity =====
  beijing: [
    { duration: 4, intensity: "Medium", category: "history" },      // 1  Forbidden City
    { duration: 6, intensity: "High",   category: "history" },      // 2  Great Wall — Mutianyu
    { duration: 2, intensity: "Low",    category: "history" },      // 3  Temple of Heaven
    { duration: 3, intensity: "Medium", category: "history" },      // 4  Summer Palace
    { duration: 1, intensity: "Low",    category: "history" },      // 5  Tiananmen Square
    { duration: 2, intensity: "Low",    category: "history" },      // 6  Nanluoguxiang Hutongs
    { duration: 3, intensity: "Medium", category: "history" },      // 7  National Museum
    { duration: 1, intensity: "Low",    category: "nature" },       // 8  Jingshan Park
    { duration: 2, intensity: "Low",    category: "history" },      // 9  Lama Temple
    { duration: 3, intensity: "Low",    category: "urban" },        //10  798 Art District
    { duration: 2, intensity: "Low",    category: "nature" },       //11  Beihai Park
    { duration: 2, intensity: "Low",    category: "history" },      //12  Prince Gong's Mansion
    { duration: 2, intensity: "Low",    category: "urban" },        //13  Olympic Park
    { duration: 2, intensity: "Low",    category: "food-shopping" },//14  Shichahai & Houhai
  ],

  // ===== 上海 (14) — sorted by popularity =====
  shanghai: [
    { duration: 2, intensity: "Low",    category: "urban" },        // 1  The Bund
    { duration: 2, intensity: "Low",    category: "history" },      // 2  Yu Garden & Old City
    { duration: 2, intensity: "Medium", category: "urban" },        // 3  Shanghai Tower
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Nanjing Road
    { duration: 3, intensity: "Low",    category: "urban" },        // 5  French Concession
    { duration: 2, intensity: "Low",    category: "urban" },        // 6  Oriental Pearl TV Tower
    { duration: 3, intensity: "Low",    category: "food-shopping" },// 7  Xintiandi & Tianzifang
    { duration: 6, intensity: "Medium", category: "family" },       // 8  Shanghai Disney Resort
    { duration: 2, intensity: "Low",    category: "history" },      // 9  Shanghai Museum
    { duration: 5, intensity: "Medium", category: "nature" },       //10  Zhujiajiao Water Town
    { duration: 2, intensity: "Low",    category: "urban" },        //11  Lujiazui Skyline
    { duration: 2, intensity: "Low",    category: "history" },      //12  Jade Buddha Temple
    { duration: 1, intensity: "Low",    category: "urban" },        //13  Maglev Train
    { duration: 2, intensity: "Low",    category: "urban" },        //14  China Art Museum
  ],

  // ===== 苏州 (12) — sorted by popularity =====
  suzhou: [
    { duration: 3, intensity: "Low",    category: "history" },      // 1  Humble Administrator's Garden
    { duration: 3, intensity: "Medium", category: "history" },      // 2  Tiger Hill
    { duration: 2, intensity: "Low",    category: "urban" },        // 3  Suzhou Museum
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Shantang Street
    { duration: 2, intensity: "Low",    category: "history" },      // 5  Lingering Garden
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 6  Pingjiang Road
    { duration: 1.5, intensity: "Low",  category: "history" },      // 7  Master of Nets Garden
    { duration: 2, intensity: "Low",    category: "history" },      // 8  Hanshan Temple
    { duration: 2, intensity: "Low",    category: "history" },      // 9  Lion Grove Garden
    { duration: 2, intensity: "Low",    category: "history" },      //10  Panmen Gate
    { duration: 1.5, intensity: "Low",  category: "history" },      //11  Suzhou Silk Museum
    { duration: 3, intensity: "Low",    category: "urban" },        //12  Jinji Lake
  ],

  // ===== 西安 (14) — sorted by popularity =====
  xian: [
    { duration: 4, intensity: "Medium", category: "history" },      // 1  Terracotta Warriors
    { duration: 3, intensity: "Medium", category: "history" },      // 2  Xi'an City Wall
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 3  Muslim Quarter
    { duration: 2, intensity: "Low",    category: "history" },      // 4  Big Wild Goose Pagoda
    { duration: 3, intensity: "Medium", category: "history" },      // 5  Shaanxi History Museum
    { duration: 7, intensity: "High",   category: "nature" },       // 6  Mount Hua
    { duration: 1, intensity: "Low",    category: "history" },      // 7  Bell & Drum Towers
    { duration: 3, intensity: "Low",    category: "urban" },        // 8  Datang Everbright City
    { duration: 3, intensity: "Medium", category: "history" },      // 9  Huaqing Palace
    { duration: 3, intensity: "Low",    category: "history" },      //10  Datang Furong Garden
    { duration: 2, intensity: "Low",    category: "history" },      //11  Small Wild Goose Pagoda
    { duration: 2, intensity: "Low",    category: "food-shopping" },//12  Yongxing Fang Food Street
    { duration: 3, intensity: "Medium", category: "history" },      //13  Daming Palace Ruins Park
    { duration: 2, intensity: "Low",    category: "food-shopping" },//14  Great Tang West Market
  ],

  // ===== 南京 (12) — sorted by popularity =====
  nanjing: [
    { duration: 3, intensity: "Medium", category: "history" },      // 1  Sun Yat-sen Mausoleum
    { duration: 3, intensity: "High",   category: "history" },      // 2  Ming City Wall
    { duration: 2, intensity: "Low",    category: "history" },      // 3  Confucius Temple & Qinhuai River
    { duration: 3, intensity: "Medium", category: "history" },      // 4  Ming Xiaoling Mausoleum
    { duration: 3, intensity: "Medium", category: "history" },      // 5  Presidential Palace
    { duration: 3, intensity: "Medium", category: "history" },      // 6  Nanjing Museum
    { duration: 2, intensity: "Low",    category: "nature" },       // 7  Xuanwu Lake
    { duration: 2, intensity: "Low",    category: "history" },      // 8  Massacre Memorial
    { duration: 2, intensity: "Low",    category: "history" },      // 9  Jiming Temple
    { duration: 4, intensity: "Medium", category: "nature" },       //10  Niushou Mountain
    { duration: 2, intensity: "Low",    category: "food-shopping" },//11  Laomendong Historic Street
    { duration: 2, intensity: "Low",    category: "history" },      //12  Yuejiang Tower
  ],

  // ===== 成都 (12) — sorted by popularity =====
  chengdu: [
    { duration: 3, intensity: "Low",    category: "family" },       // 1  Panda Breeding Base
    { duration: 3, intensity: "Low",    category: "food-shopping" },// 2  Jinli Ancient Street
    { duration: 4, intensity: "Medium", category: "history" },      // 3  Wuhou Shrine
    { duration: 3, intensity: "Low",    category: "food-shopping" },// 4  Kuanzhai Alley
    { duration: 3, intensity: "Low",    category: "urban" },        // 5  People's Park
    { duration: 3, intensity: "Medium", category: "history" },      // 6  Du Fu's Thatched Cottage
    { duration: 4, intensity: "Medium", category: "nature" },       // 7  Mount Qingcheng
    { duration: 5, intensity: "Medium", category: "history" },      // 8  Dujiangyan
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 9  Chunxi Road
    { duration: 3, intensity: "Medium", category: "history" },      //10  Jinsha Site Museum
    { duration: 2, intensity: "Low",    category: "history" },      //11  Wenshu Monastery
    { duration: 3, intensity: "Medium", category: "history" },      //12  Sanxingdui Museum
  ],

  // ===== 广州 (11) — sorted by popularity =====
  guangzhou: [
    { duration: 3, intensity: "Medium", category: "urban" },        // 1  Canton Tower
    { duration: 4, intensity: "Medium", category: "history" },      // 2  Chen Clan Academy
    { duration: 3, intensity: "Low",    category: "history" },      // 3  Shamian Island
    { duration: 2, intensity: "Low",    category: "nature" },       // 4  Yuexiu Park
    { duration: 6, intensity: "Medium", category: "family" },       // 5  Chimelong Safari Park
    { duration: 5, intensity: "Medium", category: "nature" },       // 6  Baiyun Mountain
    { duration: 2, intensity: "Low",    category: "urban" },        // 7  Pearl River Night Cruise
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 8  Beijing Road Shopping Area
    { duration: 2, intensity: "Low",    category: "history" },      // 9  Sun Yat-sen Memorial Hall
    { duration: 1, intensity: "Low",    category: "history" },      //10  Sacred Heart Cathedral
    { duration: 2, intensity: "Low",    category: "urban" },        //11  Redtory Art District
  ],

  // ===== 杭州 (10) — sorted by popularity =====
  hangzhou: [
    { duration: 4, intensity: "Medium", category: "nature" },       // 1  West Lake
    { duration: 3, intensity: "Medium", category: "history" },      // 2  Lingyin Temple
    { duration: 2, intensity: "Low",    category: "history" },      // 3  Leifeng Pagoda
    { duration: 2, intensity: "Low",    category: "nature" },       // 4  Longjing Tea Village
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 5  Hefang Street
    { duration: 4, intensity: "Medium", category: "nature" },       // 6  Xixi National Wetland Park
    { duration: 4, intensity: "Medium", category: "family" },       // 7  Song Dynasty Town
    { duration: 3, intensity: "Medium", category: "nature" },       // 8  Nine Creeks Misty Forest
    { duration: 2, intensity: "Low",    category: "history" },      // 9  China National Tea Museum
    { duration: 2, intensity: "Low",    category: "nature" },       //10  Meijiawu Tea Village
  ],

  // ===== 武汉 (10) — sorted by popularity =====
  wuhan: [
    { duration: 3, intensity: "Medium", category: "history" },      // 1  Yellow Crane Tower
    { duration: 4, intensity: "Medium", category: "nature" },       // 2  East Lake
    { duration: 2, intensity: "Low",    category: "history" },      // 3  Hubei Provincial Museum
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Jianghan Road
    { duration: 3, intensity: "Low",    category: "food-shopping" },// 5  Hubu Alley
    { duration: 2, intensity: "Low",    category: "urban" },        // 6  Wuhan Yangtze River Bridge
    { duration: 2, intensity: "Low",    category: "history" },      // 7  Guiyuan Temple
    { duration: 2, intensity: "Low",    category: "nature" },       // 8  Hankou Riverside Promenade
    { duration: 3, intensity: "Medium", category: "nature" },       // 9  Wuhan University Cherry Blossoms
    { duration: 2, intensity: "Low",    category: "urban" },        //10  Chu River & Han Street
  ],

  // ===== 长沙 (10) — sorted by popularity =====
  changsha: [
    { duration: 3, intensity: "Medium", category: "nature" },       // 1  Orange Isle
    { duration: 2, intensity: "Low",    category: "nature" },       // 2  Yuelu Mountain & Academy
    { duration: 3, intensity: "Medium", category: "history" },      // 3  Hunan Museum (Mawangdui)
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Taiping Street
    { duration: 1, intensity: "Low",    category: "urban" },        // 5  IFS Guojin Center
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 6  Fire God Palace (Huogongdian)
    { duration: 2, intensity: "Low",    category: "history" },      // 7  Tianxin Pavilion
    { duration: 4, intensity: "Medium", category: "family" },       // 8  Window of the World
    { duration: 2, intensity: "Low",    category: "nature" },       // 9  Meixi Lake
    { duration: 2, intensity: "Low",    category: "urban" },        //10  Wuyi Square & Jiefang West
  ],

  // ===== 张家界 (7) — sorted by popularity =====
  zhangjiajie: [
    { duration: 5, intensity: "High",   category: "nature" },       // 1  Zhangjiajie National Forest Park
    { duration: 5, intensity: "High",   category: "nature" },       // 2  Tianmen Mountain
    { duration: 3, intensity: "Medium", category: "nature" },       // 3  Grand Canyon Glass Bridge
    { duration: 4, intensity: "High",   category: "nature" },       // 4  Yuanjiajie — Avatar Mountains
    { duration: 2, intensity: "Low",    category: "nature" },       // 5  Baofeng Lake
    { duration: 3, intensity: "Medium", category: "nature" },       // 6  Yellow Dragon Cave
    { duration: 2, intensity: "Low",    category: "nature" },       // 7  Golden Whip Stream
  ],

  // ===== 哈尔滨 (8) — sorted by popularity =====
  harbin: [
    { duration: 4, intensity: "Medium", category: "family" },       // 1  Ice & Snow World
    { duration: 2, intensity: "Low",    category: "history" },      // 2  St. Sophia Cathedral
    { duration: 3, intensity: "Low",    category: "food-shopping" },// 3  Central Street
    { duration: 3, intensity: "Medium", category: "nature" },       // 4  Sun Island
    { duration: 3, intensity: "Medium", category: "family" },       // 5  Siberian Tiger Park
    { duration: 2, intensity: "Low",    category: "nature" },       // 6  Zhaolin Park Ice Lanterns
    { duration: 3, intensity: "Medium", category: "family" },       // 7  Harbin Polarland
    { duration: 2, intensity: "Low",    category: "urban" },        // 8  Harbin Grand Theatre
  ],

  // ===== 大连 (8) — sorted by popularity =====
  dalian: [
    { duration: 3, intensity: "Low",    category: "urban" },        // 1  Xinghai Square
    { duration: 4, intensity: "Medium", category: "family" },       // 2  Tiger Beach Ocean Park
    { duration: 3, intensity: "Medium", category: "nature" },       // 3  Binhai Road Coastal Drive
    { duration: 2, intensity: "Low",    category: "history" },      // 4  Russian Style Street
    { duration: 3, intensity: "Low",    category: "family" },       // 5  Shengya Ocean World
    { duration: 6, intensity: "Medium", category: "family" },       // 6  Discoveryland Theme Park
    { duration: 4, intensity: "Medium", category: "nature" },       // 7  Bangchuidao Island
    { duration: 2, intensity: "Low",    category: "nature" },       // 8  Golden Pebble Beach
  ],

  // ===== 沈阳 (8) — sorted by popularity =====
  shenyang: [
    { duration: 4, intensity: "Medium", category: "history" },      // 1  Shenyang Imperial Palace
    { duration: 3, intensity: "Medium", category: "history" },      // 2  North Tomb (Zhaoling)
    { duration: 2, intensity: "Low",    category: "history" },      // 3  9·18 Historical Museum
    { duration: 1, intensity: "Low",    category: "urban" },        // 4  Zhongshan Square
    { duration: 3, intensity: "Low",    category: "family" },       // 5  Shenyang Forest Zoo
    { duration: 3, intensity: "Medium", category: "history" },      // 6  Marshal Zhang's Mansion
    { duration: 3, intensity: "Low",    category: "urban" },        // 7  Industrial Museum
    { duration: 2, intensity: "Low",    category: "nature" },       // 8  Shenyang Expo Garden
  ],

  // ===== 长春 (8) — sorted by popularity =====
  changchun: [
    { duration: 4, intensity: "Medium", category: "history" },      // 1  Puppet Manchurian Palace
    { duration: 3, intensity: "Medium", category: "nature" },       // 2  Jingyuetan National Forest Park
    { duration: 3, intensity: "Low",    category: "history" },      // 3  Changchun Film Studio Museum
    { duration: 2, intensity: "Low",    category: "urban" },        // 4  World Sculpture Park
    { duration: 2, intensity: "Low",    category: "nature" },       // 5  Nanhu Park
    { duration: 5, intensity: "Medium", category: "family" },       // 6  Changchun Movie Wonderland
    { duration: 3, intensity: "Low",    category: "family" },       // 7  Zoological & Botanical Garden
    { duration: 2, intensity: "Low",    category: "urban" },        // 8  Automobile Industry Museum
  ],

  // ===== 吉林 (7) — sorted by popularity =====
  jilin: [
    { duration: 2, intensity: "Low",    category: "nature" },       // 1  Songhua River Rime Scenery
    { duration: 3, intensity: "Medium", category: "nature" },       // 2  Beishan Park
    { duration: 4, intensity: "Medium", category: "nature" },       // 3  Wusong Island (Rime Island)
    { duration: 2, intensity: "Low",    category: "history" },      // 4  Jilin Meteorite Museum
    { duration: 3, intensity: "Medium", category: "nature" },       // 5  Longtan Mountain Park
    { duration: 4, intensity: "Medium", category: "nature" },       // 6  Songhua Lake Scenic Area
    { duration: 6, intensity: "High",   category: "nature" },       // 7  Beidahu Ski Resort
  ],

  // ===== 延吉 (7) — sorted by popularity =====
  yanji: [
    { duration: 6, intensity: "High",   category: "nature" },       // 1  Mt. Changbai (day trip)
    { duration: 3, intensity: "Low",    category: "history" },      // 2  Korean Folk Village
    { duration: 2, intensity: "Low",    category: "urban" },        // 3  Yanbian University & Neighborhood
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Korean Food Market (Dong Market)
    { duration: 2, intensity: "Low",    category: "nature" },       // 5  People's Park
    { duration: 3, intensity: "Medium", category: "nature" },       // 6  Maoershan National Forest Park
    { duration: 2, intensity: "Low",    category: "urban" },        // 7  Tumen River Border Viewpoint
  ],

  // ===== 大庆 (6) — sorted by popularity =====
  daqing: [
    { duration: 2, intensity: "Low",    category: "history" },      // 1  Daqing Oilfield Exhibition Hall
    { duration: 2, intensity: "Low",    category: "history" },      // 2  Iron Man Wang Jinxi Memorial
    { duration: 3, intensity: "Low",    category: "nature" },       // 3  Longfeng Wetland
    { duration: 3, intensity: "Medium", category: "nature" },       // 4  Daqing Forest Park
    { duration: 2, intensity: "Low",    category: "history" },      // 5  Daqing Museum
    { duration: 2, intensity: "Low",    category: "urban" },        // 6  Times Square & Oil Sculpture Park
  ],

  // ===== 福州 (8) — sorted by popularity =====
  fuzhou: [
    { duration: 3, intensity: "Medium", category: "history" },      // 1  Three Lanes & Seven Alleys
    { duration: 2, intensity: "Low",    category: "nature" },       // 2  Drum Mountain & Yongquan Temple
    { duration: 2, intensity: "Low",    category: "nature" },       // 3  West Lake Park
    { duration: 2, intensity: "Low",    category: "history" },      // 4  Shangxiahang Historic District
    { duration: 4, intensity: "Medium", category: "nature" },       // 5  Gushan Scenic Area
    { duration: 2, intensity: "Low",    category: "history" },      // 6  Lin Zexu Memorial Hall
    { duration: 2, intensity: "Low",    category: "nature" },       // 7  Yushan Mountain
    { duration: 2, intensity: "Low",    category: "history" },      // 8  Zhuzi Fang Historical Block
  ],

  // ===== 济南 (8) — sorted by popularity =====
  jinan: [
    { duration: 3, intensity: "Medium", category: "nature" },       // 1  Baotu Spring
    { duration: 2, intensity: "Low",    category: "nature" },       // 2  Daming Lake
    { duration: 2, intensity: "Low",    category: "nature" },       // 3  Thousand Buddha Mountain
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Furong Street Food Alley
    { duration: 3, intensity: "Low",    category: "history" },      // 5  Shandong Museum
    { duration: 2, intensity: "Low",    category: "urban" },        // 6  Spring City Square
    { duration: 2, intensity: "Low",    category: "nature" },       // 7  Five Dragon Pool
    { duration: 2, intensity: "Low",    category: "nature" },       // 8  Black Tiger Spring
  ],

  // ===== 合肥 (7) — sorted by popularity =====
  hefei: [
    { duration: 3, intensity: "Medium", category: "history" },      // 1  Lord Bao Park
    { duration: 3, intensity: "Medium", category: "history" },      // 2  Li Hongzhang Residence
    { duration: 2, intensity: "Low",    category: "nature" },       // 3  Swan Lake
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Huaihe Road Pedestrian Street
    { duration: 3, intensity: "Low",    category: "history" },      // 5  Anhui Museum
    { duration: 4, intensity: "Medium", category: "nature" },       // 6  Sanhe Ancient Town
    { duration: 3, intensity: "Low",    category: "nature" },       // 7  Hefei Botanical Garden
  ],

  // ===== 南昌 (8) — sorted by popularity =====
  nanchang: [
    { duration: 3, intensity: "Medium", category: "history" },      // 1  Tengwang Pavilion
    { duration: 3, intensity: "Medium", category: "history" },      // 2  Bayi Square & Uprising Memorial
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 3  Shengjin Pagoda Food Street
    { duration: 2, intensity: "Low",    category: "history" },      // 4  Shengjin Pagoda
    { duration: 4, intensity: "Medium", category: "nature" },       // 5  Meiling Scenic Area
    { duration: 2, intensity: "Low",    category: "urban" },        // 6  Star of Nanchang Ferris Wheel
    { duration: 3, intensity: "Medium", category: "history" },      // 7  August 1st Uprising Museum
    { duration: 2, intensity: "Low",    category: "nature" },       // 8  Poyang Lake Wetland (day trip)
  ],

  // ===== 南宁 (7) — sorted by popularity =====
  nanning: [
    { duration: 3, intensity: "Medium", category: "nature" },       // 1  Qingxiu Mountain
    { duration: 2, intensity: "Low",    category: "history" },      // 2  Guangxi Museum
    { duration: 3, intensity: "Low",    category: "nature" },       // 3  Nanhu Lake Park
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 4  Zhongshan Road Night Market
    { duration: 4, intensity: "Medium", category: "nature" },       // 5  Detian Waterfall
    { duration: 2, intensity: "Low",    category: "nature" },       // 6  Guangxi Medicinal Herb Garden
    { duration: 2, intensity: "Low",    category: "urban" },        // 7  MixC Shopping & ASEAN Avenue
  ],

  // ===== 九寨沟 (7) — sorted by popularity =====
  jiuzhaigou: [
    { duration: 6, intensity: "High",   category: "nature" },       // 1  Jiuzhaigou Valley
    { duration: 2, intensity: "Low",    category: "nature" },       // 2  Five Flower Lake
    { duration: 1, intensity: "Low",    category: "nature" },       // 3  Nuorilang Waterfall
    { duration: 1.5, intensity: "Low",  category: "nature" },       // 4  Pearl Shoal
    { duration: 1.5, intensity: "Low",  category: "nature" },       // 5  Shuzheng Lakes
    { duration: 2, intensity: "Low",    category: "nature" },       // 6  Long Lake
    { duration: 2, intensity: "Low",    category: "food-shopping" },// 7  Tibetan Homestay
  ],
};

export const CITY_LABELS: Record<CityKey, string> = {
  beijing: "Beijing", nanjing: "Nanjing", xian: "Xi'an",
  shanghai: "Shanghai", suzhou: "Suzhou", zhangjiajie: "Zhangjiajie",
  hangzhou: "Hangzhou", guangzhou: "Guangzhou", chengdu: "Chengdu",
  wuhan: "Wuhan", changsha: "Changsha",
  fuzhou: "Fuzhou", jinan: "Jinan", hefei: "Hefei",
  nanchang: "Nanchang", nanning: "Nanning",
  wuxi: "Wuxi", yangzhou: "Yangzhou", yancheng: "Yancheng",
  shaoxing: "Shaoxing", xuzhou: "Xuzhou",
  quanzhou: "Quanzhou", xiamen: "Xiamen",
  dalian: "Dalian", shenyang: "Shenyang", harbin: "Harbin",
  daqing: "Daqing", changchun: "Changchun", jilin: "Jilin", yanji: "Yanji",
  jiuzhaigou: "Jiuzhaigou",
};

export const intensityScore = (i: Intensity) => (i === "High" ? 3 : i === "Medium" ? 2 : 1);
