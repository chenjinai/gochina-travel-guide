/**
 * 通用行程规划引擎 —— 数据层
 * 所有城市与景点数据，新增城市仅需在此追加
 * 算法核心不依赖任何具体城市名
 */

import type { CityMeta, Attraction } from "./types";

// ==================== 城市元数据 ====================

export const CITIES: CityMeta[] = [
  { cityId: "beijing", cityName: "北京", province: "北京", cityLevel: "一线", geoCoord: [116.4, 39.9], defaultAreas: ["天安门-故宫核心区", "天坛-前门", "海淀皇家园林区", "奥体-鸟巢", "远郊长城"], tags: { "历史古都": 10, "现代都市": 8, "美食城市": 7, "宗教文化": 5, "自然山水": 4 } },
  { cityId: "xian", cityName: "西安", province: "陕西", cityLevel: "新一线", geoCoord: [108.9, 34.3], defaultAreas: ["明城墙内", "曲江-大雁塔", "临潼东线"], tags: { "历史古都": 10, "美食城市": 8, "宗教文化": 6, "自然山水": 3 } },
  { cityId: "shanghai", cityName: "上海", province: "上海", cityLevel: "一线", geoCoord: [121.4, 31.2], defaultAreas: ["外滩-南京路", "浦东陆家嘴", "徐汇-法租界", "浦东迪士尼"], tags: { "现代都市": 10, "美食城市": 7, "历史古都": 4, "自然山水": 2 } },
  { cityId: "nanjing", cityName: "南京", province: "江苏", cityLevel: "新一线", geoCoord: [118.8, 32.0], defaultAreas: ["钟山风景区", "老城南-秦淮河", "玄武湖-市区"], tags: { "历史古都": 9, "美食城市": 7, "自然山水": 5, "现代都市": 4 } },
  { cityId: "hangzhou", cityName: "杭州", province: "浙江", cityLevel: "新一线", geoCoord: [120.1, 30.3], defaultAreas: ["西湖环湖", "灵隐-龙井"], tags: { "自然山水": 9, "历史古都": 6, "美食城市": 7, "古镇水乡": 5 } },
  { cityId: "chengdu", cityName: "成都", province: "四川", cityLevel: "新一线", geoCoord: [104.0, 30.6], defaultAreas: ["市区人文线", "武侯祠-锦里", "熊猫-近郊"], tags: { "美食城市": 10, "历史古都": 5, "自然山水": 5, "现代都市": 4 } },
  { cityId: "guangzhou", cityName: "广州", province: "广东", cityLevel: "一线", geoCoord: [113.2, 23.1], defaultAreas: ["珠江新城-广州塔", "荔湾老城区", "越秀-北京路"], tags: { "美食城市": 9, "现代都市": 7, "历史古都": 4, "自然山水": 3 } },
  { cityId: "zhangjiajie", cityName: "张家界", province: "湖南", cityLevel: "三线", geoCoord: [110.4, 29.1], defaultAreas: ["武陵源景区", "天门山景区"], tags: { "自然山水": 10, "历史古都": 1, "美食城市": 2 } },
  { cityId: "jiuzhaigou", cityName: "九寨沟", province: "四川", cityLevel: "景区", geoCoord: [103.9, 33.3], defaultAreas: ["九寨沟景区", "沟口-漳扎镇"], tags: { "自然山水": 10, "美食城市": 3, "历史古都": 1 } },
  { cityId: "wuhan", cityName: "武汉", province: "湖北", cityLevel: "新一线", geoCoord: [114.3, 30.6], defaultAreas: ["武昌人文线", "东湖风景区", "汉阳-汉口"], tags: { "历史古都": 7, "美食城市": 8, "自然山水": 6, "现代都市": 5 } },
  { cityId: "changsha", cityName: "长沙", province: "湖南", cityLevel: "新一线", geoCoord: [112.9, 28.2], defaultAreas: ["岳麓-橘子洲", "市区文化线"], tags: { "美食城市": 9, "历史古都": 5, "自然山水": 5, "现代都市": 4 } },
  { cityId: "dalian", cityName: "大连", province: "辽宁", cityLevel: "二线", geoCoord: [121.6, 38.9], defaultAreas: ["滨海路-中山广场", "旅顺口区", "市区商业线"], tags: { "自然山水": 8, "美食城市": 6, "现代都市": 5 } },
  { cityId: "shenyang", cityName: "沈阳", province: "辽宁", cityLevel: "新一线", geoCoord: [123.4, 41.8], defaultAreas: ["故宫-中街", "北陵-九一八", "太原街-西塔"], tags: { "历史古都": 8, "美食城市": 6, "现代都市": 5 } },
  { cityId: "wuxi", cityName: "无锡", province: "江苏", cityLevel: "二线", geoCoord: [120.3, 31.5], defaultAreas: ["太湖风景区", "市区人文线"], tags: { "自然山水": 8, "历史古都": 7, "美食城市": 6, "古镇水乡": 5 } },
  { cityId: "yangzhou", cityName: "扬州", province: "江苏", cityLevel: "二线", geoCoord: [119.4, 32.4], defaultAreas: ["蜀冈-瘦西湖", "老城区"], tags: { "历史古都": 8, "美食城市": 8, "古镇水乡": 7, "自然山水": 6 } },
  { cityId: "yancheng", cityName: "盐城", province: "江苏", cityLevel: "二线", geoCoord: [120.2, 33.3], defaultAreas: ["大丰生态区", "市区文化线"], tags: { "自然山水": 9, "美食城市": 4, "历史古都": 3 } },
  { cityId: "quanzhou", cityName: "泉州", province: "福建", cityLevel: "二线", geoCoord: [118.6, 24.9], defaultAreas: ["鲤城古城区", "清源山-西湖"], tags: { "历史古都": 9, "美食城市": 8, "古镇水乡": 7, "宗教文化": 5 } },
  { cityId: "xiamen", cityName: "厦门", province: "福建", cityLevel: "二线", geoCoord: [118.1, 24.5], defaultAreas: ["鼓浪屿", "厦大-南普陀", "中山路-环岛路"], tags: { "自然山水": 8, "美食城市": 7, "现代都市": 6, "历史古都": 5 } },
  { cityId: "shaoxing", cityName: "绍兴", province: "浙江", cityLevel: "二线", geoCoord: [120.6, 30.0], defaultAreas: ["越城区", "柯桥区"], tags: { "古镇水乡": 9, "历史古都": 7, "自然山水": 6, "美食城市": 5 } },
  { cityId: "xuzhou", cityName: "徐州", province: "江苏", cityLevel: "二线", geoCoord: [117.2, 34.3], defaultAreas: ["泉山区", "云龙区", "鼓楼区"], tags: { "历史古都": 8, "自然山水": 6, "美食城市": 5 } },
  { cityId: "fuzhou", cityName: "福州", province: "福建", cityLevel: "二线", geoCoord: [119.3, 26.1], defaultAreas: ["三坊七巷", "鼓山-马尾", "市区"], tags: { "历史古都": 7, "自然山水": 6, "美食城市": 6 } },
  { cityId: "jinan", cityName: "济南", province: "山东", cityLevel: "二线", geoCoord: [117.0, 36.7], defaultAreas: ["趵突泉-大明湖", "千佛山", "市区"], tags: { "历史古都": 7, "自然山水": 6, "美食城市": 5 } },
  { cityId: "hefei", cityName: "合肥", province: "安徽", cityLevel: "二线", geoCoord: [117.3, 31.9], defaultAreas: ["包公园-老城区", "大蜀山", "滨湖新区"], tags: { "历史古都": 5, "现代都市": 6, "自然山水": 5 } },
  { cityId: "nanchang", cityName: "南昌", province: "江西", cityLevel: "二线", geoCoord: [115.9, 28.7], defaultAreas: ["滕王阁-老城区", "梅岭", "红谷滩"], tags: { "历史古都": 7, "自然山水": 6, "美食城市": 5 } },
  { cityId: "nanning", cityName: "南宁", province: "广西", cityLevel: "二线", geoCoord: [108.4, 22.8], defaultAreas: ["青秀区", "武鸣区", "江南区"], tags: { "自然山水": 8, "美食城市": 6 } },
  { cityId: "yanji", cityName: "延吉", province: "吉林", cityLevel: "三线", geoCoord: [129.5, 42.9], defaultAreas: ["市中心", "帽儿山", "朝鲜族民俗园"], tags: { "美食城市": 9, "历史古都": 5, "自然山水": 6 } },

  // ===== 青甘大环线 =====
  { cityId: "xining", cityName: "西宁", province: "青海", cityLevel: "三线", geoCoord: [101.8, 36.6], defaultAreas: ["市区", "塔尔寺"], tags: { "自然山水": 8, "美食城市": 6, "宗教文化": 7, "历史古都": 4 } },
  { cityId: "qinghaihu", cityName: "青海湖", province: "青海", cityLevel: "景区", geoCoord: [100.2, 36.9], defaultAreas: ["二郎剑景区", "环湖西路"], tags: { "自然山水": 10, "历史古都": 1 } },
  { cityId: "chaka", cityName: "茶卡盐湖", province: "青海", cityLevel: "景区", geoCoord: [99.1, 36.8], defaultAreas: ["茶卡镇"], tags: { "自然山水": 10, "历史古都": 1 } },
  { cityId: "delingha", cityName: "德令哈", province: "青海", cityLevel: "四线", geoCoord: [97.4, 37.4], defaultAreas: ["市区", "可鲁克湖"], tags: { "自然山水": 7, "历史古都": 2 } },
  { cityId: "dachaidan", cityName: "大柴旦", province: "青海", cityLevel: "景区", geoCoord: [95.3, 37.9], defaultAreas: ["翡翠湖", "南八仙"], tags: { "自然山水": 10, "历史古都": 1 } },
  { cityId: "dunhuang", cityName: "敦煌", province: "甘肃", cityLevel: "四线", geoCoord: [94.6, 40.1], defaultAreas: ["莫高窟-鸣沙山", "市区", "雅丹西线"], tags: { "历史古都": 10, "自然山水": 8, "宗教文化": 9 } },
  { cityId: "jiayuguan", cityName: "嘉峪关", province: "甘肃", cityLevel: "四线", geoCoord: [98.3, 39.8], defaultAreas: ["关城景区", "市区"], tags: { "历史古都": 9, "自然山水": 6, "美食城市": 4 } },
  { cityId: "zhangye", cityName: "张掖", province: "甘肃", cityLevel: "四线", geoCoord: [100.4, 38.9], defaultAreas: ["七彩丹霞", "市区"], tags: { "自然山水": 10, "历史古都": 5, "美食城市": 5 } },
  { cityId: "lanzhou", cityName: "兰州", province: "甘肃", cityLevel: "二线", geoCoord: [103.8, 36.1], defaultAreas: ["黄河风情线", "市区"], tags: { "美食城市": 9, "历史古都": 6, "自然山水": 5, "现代都市": 5 } },
];

// ==================== 景点数据 ====================

function makeId(city: string, name: string): string {
  return `${city}_${name.replace(/[^\w\u4e00-\u9fff]/g, "")}`;
}

export const ATTRACTIONS: Attraction[] = [
  // ===== 北京 =====
  { id: makeId("beijing", "故宫博物院"), name: "故宫博物院", cityId: "beijing", area: "天安门-故宫核心区", type: "历史古迹", duration: 3, intensity: 3, ticketPrice: 60, isClosedOnMonday: true, geoCoord: [116.397, 39.916] },
  { id: makeId("beijing", "天安门广场"), name: "天安门广场", cityId: "beijing", area: "天安门-故宫核心区", type: "历史古迹", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [116.397, 39.903] },
  { id: makeId("beijing", "景山公园"), name: "景山公园", cityId: "beijing", area: "天安门-故宫核心区", type: "自然风光", duration: 1.5, intensity: 2, ticketPrice: 2, isClosedOnMonday: false, geoCoord: [116.397, 39.924] },
  { id: makeId("beijing", "天坛公园"), name: "天坛公园", cityId: "beijing", area: "天坛-前门", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 34, isClosedOnMonday: false, geoCoord: [116.407, 39.882] },
  { id: makeId("beijing", "前门大街"), name: "前门大街", cityId: "beijing", area: "天坛-前门", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [116.397, 39.899] },
  { id: makeId("beijing", "颐和园"), name: "颐和园", cityId: "beijing", area: "海淀皇家园林区", type: "自然风光", duration: 3.5, intensity: 3, ticketPrice: 30, isClosedOnMonday: false, geoCoord: [116.275, 39.999] },
  { id: makeId("beijing", "圆明园"), name: "圆明园", cityId: "beijing", area: "海淀皇家园林区", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 25, isClosedOnMonday: false, geoCoord: [116.310, 40.008] },
  { id: makeId("beijing", "鸟巢水立方"), name: "鸟巢水立方", cityId: "beijing", area: "奥体-鸟巢", type: "夜景演出", duration: 2, intensity: 1, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [116.391, 39.993] },
  { id: makeId("beijing", "八达岭长城"), name: "八达岭长城", cityId: "beijing", area: "远郊长城", type: "自然风光", duration: 4, intensity: 5, ticketPrice: 40, isClosedOnMonday: false, geoCoord: [116.017, 40.354] },
  { id: makeId("beijing", "慕田峪长城"), name: "慕田峪长城", cityId: "beijing", area: "远郊长城", type: "自然风光", duration: 3.5, intensity: 4, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [116.563, 40.438] },

  // ===== 西安 =====
  { id: makeId("xian", "兵马俑"), name: "兵马俑", cityId: "xian", area: "临潼东线", type: "历史古迹", duration: 3, intensity: 2, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [109.278, 34.384] },
  { id: makeId("xian", "华清池"), name: "华清池", cityId: "xian", area: "临潼东线", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [109.214, 34.363] },
  { id: makeId("xian", "大雁塔"), name: "大雁塔", cityId: "xian", area: "曲江-大雁塔", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [108.968, 34.219] },
  { id: makeId("xian", "大唐不夜城"), name: "大唐不夜城", cityId: "xian", area: "曲江-大雁塔", type: "夜景演出", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [108.969, 34.216] },
  { id: makeId("xian", "回民街"), name: "回民街", cityId: "xian", area: "明城墙内", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [108.944, 34.264] },
  { id: makeId("xian", "钟楼鼓楼"), name: "钟楼鼓楼", cityId: "xian", area: "明城墙内", type: "历史古迹", duration: 1, intensity: 1, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [108.949, 34.261] },
  { id: makeId("xian", "西安城墙"), name: "西安城墙", cityId: "xian", area: "明城墙内", type: "历史古迹", duration: 2, intensity: 3, ticketPrice: 54, isClosedOnMonday: false, geoCoord: [108.954, 34.257] },
  { id: makeId("xian", "陕西历史博物馆"), name: "陕西历史博物馆", cityId: "xian", area: "曲江-大雁塔", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [108.964, 34.223] },

  // ===== 上海 =====
  { id: makeId("shanghai", "外滩"), name: "外滩", cityId: "shanghai", area: "外滩-南京路", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.491, 31.237] },
  { id: makeId("shanghai", "南京路步行街"), name: "南京路步行街", cityId: "shanghai", area: "外滩-南京路", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.474, 31.234] },
  { id: makeId("shanghai", "东方明珠"), name: "东方明珠", cityId: "shanghai", area: "浦东陆家嘴", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 199, isClosedOnMonday: false, geoCoord: [121.496, 31.239] },
  { id: makeId("shanghai", "陆家嘴金融城"), name: "陆家嘴金融城", cityId: "shanghai", area: "浦东陆家嘴", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.503, 31.235] },
  { id: makeId("shanghai", "武康路"), name: "武康路", cityId: "shanghai", area: "徐汇-法租界", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.433, 31.212] },
  { id: makeId("shanghai", "豫园"), name: "豫园", cityId: "shanghai", area: "外滩-南京路", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 40, isClosedOnMonday: false, geoCoord: [121.492, 31.227] },
  { id: makeId("shanghai", "上海博物馆"), name: "上海博物馆", cityId: "shanghai", area: "外滩-南京路", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.444, 31.230] },
  { id: makeId("shanghai", "田子坊"), name: "田子坊", cityId: "shanghai", area: "徐汇-法租界", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.469, 31.214] },

  // ===== 南京 =====
  { id: makeId("nanjing", "中山陵"), name: "中山陵", cityId: "nanjing", area: "钟山风景区", type: "历史古迹", duration: 3, intensity: 4, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.851, 32.057] },
  { id: makeId("nanjing", "明孝陵"), name: "明孝陵", cityId: "nanjing", area: "钟山风景区", type: "历史古迹", duration: 2.5, intensity: 3, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [118.845, 32.060] },
  { id: makeId("nanjing", "夫子庙"), name: "夫子庙", cityId: "nanjing", area: "老城南-秦淮河", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.794, 32.022] },
  { id: makeId("nanjing", "秦淮河"), name: "秦淮河", cityId: "nanjing", area: "老城南-秦淮河", type: "夜景演出", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.791, 32.020] },
  { id: makeId("nanjing", "玄武湖"), name: "玄武湖", cityId: "nanjing", area: "玄武湖-市区", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.797, 32.060] },
  { id: makeId("nanjing", "总统府"), name: "总统府", cityId: "nanjing", area: "玄武湖-市区", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 35, isClosedOnMonday: true, geoCoord: [118.798, 32.044] },
  { id: makeId("nanjing", "南京博物院"), name: "南京博物院", cityId: "nanjing", area: "玄武湖-市区", type: "博物馆", duration: 3, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [118.822, 32.044] },
  { id: makeId("nanjing", "老门东"), name: "老门东", cityId: "nanjing", area: "老城南-秦淮河", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.789, 32.016] },
  { id: makeId("nanjing", "鸡鸣寺"), name: "鸡鸣寺", cityId: "nanjing", area: "玄武湖-市区", type: "历史古迹", duration: 1, intensity: 2, ticketPrice: 10, isClosedOnMonday: false, geoCoord: [118.744, 32.058] },

  // ===== 杭州 =====
  { id: makeId("hangzhou", "西湖"), name: "西湖", cityId: "hangzhou", area: "西湖环湖", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.143, 30.243] },
  { id: makeId("hangzhou", "灵隐寺"), name: "灵隐寺", cityId: "hangzhou", area: "灵隐-龙井", type: "历史古迹", duration: 2.5, intensity: 3, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [120.097, 30.240] },
  { id: makeId("hangzhou", "龙井村"), name: "龙井村", cityId: "hangzhou", area: "灵隐-龙井", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.104, 30.213] },
  { id: makeId("hangzhou", "雷峰塔"), name: "雷峰塔", cityId: "hangzhou", area: "西湖环湖", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 40, isClosedOnMonday: false, geoCoord: [120.147, 30.232] },
  { id: makeId("hangzhou", "断桥残雪"), name: "断桥残雪", cityId: "hangzhou", area: "西湖环湖", type: "自然风光", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.153, 30.259] },
  { id: makeId("hangzhou", "河坊街"), name: "河坊街", cityId: "hangzhou", area: "西湖环湖", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.169, 30.244] },
  { id: makeId("hangzhou", "中国丝绸博物馆"), name: "中国丝绸博物馆", cityId: "hangzhou", area: "西湖环湖", type: "博物馆", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [120.154, 30.229] },
  { id: makeId("hangzhou", "宋城"), name: "宋城", cityId: "hangzhou", area: "灵隐-龙井", type: "夜景演出", duration: 3, intensity: 1, ticketPrice: 300, isClosedOnMonday: false, geoCoord: [120.097, 30.177] },

  // ===== 成都 =====
  { id: makeId("chengdu", "宽窄巷子"), name: "宽窄巷子", cityId: "chengdu", area: "市区人文线", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [104.056, 30.668] },
  { id: makeId("chengdu", "锦里古街"), name: "锦里古街", cityId: "chengdu", area: "武侯祠-锦里", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [104.050, 30.644] },
  { id: makeId("chengdu", "武侯祠"), name: "武侯祠", cityId: "chengdu", area: "武侯祠-锦里", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [104.045, 30.643] },
  { id: makeId("chengdu", "大熊猫基地"), name: "大熊猫基地", cityId: "chengdu", area: "熊猫-近郊", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 55, isClosedOnMonday: false, geoCoord: [104.150, 30.735] },
  { id: makeId("chengdu", "杜甫草堂"), name: "杜甫草堂", cityId: "chengdu", area: "市区人文线", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [104.028, 30.660] },
  { id: makeId("chengdu", "春熙路"), name: "春熙路", cityId: "chengdu", area: "市区人文线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [104.081, 30.657] },
  { id: makeId("chengdu", "金沙遗址博物馆"), name: "金沙遗址博物馆", cityId: "chengdu", area: "市区人文线", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 70, isClosedOnMonday: true, geoCoord: [104.011, 30.683] },

  // ===== 广州 =====
  { id: makeId("guangzhou", "广州塔"), name: "广州塔", cityId: "guangzhou", area: "珠江新城-广州塔", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 150, isClosedOnMonday: false, geoCoord: [113.325, 23.106] },
  { id: makeId("guangzhou", "珠江夜游"), name: "珠江夜游", cityId: "guangzhou", area: "珠江新城-广州塔", type: "夜景演出", duration: 1.5, intensity: 1, ticketPrice: 78, isClosedOnMonday: false, geoCoord: [113.321, 23.113] },
  { id: makeId("guangzhou", "上下九步行街"), name: "上下九步行街", cityId: "guangzhou", area: "荔湾老城区", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [113.246, 23.117] },
  { id: makeId("guangzhou", "陈家祠"), name: "陈家祠", cityId: "guangzhou", area: "荔湾老城区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 10, isClosedOnMonday: false, geoCoord: [113.252, 23.130] },
  { id: makeId("guangzhou", "越秀公园"), name: "越秀公园", cityId: "guangzhou", area: "越秀-北京路", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [113.265, 23.141] },
  { id: makeId("guangzhou", "北京路"), name: "北京路", cityId: "guangzhou", area: "越秀-北京路", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [113.269, 23.122] },
  { id: makeId("guangzhou", "广东省博物馆"), name: "广东省博物馆", cityId: "guangzhou", area: "珠江新城-广州塔", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [113.330, 23.107] },

  // ===== 张家界 =====
  { id: makeId("zhangjiajie", "天门山"), name: "天门山", cityId: "zhangjiajie", area: "天门山景区", type: "自然风光", duration: 5, intensity: 4, ticketPrice: 278, isClosedOnMonday: false, geoCoord: [110.478, 29.165] },
  { id: makeId("zhangjiajie", "武陵源"), name: "武陵源", cityId: "zhangjiajie", area: "武陵源景区", type: "自然风光", duration: 6, intensity: 5, ticketPrice: 248, isClosedOnMonday: false, geoCoord: [110.550, 29.327] },
  { id: makeId("zhangjiajie", "黄龙洞"), name: "黄龙洞", cityId: "zhangjiajie", area: "武陵源景区", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 100, isClosedOnMonday: false, geoCoord: [110.577, 29.355] },
  { id: makeId("zhangjiajie", "宝峰湖"), name: "宝峰湖", cityId: "zhangjiajie", area: "武陵源景区", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 96, isClosedOnMonday: false, geoCoord: [110.553, 29.344] },
  { id: makeId("zhangjiajie", "大峡谷玻璃桥"), name: "大峡谷玻璃桥", cityId: "zhangjiajie", area: "武陵源景区", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 219, isClosedOnMonday: false, geoCoord: [110.625, 29.409] },

  // ===== 九寨沟 =====
  { id: makeId("jiuzhaigou", "九寨沟风景区"), name: "九寨沟风景区", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 6, intensity: 4, ticketPrice: 169, isClosedOnMonday: false, geoCoord: [103.920, 33.163] },
  { id: makeId("jiuzhaigou", "五花海"), name: "五花海", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.905, 33.180] },
  { id: makeId("jiuzhaigou", "诺日朗瀑布"), name: "诺日朗瀑布", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.910, 33.170] },
  { id: makeId("jiuzhaigou", "珍珠滩"), name: "珍珠滩", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 1, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.900, 33.175] },
  { id: makeId("jiuzhaigou", "树正群海"), name: "树正群海", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 1.5, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.910, 33.200] },
  { id: makeId("jiuzhaigou", "长海"), name: "长海", cityId: "jiuzhaigou", area: "九寨沟景区", type: "自然风光", duration: 1.5, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.930, 33.140] },
  { id: makeId("jiuzhaigou", "藏家乐体验"), name: "藏家乐体验", cityId: "jiuzhaigou", area: "沟口-漳扎镇", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 80, isClosedOnMonday: false, geoCoord: [103.890, 33.230] },

  // ===== 武汉 =====
  { id: makeId("wuhan", "黄鹤楼"), name: "黄鹤楼", cityId: "wuhan", area: "武昌人文线", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [114.298, 30.546] },
  { id: makeId("wuhan", "户部巷"), name: "户部巷", cityId: "wuhan", area: "武昌人文线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [114.301, 30.544] },
  { id: makeId("wuhan", "东湖风景区"), name: "东湖风景区", cityId: "wuhan", area: "东湖风景区", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [114.371, 30.563] },
  { id: makeId("wuhan", "湖北省博物馆"), name: "湖北省博物馆", cityId: "wuhan", area: "东湖风景区", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [114.363, 30.560] },
  { id: makeId("wuhan", "武汉长江大桥"), name: "武汉长江大桥", cityId: "wuhan", area: "汉阳-汉口", type: "历史古迹", duration: 1, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [114.296, 30.551] },
  { id: makeId("wuhan", "江汉路"), name: "江汉路", cityId: "wuhan", area: "汉阳-汉口", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [114.286, 30.584] },

  // ===== 长沙 =====
  { id: makeId("changsha", "岳麓山"), name: "岳麓山", cityId: "changsha", area: "岳麓-橘子洲", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [112.933, 28.184] },
  { id: makeId("changsha", "橘子洲"), name: "橘子洲", cityId: "changsha", area: "岳麓-橘子洲", type: "自然风光", duration: 2.5, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [112.958, 28.171] },
  { id: makeId("changsha", "湖南省博物馆"), name: "湖南省博物馆", cityId: "changsha", area: "市区文化线", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [112.983, 28.219] },
  { id: makeId("changsha", "太平老街"), name: "太平老街", cityId: "changsha", area: "市区文化线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [112.975, 28.197] },
  { id: makeId("changsha", "火宫殿"), name: "火宫殿", cityId: "changsha", area: "市区文化线", type: "商圈美食", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [112.976, 28.195] },
  { id: makeId("changsha", "世界之窗"), name: "世界之窗", cityId: "changsha", area: "市区文化线", type: "夜景演出", duration: 3, intensity: 2, ticketPrice: 200, isClosedOnMonday: false, geoCoord: [113.055, 28.237] },

  // ===== 大连 =====
  { id: makeId("dalian", "星海广场"), name: "星海广场", cityId: "dalian", area: "滨海路-中山广场", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.680, 38.871] },
  { id: makeId("dalian", "滨海路"), name: "滨海路", cityId: "dalian", area: "滨海路-中山广场", type: "自然风光", duration: 2.5, intensity: 3, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.711, 38.856] },
  { id: makeId("dalian", "老虎滩海洋公园"), name: "老虎滩海洋公园", cityId: "dalian", area: "滨海路-中山广场", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 220, isClosedOnMonday: false, geoCoord: [121.685, 38.873] },
  { id: makeId("dalian", "棒棰岛"), name: "棒棰岛", cityId: "dalian", area: "滨海路-中山广场", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 20, isClosedOnMonday: false, geoCoord: [121.744, 38.864] },
  { id: makeId("dalian", "俄罗斯风情街"), name: "俄罗斯风情街", cityId: "dalian", area: "市区商业线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.639, 38.923] },
  { id: makeId("dalian", "旅顺军港"), name: "旅顺军港", cityId: "dalian", area: "旅顺口区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [121.262, 38.812] },

  // ===== 沈阳 =====
  { id: makeId("shenyang", "沈阳故宫"), name: "沈阳故宫", cityId: "shenyang", area: "故宫-中街", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 60, isClosedOnMonday: true, geoCoord: [123.456, 41.795] },
  { id: makeId("shenyang", "张氏帅府"), name: "张氏帅府", cityId: "shenyang", area: "故宫-中街", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 46, isClosedOnMonday: false, geoCoord: [123.458, 41.793] },
  { id: makeId("shenyang", "中街步行街"), name: "中街步行街", cityId: "shenyang", area: "故宫-中街", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [123.457, 41.797] },
  { id: makeId("shenyang", "北陵公园"), name: "北陵公园", cityId: "shenyang", area: "北陵-九一八", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [123.427, 41.860] },
  { id: makeId("shenyang", "九一八历史博物馆"), name: "九一八历史博物馆", cityId: "shenyang", area: "北陵-九一八", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [123.468, 41.835] },
  { id: makeId("shenyang", "西塔韩国风情街"), name: "西塔韩国风情街", cityId: "shenyang", area: "太原街-西塔", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [123.404, 41.801] },

  // ===== 无锡 =====
  { id: makeId("wuxi", "鼋头渚"), name: "鼋头渚", cityId: "wuxi", area: "太湖风景区", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 90, isClosedOnMonday: false, geoCoord: [120.219, 31.523] },
  { id: makeId("wuxi", "灵山大佛"), name: "灵山大佛", cityId: "wuxi", area: "太湖风景区", type: "历史古迹", duration: 3, intensity: 2, ticketPrice: 210, isClosedOnMonday: false, geoCoord: [120.107, 31.424] },
  { id: makeId("wuxi", "惠山古镇"), name: "惠山古镇", cityId: "wuxi", area: "市区人文线", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.273, 31.583] },
  { id: makeId("wuxi", "南长街"), name: "南长街", cityId: "wuxi", area: "市区人文线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.304, 31.565] },
  { id: makeId("wuxi", "三国水浒城"), name: "三国水浒城", cityId: "wuxi", area: "太湖风景区", type: "夜景演出", duration: 3, intensity: 2, ticketPrice: 150, isClosedOnMonday: false, geoCoord: [120.228, 31.494] },
  { id: makeId("wuxi", "无锡博物院"), name: "无锡博物院", cityId: "wuxi", area: "市区人文线", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [120.299, 31.573] },
  { id: makeId("wuxi", "拈花湾"), name: "拈花湾", cityId: "wuxi", area: "太湖风景区", type: "夜景演出", duration: 2.5, intensity: 1, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [120.095, 31.410] },

  // ===== 扬州 =====
  { id: makeId("yangzhou", "瘦西湖"), name: "瘦西湖", cityId: "yangzhou", area: "蜀冈-瘦西湖", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 100, isClosedOnMonday: false, geoCoord: [119.424, 32.403] },
  { id: makeId("yangzhou", "个园"), name: "个园", cityId: "yangzhou", area: "老城区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [119.443, 32.397] },
  { id: makeId("yangzhou", "何园"), name: "何园", cityId: "yangzhou", area: "老城区", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [119.447, 32.388] },
  { id: makeId("yangzhou", "大明寺"), name: "大明寺", cityId: "yangzhou", area: "蜀冈-瘦西湖", type: "历史古迹", duration: 1.5, intensity: 2, ticketPrice: 30, isClosedOnMonday: false, geoCoord: [119.420, 32.422] },
  { id: makeId("yangzhou", "东关街"), name: "东关街", cityId: "yangzhou", area: "老城区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [119.448, 32.399] },
  { id: makeId("yangzhou", "中国大运河博物馆"), name: "中国大运河博物馆", cityId: "yangzhou", area: "蜀冈-瘦西湖", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [119.432, 32.386] },
  { id: makeId("yangzhou", "古运河夜游"), name: "古运河夜游", cityId: "yangzhou", area: "老城区", type: "夜景演出", duration: 1.5, intensity: 1, ticketPrice: 60, isClosedOnMonday: false, geoCoord: [119.445, 32.392] },

  // ===== 盐城 =====
  { id: makeId("yancheng", "中华麋鹿园"), name: "中华麋鹿园", cityId: "yancheng", area: "大丰生态区", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 60, isClosedOnMonday: false, geoCoord: [120.754, 33.065] },
  { id: makeId("yancheng", "荷兰花海"), name: "荷兰花海", cityId: "yancheng", area: "大丰生态区", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [120.501, 33.125] },
  { id: makeId("yancheng", "丹顶鹤自然保护区"), name: "丹顶鹤自然保护区", cityId: "yancheng", area: "大丰生态区", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [120.578, 33.539] },
  { id: makeId("yancheng", "新四军纪念馆"), name: "新四军纪念馆", cityId: "yancheng", area: "市区文化线", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [120.137, 33.375] },
  { id: makeId("yancheng", "水街"), name: "水街", cityId: "yancheng", area: "市区文化线", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.141, 33.382] },
  { id: makeId("yancheng", "黄海森林公园"), name: "黄海森林公园", cityId: "yancheng", area: "大丰生态区", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [120.815, 32.840] },
  { id: makeId("yancheng", "大纵湖"), name: "大纵湖", cityId: "yancheng", area: "市区文化线", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 60, isClosedOnMonday: false, geoCoord: [119.865, 33.395] },

  // ===== 泉州 =====
  { id: makeId("quanzhou", "开元寺"), name: "开元寺", cityId: "quanzhou", area: "鲤城古城区", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.589, 24.917] },
  { id: makeId("quanzhou", "清源山"), name: "清源山", cityId: "quanzhou", area: "清源山-西湖", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [118.607, 24.949] },
  { id: makeId("quanzhou", "西街"), name: "西街", cityId: "quanzhou", area: "鲤城古城区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.588, 24.916] },
  { id: makeId("quanzhou", "崇武古城"), name: "崇武古城", cityId: "quanzhou", area: "清源山-西湖", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 45, isClosedOnMonday: false, geoCoord: [118.778, 24.875] },
  { id: makeId("quanzhou", "洛阳桥"), name: "洛阳桥", cityId: "quanzhou", area: "鲤城古城区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.641, 24.954] },
  { id: makeId("quanzhou", "海外交通史博物馆"), name: "海外交通史博物馆", cityId: "quanzhou", area: "鲤城古城区", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [118.602, 24.908] },
  { id: makeId("quanzhou", "关帝庙天后宫"), name: "关帝庙天后宫", cityId: "quanzhou", area: "鲤城古城区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.591, 24.913] },

  // ===== 厦门 =====
  { id: makeId("xiamen", "鼓浪屿"), name: "鼓浪屿", cityId: "xiamen", area: "鼓浪屿", type: "自然风光", duration: 5, intensity: 3, ticketPrice: 35, isClosedOnMonday: false, geoCoord: [118.068, 24.448] },
  { id: makeId("xiamen", "南普陀寺"), name: "南普陀寺", cityId: "xiamen", area: "厦大-南普陀", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.092, 24.443] },
  { id: makeId("xiamen", "厦门大学"), name: "厦门大学", cityId: "xiamen", area: "厦大-南普陀", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.097, 24.437] },
  { id: makeId("xiamen", "中山路步行街"), name: "中山路步行街", cityId: "xiamen", area: "中山路-环岛路", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.084, 24.454] },
  { id: makeId("xiamen", "环岛路"), name: "环岛路", cityId: "xiamen", area: "中山路-环岛路", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.116, 24.434] },
  { id: makeId("xiamen", "曾厝垵"), name: "曾厝垵", cityId: "xiamen", area: "中山路-环岛路", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.110, 24.435] },
  { id: makeId("xiamen", "沙坡尾"), name: "沙坡尾", cityId: "xiamen", area: "中山路-环岛路", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [118.088, 24.441] },

  // ===== 绍兴 =====
  { id: makeId("shaoxing", "鲁迅故里"), name: "鲁迅故里", cityId: "shaoxing", area: "越城区", type: "历史古迹", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.583, 30.001] },
  { id: makeId("shaoxing", "沈园"), name: "沈园", cityId: "shaoxing", area: "越城区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 40, isClosedOnMonday: false, geoCoord: [120.585, 29.999] },
  { id: makeId("shaoxing", "兰亭"), name: "兰亭", cityId: "shaoxing", area: "柯桥区", type: "历史古迹", duration: 2, intensity: 2, ticketPrice: 80, isClosedOnMonday: false, geoCoord: [120.516, 29.970] },
  { id: makeId("shaoxing", "安昌古镇"), name: "安昌古镇", cityId: "shaoxing", area: "柯桥区", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.567, 30.104] },
  { id: makeId("shaoxing", "仓桥直街"), name: "仓桥直街", cityId: "shaoxing", area: "越城区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [120.581, 30.005] },
  { id: makeId("shaoxing", "东湖"), name: "东湖", cityId: "shaoxing", area: "越城区", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [120.592, 30.012] },
  { id: makeId("shaoxing", "柯岩风景区"), name: "柯岩风景区", cityId: "shaoxing", area: "柯桥区", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 115, isClosedOnMonday: false, geoCoord: [120.494, 30.085] },

  // ===== 徐州 =====
  { id: makeId("xuzhou", "云龙湖"), name: "云龙湖", cityId: "xuzhou", area: "泉山区", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [117.157, 34.232] },
  { id: makeId("xuzhou", "徐州博物馆"), name: "徐州博物馆", cityId: "xuzhou", area: "泉山区", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [117.185, 34.263] },
  { id: makeId("xuzhou", "龟山汉墓"), name: "龟山汉墓", cityId: "xuzhou", area: "鼓楼区", type: "历史古迹", duration: 1.5, intensity: 2, ticketPrice: 60, isClosedOnMonday: false, geoCoord: [117.127, 34.290] },
  { id: makeId("xuzhou", "户部山古民居"), name: "户部山古民居", cityId: "xuzhou", area: "云龙区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 25, isClosedOnMonday: false, geoCoord: [117.191, 34.258] },
  { id: makeId("xuzhou", "回龙窝历史文化街区"), name: "回龙窝历史文化街区", cityId: "xuzhou", area: "云龙区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [117.189, 34.260] },
  { id: makeId("xuzhou", "汉兵马俑博物馆"), name: "汉兵马俑博物馆", cityId: "xuzhou", area: "云龙区", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 80, isClosedOnMonday: false, geoCoord: [117.195, 34.255] },
  { id: makeId("xuzhou", "彭祖园"), name: "彭祖园", cityId: "xuzhou", area: "泉山区", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [117.162, 34.235] },

  // ===== 延吉 =====
  { id: makeId("yanji", "延边大学"), name: "延边大学", cityId: "yanji", area: "市中心", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [129.508, 42.908] },
  { id: makeId("yanji", "朝鲜族民俗园"), name: "朝鲜族民俗园", cityId: "yanji", area: "朝鲜族民俗园", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 30, isClosedOnMonday: false, geoCoord: [129.520, 42.915] },
  { id: makeId("yanji", "帽儿山国家森林公园"), name: "帽儿山国家森林公园", cityId: "yanji", area: "帽儿山", type: "自然风光", duration: 3, intensity: 3, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [129.485, 42.890] },
  { id: makeId("yanji", "西市场"), name: "西市场", cityId: "yanji", area: "市中心", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [129.512, 42.905] },
  { id: makeId("yanji", "延吉公园"), name: "延吉公园", cityId: "yanji", area: "市中心", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [129.510, 42.910] },
  { id: makeId("yanji", "图们江广场"), name: "图们江广场", cityId: "yanji", area: "市中心", type: "历史古迹", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [129.515, 42.902] },
  { id: makeId("yanji", "延吉博物馆"), name: "延吉博物馆", cityId: "yanji", area: "市中心", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [129.518, 42.908] },

  // ===== 西宁 =====
  { id: makeId("xining", "塔尔寺"), name: "塔尔寺", cityId: "xining", area: "塔尔寺", type: "历史古迹", duration: 3, intensity: 2, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [101.575, 36.491] },
  { id: makeId("xining", "东关清真大寺"), name: "东关清真大寺", cityId: "xining", area: "市区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [101.797, 36.616] },
  { id: makeId("xining", "青海省博物馆"), name: "青海省博物馆", cityId: "xining", area: "市区", type: "博物馆", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [101.781, 36.627] },
  { id: makeId("xining", "莫家街"), name: "莫家街", cityId: "xining", area: "市区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [101.805, 36.620] },
  { id: makeId("xining", "青藏高原野生动物园"), name: "青藏高原野生动物园", cityId: "xining", area: "市区", type: "自然风光", duration: 2.5, intensity: 2, ticketPrice: 30, isClosedOnMonday: false, geoCoord: [101.751, 36.633] },
  { id: makeId("xining", "北禅寺"), name: "北禅寺", cityId: "xining", area: "市区", type: "历史古迹", duration: 1.5, intensity: 2, ticketPrice: 10, isClosedOnMonday: false, geoCoord: [101.789, 36.643] },

  // ===== 青海湖 =====
  { id: makeId("qinghaihu", "二郎剑景区"), name: "二郎剑景区", cityId: "qinghaihu", area: "二郎剑景区", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 100, isClosedOnMonday: false, geoCoord: [100.502, 36.575] },
  { id: makeId("qinghaihu", "黑马河日出"), name: "黑马河日出", cityId: "qinghaihu", area: "环湖西路", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [99.780, 36.730] },
  { id: makeId("qinghaihu", "环湖西路骑行"), name: "环湖西路骑行", cityId: "qinghaihu", area: "环湖西路", type: "自然风光", duration: 3, intensity: 4, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [99.802, 36.831] },
  { id: makeId("qinghaihu", "鸟岛"), name: "鸟岛", cityId: "qinghaihu", area: "环湖西路", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [99.601, 37.047] },
  { id: makeId("qinghaihu", "金银滩草原"), name: "金银滩草原", cityId: "qinghaihu", area: "二郎剑景区", type: "自然风光", duration: 2, intensity: 1, ticketPrice: 20, isClosedOnMonday: false, geoCoord: [100.932, 36.772] },

  // ===== 茶卡盐湖 =====
  { id: makeId("chaka", "天空之镜"), name: "天空之镜", cityId: "chaka", area: "茶卡镇", type: "自然风光", duration: 3, intensity: 2, ticketPrice: 70, isClosedOnMonday: false, geoCoord: [99.095, 36.791] },
  { id: makeId("chaka", "茶卡盐雕广场"), name: "茶卡盐雕广场", cityId: "chaka", area: "茶卡镇", type: "自然风光", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [99.098, 36.788] },
  { id: makeId("chaka", "小火车游湖"), name: "小火车游湖", cityId: "chaka", area: "茶卡镇", type: "自然风光", duration: 1.5, intensity: 1, ticketPrice: 50, isClosedOnMonday: false, geoCoord: [99.092, 36.793] },

  // ===== 德令哈 =====
  { id: makeId("delingha", "可鲁克湖"), name: "可鲁克湖", cityId: "delingha", area: "可鲁克湖", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 20, isClosedOnMonday: false, geoCoord: [96.864, 37.285] },
  { id: makeId("delingha", "托素湖"), name: "托素湖", cityId: "delingha", area: "可鲁克湖", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [96.941, 37.279] },
  { id: makeId("delingha", "海子诗歌陈列馆"), name: "海子诗歌陈列馆", cityId: "delingha", area: "市区", type: "博物馆", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [97.367, 37.374] },

  // ===== 大柴旦 =====
  { id: makeId("dachaidan", "翡翠湖"), name: "翡翠湖", cityId: "dachaidan", area: "翡翠湖", type: "自然风光", duration: 2.5, intensity: 2, ticketPrice: 60, isClosedOnMonday: false, geoCoord: [95.255, 37.855] },
  { id: makeId("dachaidan", "南八仙魔鬼城"), name: "南八仙魔鬼城", cityId: "dachaidan", area: "南八仙", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [94.319, 38.121] },
  { id: makeId("dachaidan", "水上雅丹"), name: "水上雅丹", cityId: "dachaidan", area: "翡翠湖", type: "自然风光", duration: 2.5, intensity: 2, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [93.760, 38.127] },
  { id: makeId("dachaidan", "U型公路"), name: "U型公路", cityId: "dachaidan", area: "南八仙", type: "自然风光", duration: 0.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [94.291, 38.036] },

  // ===== 敦煌 =====
  { id: makeId("dunhuang", "莫高窟"), name: "莫高窟", cityId: "dunhuang", area: "莫高窟-鸣沙山", type: "历史古迹", duration: 3.5, intensity: 2, ticketPrice: 238, isClosedOnMonday: false, geoCoord: [94.807, 40.036] },
  { id: makeId("dunhuang", "鸣沙山月牙泉"), name: "鸣沙山月牙泉", cityId: "dunhuang", area: "莫高窟-鸣沙山", type: "自然风光", duration: 3, intensity: 4, ticketPrice: 110, isClosedOnMonday: false, geoCoord: [94.670, 40.086] },
  { id: makeId("dunhuang", "沙洲夜市"), name: "沙洲夜市", cityId: "dunhuang", area: "市区", type: "商圈美食", duration: 2, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [94.665, 40.141] },
  { id: makeId("dunhuang", "玉门关"), name: "玉门关", cityId: "dunhuang", area: "雅丹西线", type: "历史古迹", duration: 1.5, intensity: 2, ticketPrice: 40, isClosedOnMonday: false, geoCoord: [93.878, 40.354] },
  { id: makeId("dunhuang", "雅丹魔鬼城"), name: "雅丹魔鬼城", cityId: "dunhuang", area: "雅丹西线", type: "自然风光", duration: 2.5, intensity: 3, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [93.166, 40.537] },
  { id: makeId("dunhuang", "敦煌博物馆"), name: "敦煌博物馆", cityId: "dunhuang", area: "市区", type: "博物馆", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [94.668, 40.137] },
  { id: makeId("dunhuang", "又见敦煌演出"), name: "又见敦煌演出", cityId: "dunhuang", area: "市区", type: "夜景演出", duration: 1.5, intensity: 1, ticketPrice: 298, isClosedOnMonday: false, geoCoord: [94.662, 40.134] },

  // ===== 嘉峪关 =====
  { id: makeId("jiayuguan", "嘉峪关城楼"), name: "嘉峪关城楼", cityId: "jiayuguan", area: "关城景区", type: "历史古迹", duration: 2.5, intensity: 2, ticketPrice: 120, isClosedOnMonday: false, geoCoord: [98.218, 39.801] },
  { id: makeId("jiayuguan", "悬壁长城"), name: "悬壁长城", cityId: "jiayuguan", area: "关城景区", type: "历史古迹", duration: 1.5, intensity: 3, ticketPrice: 21, isClosedOnMonday: false, geoCoord: [98.235, 39.854] },
  { id: makeId("jiayuguan", "长城第一墩"), name: "长城第一墩", cityId: "jiayuguan", area: "关城景区", type: "历史古迹", duration: 1, intensity: 1, ticketPrice: 22, isClosedOnMonday: false, geoCoord: [98.289, 39.740] },
  { id: makeId("jiayuguan", "方特欢乐世界"), name: "方特欢乐世界", cityId: "jiayuguan", area: "市区", type: "夜景演出", duration: 4, intensity: 2, ticketPrice: 280, isClosedOnMonday: false, geoCoord: [98.310, 39.780] },

  // ===== 张掖 =====
  { id: makeId("zhangye", "七彩丹霞"), name: "七彩丹霞", cityId: "zhangye", area: "七彩丹霞", type: "自然风光", duration: 3.5, intensity: 3, ticketPrice: 75, isClosedOnMonday: false, geoCoord: [99.996, 38.934] },
  { id: makeId("zhangye", "冰沟丹霞"), name: "冰沟丹霞", cityId: "zhangye", area: "七彩丹霞", type: "自然风光", duration: 2, intensity: 3, ticketPrice: 80, isClosedOnMonday: false, geoCoord: [99.933, 38.958] },
  { id: makeId("zhangye", "大佛寺"), name: "大佛寺", cityId: "zhangye", area: "市区", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 41, isClosedOnMonday: false, geoCoord: [100.457, 38.937] },
  { id: makeId("zhangye", "马蹄寺"), name: "马蹄寺", cityId: "zhangye", area: "市区", type: "历史古迹", duration: 3, intensity: 3, ticketPrice: 74, isClosedOnMonday: false, geoCoord: [100.430, 38.482] },
  { id: makeId("zhangye", "平山湖大峡谷"), name: "平山湖大峡谷", cityId: "zhangye", area: "七彩丹霞", type: "自然风光", duration: 3, intensity: 4, ticketPrice: 130, isClosedOnMonday: false, geoCoord: [100.069, 39.089] },
  { id: makeId("zhangye", "张掖夜市"), name: "张掖夜市", cityId: "zhangye", area: "市区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [100.462, 38.933] },

  // ===== 兰州 =====
  { id: makeId("lanzhou", "黄河铁桥"), name: "黄河铁桥", cityId: "lanzhou", area: "黄河风情线", type: "历史古迹", duration: 1, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.817, 36.064] },
  { id: makeId("lanzhou", "白塔山公园"), name: "白塔山公园", cityId: "lanzhou", area: "黄河风情线", type: "自然风光", duration: 2, intensity: 3, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.814, 36.067] },
  { id: makeId("lanzhou", "水车博览园"), name: "水车博览园", cityId: "lanzhou", area: "黄河风情线", type: "历史古迹", duration: 1.5, intensity: 1, ticketPrice: 20, isClosedOnMonday: false, geoCoord: [103.833, 36.061] },
  { id: makeId("lanzhou", "正宁路夜市"), name: "正宁路夜市", cityId: "lanzhou", area: "市区", type: "商圈美食", duration: 1.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.819, 36.055] },
  { id: makeId("lanzhou", "甘肃省博物馆"), name: "甘肃省博物馆", cityId: "lanzhou", area: "市区", type: "博物馆", duration: 2.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: true, geoCoord: [103.773, 36.063] },
  { id: makeId("lanzhou", "五泉山公园"), name: "五泉山公园", cityId: "lanzhou", area: "市区", type: "自然风光", duration: 2, intensity: 2, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.830, 36.046] },
  { id: makeId("lanzhou", "黄河母亲雕塑"), name: "黄河母亲雕塑", cityId: "lanzhou", area: "黄河风情线", type: "历史古迹", duration: 0.5, intensity: 1, ticketPrice: 0, isClosedOnMonday: false, geoCoord: [103.802, 36.066] },
];

// ==================== 数据查询工具函数 ====================

/** 根据 cityId 获取城市元数据 */
export function getCityById(cityId: string): CityMeta | undefined {
  return CITIES.find((c) => c.cityId === cityId);
}

/** 根据城市名获取城市元数据 */
export function getCityByName(cityName: string): CityMeta | undefined {
  return CITIES.find((c) => c.cityName === cityName);
}

/** 获取某个城市的所有景点 */
export function getAttractionsByCity(cityId: string): Attraction[] {
  return ATTRACTIONS.filter((a) => a.cityId === cityId);
}

/** 获取某个城市的所有片区 */
export function getAreasByCity(cityId: string): string[] {
  const city = getCityById(cityId);
  if (city) return [...city.defaultAreas];
  const areas = new Set<string>();
  ATTRACTIONS.filter((a) => a.cityId === cityId).forEach((a) => areas.add(a.area));
  return [...areas];
}

/** 获取某个片区的所有景点 */
export function getAttractionsByArea(cityId: string, area: string): Attraction[] {
  return ATTRACTIONS.filter((a) => a.cityId === cityId && a.area === area);
}

/** 根据偏好推荐城市（匹配度排序） */
export function recommendCitiesByPreferences(preferences: string[]): CityMeta[] {
  const scored = CITIES.map((city) => {
    let score = 0;
    for (const pref of preferences) {
      score += city.tags[pref] || 0;
    }
    return { city, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.city);
}

/** 根据城市名模糊匹配城市ID */
export function fuzzyMatchCity(cityName: string): string | null {
  const direct = getCityByName(cityName);
  if (direct) return direct.cityId;

  // 尝试部分匹配
  for (const city of CITIES) {
    if (city.cityName.includes(cityName) || cityName.includes(city.cityName)) {
      return city.cityId;
    }
  }
  return null;
}
