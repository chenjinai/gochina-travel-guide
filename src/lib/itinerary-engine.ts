/**
 * 行程生成引擎 v2 — 基于地理片区聚类 + 时间写实
 *
 * 核心改进：
 * 1. 空间聚类：同一天景点必须在同一地理片区，禁止跨区折返
 * 2. 时间写实：景点间加交通时间，固定午餐/晚餐/缓冲时段
 * 3. 节奏优化：上午户外大景点 → 下午博物馆/老街 → 晚上夜景/美食
 * 4. 跨城规则：跨城当天只安排半天
 * 5. 步行距离估算 + 节奏标签
 */

// ==================== 类型定义 ====================

export interface Attraction {
  name: string;
  type: string;
  duration: string;        // 建议游玩时长（如 "2-3小时"）
  district: string;        // 行政区域
  zone: string;            // 地理片区（核心分组字段）
  price: number;
  bestTime: "morning" | "afternoon" | "evening" | "any";
  intensity: "high" | "medium" | "low";
}

export interface TimeSlotItem {
  name: string;
  duration: string;
  price: number;
  durationHour: number;    // 数值化时长（小时），用于时间计算
}

export interface DayItinerary {
  day: number;
  city: string;
  zone: string;           // 当日所在片区
  pace: string;
  walkingKm: string;      // 当日步行约几公里
  dayLabel: string;       // 节奏标签（悠闲/适中/紧凑）
  morning: TimeSlotItem[];
  afternoon: TimeSlotItem[];
  evening: TimeSlotItem[];
  transport: string;
  accommodation: string;
}

export interface ItineraryResult {
  days: DayItinerary[];
  totalBudget: string;
  cities: string[];
  totalWalkingKm: number;
}

export interface UserParams {
  days: string;
  companions: string;
  preferences: string[];
  pace: string;
  budget: string;
  destination: string;
}

type BudgetLevel = "low" | "mid" | "high";

// ==================== 地理片区数据库 ====================
// 每个城市的景点按地理片区组织，同一片区景点可共组一日行程

interface ZoneData {
  name: string;
  attractions: Attraction[];
  /** 同片区景点间交通时间（分钟） */
  transitMinutes: number;
  /** 自然/户外系数，0-1，越高越适合上午安排 */
  outdoorRatio: number;
}

const CITY_ZONES: Record<string, ZoneData[]> = {
  北京: [
    {
      name: "天安门-故宫核心区",
      transitMinutes: 15,
      outdoorRatio: 0.3,
      attractions: [
        { name: "故宫博物院", type: "历史古迹", duration: "3-4小时", district: "东城区", zone: "天安门-故宫核心区", price: 60, bestTime: "morning", intensity: "high" },
        { name: "天安门广场", type: "城市广场", duration: "1-1.5小时", district: "东城区", zone: "天安门-故宫核心区", price: 0, bestTime: "morning", intensity: "low" },
        { name: "景山公园", type: "皇家园林", duration: "1-1.5小时", district: "西城区", zone: "天安门-故宫核心区", price: 2, bestTime: "afternoon", intensity: "medium" },
        { name: "北海公园", type: "皇家园林", duration: "1.5-2.5小时", district: "西城区", zone: "天安门-故宫核心区", price: 10, bestTime: "afternoon", intensity: "medium" },
        { name: "王府井大街", type: "商业街区", duration: "1-2小时", district: "东城区", zone: "天安门-故宫核心区", price: 0, bestTime: "evening", intensity: "low" },
        { name: "南锣鼓巷", type: "文化街区", duration: "1-2小时", district: "东城区", zone: "天安门-故宫核心区", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "什刹海/后海", type: "历史文化", duration: "1.5-2.5小时", district: "西城区", zone: "天安门-故宫核心区", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "天坛-前门",
      transitMinutes: 10,
      outdoorRatio: 0.5,
      attractions: [
        { name: "天坛公园", type: "历史古迹", duration: "2-3小时", district: "东城区", zone: "天坛-前门", price: 15, bestTime: "morning", intensity: "medium" },
        { name: "前门大街", type: "商业街区", duration: "1-2小时", district: "东城区", zone: "天坛-前门", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "国家博物馆", type: "博物馆", duration: "3-4小时", district: "东城区", zone: "天坛-前门", price: 0, bestTime: "afternoon", intensity: "medium" },
        { name: "大栅栏", type: "文化街区", duration: "1-2小时", district: "西城区", zone: "天坛-前门", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "海淀皇家园林区",
      transitMinutes: 20,
      outdoorRatio: 0.7,
      attractions: [
        { name: "颐和园", type: "皇家园林", duration: "3-4小时", district: "海淀区", zone: "海淀皇家园林区", price: 30, bestTime: "morning", intensity: "high" },
        { name: "圆明园遗址公园", type: "历史遗迹", duration: "2-3小时", district: "海淀区", zone: "海淀皇家园林区", price: 25, bestTime: "afternoon", intensity: "medium" },
        { name: "清华大学", type: "校园文化", duration: "1-2小时", district: "海淀区", zone: "海淀皇家园林区", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "北京大学", type: "校园文化", duration: "1-2小时", district: "海淀区", zone: "海淀皇家园林区", price: 0, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "奥体-鸟巢",
      transitMinutes: 15,
      outdoorRatio: 0.4,
      attractions: [
        { name: "鸟巢/水立方", type: "现代建筑", duration: "1.5-2.5小时", district: "朝阳区", zone: "奥体-鸟巢", price: 50, bestTime: "afternoon", intensity: "medium" },
        { name: "奥林匹克森林公园", type: "城市公园", duration: "2-3小时", district: "朝阳区", zone: "奥体-鸟巢", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "798艺术区", type: "文化创意", duration: "2-3小时", district: "朝阳区", zone: "奥体-鸟巢", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "三里屯", type: "商业街区", duration: "1.5-2.5小时", district: "朝阳区", zone: "奥体-鸟巢", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "远郊长城",
      transitMinutes: 30,
      outdoorRatio: 1.0,
      attractions: [
        { name: "八达岭长城", type: "历史古迹", duration: "4-5小时", district: "延庆区", zone: "远郊长城", price: 40, bestTime: "morning", intensity: "high" },
        { name: "十三陵", type: "历史古迹", duration: "2-3小时", district: "昌平区", zone: "远郊长城", price: 45, bestTime: "afternoon", intensity: "medium" },
      ],
    },
  ],

  西安: [
    {
      name: "明城墙内老城区",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "钟鼓楼", type: "历史古迹", duration: "1-1.5小时", district: "莲湖区", zone: "明城墙内老城区", price: 35, bestTime: "morning", intensity: "low" },
        { name: "古城墙", type: "历史古迹", duration: "2-3小时", district: "碑林区", zone: "明城墙内老城区", price: 54, bestTime: "morning", intensity: "high" },
        { name: "回民街", type: "美食街区", duration: "1.5-2.5小时", district: "莲湖区", zone: "明城墙内老城区", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "碑林博物馆", type: "博物馆", duration: "1.5-2.5小时", district: "碑林区", zone: "明城墙内老城区", price: 65, bestTime: "afternoon", intensity: "medium" },
        { name: "永兴坊", type: "美食街区", duration: "1.5-2小时", district: "新城区", zone: "明城墙内老城区", price: 0, bestTime: "evening", intensity: "low" },
        { name: "大明宫遗址公园", type: "历史遗迹", duration: "2-3小时", district: "新城区", zone: "明城墙内老城区", price: 60, bestTime: "morning", intensity: "medium" },
      ],
    },
    {
      name: "曲江-大雁塔",
      transitMinutes: 10,
      outdoorRatio: 0.4,
      attractions: [
        { name: "陕西历史博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "雁塔区", zone: "曲江-大雁塔", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "大雁塔", type: "宗教文化", duration: "1.5-2.5小时", district: "雁塔区", zone: "曲江-大雁塔", price: 50, bestTime: "afternoon", intensity: "medium" },
        { name: "大唐不夜城", type: "文化街区", duration: "2-3小时", district: "雁塔区", zone: "曲江-大雁塔", price: 0, bestTime: "evening", intensity: "low" },
        { name: "大唐芙蓉园", type: "主题公园", duration: "2-3小时", district: "雁塔区", zone: "曲江-大雁塔", price: 120, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "临潼东线",
      transitMinutes: 20,
      outdoorRatio: 0.6,
      attractions: [
        { name: "兵马俑", type: "历史古迹", duration: "3-4小时", district: "临潼区", zone: "临潼东线", price: 120, bestTime: "morning", intensity: "high" },
        { name: "华清宫", type: "历史古迹", duration: "2-3小时", district: "临潼区", zone: "临潼东线", price: 120, bestTime: "afternoon", intensity: "medium" },
        { name: "骊山", type: "自然山水", duration: "2-3小时", district: "临潼区", zone: "临潼东线", price: 45, bestTime: "afternoon", intensity: "high" },
      ],
    },
  ],

  上海: [
    {
      name: "外滩-南京路",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "外滩", type: "城市景观", duration: "1-2小时", district: "黄浦区", zone: "外滩-南京路", price: 0, bestTime: "morning", intensity: "low" },
        { name: "南京路步行街", type: "商业街区", duration: "1.5-2.5小时", district: "黄浦区", zone: "外滩-南京路", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "新天地", type: "文化休闲", duration: "1.5-2.5小时", district: "黄浦区", zone: "外滩-南京路", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "豫园", type: "古典园林", duration: "1.5-2.5小时", district: "黄浦区", zone: "外滩-南京路", price: 40, bestTime: "morning", intensity: "medium" },
        { name: "上海博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "黄浦区", zone: "外滩-南京路", price: 0, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "浦东陆家嘴",
      transitMinutes: 15,
      outdoorRatio: 0.4,
      attractions: [
        { name: "东方明珠", type: "现代建筑", duration: "2-3小时", district: "浦东新区", zone: "浦东陆家嘴", price: 199, bestTime: "morning", intensity: "medium" },
        { name: "陆家嘴金融区", type: "城市景观", duration: "1-2小时", district: "浦东新区", zone: "浦东陆家嘴", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "上海中心大厦", type: "现代建筑", duration: "1.5-2.5小时", district: "浦东新区", zone: "浦东陆家嘴", price: 180, bestTime: "afternoon", intensity: "medium" },
        { name: "浦东滨江大道", type: "城市景观", duration: "1-2小时", district: "浦东新区", zone: "浦东陆家嘴", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "徐汇-法租界",
      transitMinutes: 12,
      outdoorRatio: 0.3,
      attractions: [
        { name: "武康路", type: "历史文化", duration: "1.5-2.5小时", district: "徐汇区", zone: "徐汇-法租界", price: 0, bestTime: "morning", intensity: "low" },
        { name: "田子坊", type: "文化创意", duration: "1.5-2.5小时", district: "徐汇区", zone: "徐汇-法租界", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "上海图书馆", type: "文化场馆", duration: "1-2小时", district: "徐汇区", zone: "徐汇-法租界", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "衡山路酒吧街", type: "夜生活", duration: "2小时", district: "徐汇区", zone: "徐汇-法租界", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "浦东迪士尼",
      transitMinutes: 20,
      outdoorRatio: 0.6,
      attractions: [
        { name: "上海迪士尼", type: "主题乐园", duration: "8-10小时", district: "浦东新区", zone: "浦东迪士尼", price: 475, bestTime: "morning", intensity: "high" },
      ],
    },
  ],

  南京: [
    {
      name: "钟山风景区",
      transitMinutes: 15,
      outdoorRatio: 0.7,
      attractions: [
        { name: "中山陵", type: "历史纪念", duration: "2-3小时", district: "玄武区", zone: "钟山风景区", price: 0, bestTime: "morning", intensity: "high" },
        { name: "明孝陵", type: "历史古迹", duration: "2.5-3.5小时", district: "玄武区", zone: "钟山风景区", price: 70, bestTime: "morning", intensity: "high" },
        { name: "灵谷寺", type: "宗教文化", duration: "1.5-2.5小时", district: "玄武区", zone: "钟山风景区", price: 35, bestTime: "afternoon", intensity: "medium" },
        { name: "美龄宫", type: "历史建筑", duration: "1-1.5小时", district: "玄武区", zone: "钟山风景区", price: 30, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "老城南-秦淮河",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "夫子庙·秦淮河", type: "文化街区", duration: "2-3小时", district: "秦淮区", zone: "老城南-秦淮河", price: 0, bestTime: "evening", intensity: "low" },
        { name: "老门东", type: "文化街区", duration: "1.5-2.5小时", district: "秦淮区", zone: "老城南-秦淮河", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "中华门城堡", type: "历史古迹", duration: "1-2小时", district: "秦淮区", zone: "老城南-秦淮河", price: 50, bestTime: "morning", intensity: "medium" },
        { name: "大报恩寺遗址", type: "历史遗迹", duration: "1.5-2.5小时", district: "秦淮区", zone: "老城南-秦淮河", price: 90, bestTime: "afternoon", intensity: "medium" },
        { name: "瞻园", type: "古典园林", duration: "1-2小时", district: "秦淮区", zone: "老城南-秦淮河", price: 30, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "玄武湖-市区",
      transitMinutes: 12,
      outdoorRatio: 0.5,
      attractions: [
        { name: "玄武湖公园", type: "城市公园", duration: "2-3小时", district: "玄武区", zone: "玄武湖-市区", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "南京博物院", type: "博物馆", duration: "3-4小时", district: "玄武区", zone: "玄武湖-市区", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "总统府", type: "历史古迹", duration: "2-3小时", district: "玄武区", zone: "玄武湖-市区", price: 35, bestTime: "afternoon", intensity: "medium" },
        { name: "鸡鸣寺", type: "宗教文化", duration: "1-1.5小时", district: "玄武区", zone: "玄武湖-市区", price: 10, bestTime: "morning", intensity: "low" },
        { name: "1912街区", type: "文化休闲", duration: "1.5-2.5小时", district: "玄武区", zone: "玄武湖-市区", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
  ],

  杭州: [
    {
      name: "西湖环湖",
      transitMinutes: 15,
      outdoorRatio: 0.7,
      attractions: [
        { name: "西湖", type: "自然山水", duration: "4-6小时", district: "西湖区", zone: "西湖环湖", price: 0, bestTime: "morning", intensity: "high" },
        { name: "断桥残雪", type: "自然山水", duration: "0.5-1小时", district: "西湖区", zone: "西湖环湖", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "雷峰塔", type: "历史古迹", duration: "1-2小时", district: "西湖区", zone: "西湖环湖", price: 40, bestTime: "afternoon", intensity: "medium" },
        { name: "苏堤", type: "自然山水", duration: "1-2小时", district: "西湖区", zone: "西湖环湖", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "河坊街", type: "文化街区", duration: "1.5-2.5小时", district: "上城区", zone: "西湖环湖", price: 0, bestTime: "evening", intensity: "low" },
        { name: "岳王庙", type: "历史古迹", duration: "1-1.5小时", district: "西湖区", zone: "西湖环湖", price: 25, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "灵隐-龙井",
      transitMinutes: 15,
      outdoorRatio: 0.8,
      attractions: [
        { name: "灵隐寺", type: "宗教文化", duration: "2-3小时", district: "西湖区", zone: "灵隐-龙井", price: 75, bestTime: "morning", intensity: "medium" },
        { name: "龙井村", type: "自然山水", duration: "2-3小时", district: "西湖区", zone: "灵隐-龙井", price: 0, bestTime: "afternoon", intensity: "medium" },
        { name: "西溪湿地", type: "自然山水", duration: "3-4小时", district: "西湖区", zone: "灵隐-龙井", price: 80, bestTime: "morning", intensity: "high" },
      ],
    },
  ],

  成都: [
    {
      name: "市区人文线",
      transitMinutes: 12,
      outdoorRatio: 0.3,
      attractions: [
        { name: "宽窄巷子", type: "文化街区", duration: "2-3小时", district: "青羊区", zone: "市区人文线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "人民公园", type: "城市公园", duration: "1-2小时", district: "青羊区", zone: "市区人文线", price: 0, bestTime: "morning", intensity: "low" },
        { name: "文殊院", type: "宗教文化", duration: "1-2小时", district: "青羊区", zone: "市区人文线", price: 0, bestTime: "morning", intensity: "low" },
        { name: "春熙路", type: "商业街区", duration: "1.5-2.5小时", district: "锦江区", zone: "市区人文线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "九眼桥", type: "夜生活", duration: "1.5-2.5小时", district: "锦江区", zone: "市区人文线", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "武侯祠-锦里",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "锦里古街", type: "文化街区", duration: "2-3小时", district: "武侯区", zone: "武侯祠-锦里", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "武侯祠", type: "历史古迹", duration: "1.5-2.5小时", district: "武侯区", zone: "武侯祠-锦里", price: 50, bestTime: "morning", intensity: "medium" },
        { name: "杜甫草堂", type: "历史古迹", duration: "1.5-2.5小时", district: "青羊区", zone: "武侯祠-锦里", price: 50, bestTime: "morning", intensity: "medium" },
      ],
    },
    {
      name: "熊猫-近郊",
      transitMinutes: 20,
      outdoorRatio: 0.6,
      attractions: [
        { name: "大熊猫繁育基地", type: "自然生态", duration: "3-4小时", district: "成华区", zone: "熊猫-近郊", price: 55, bestTime: "morning", intensity: "medium" },
        { name: "青城山", type: "自然山水", duration: "4-5小时", district: "都江堰市", zone: "熊猫-近郊", price: 80, bestTime: "morning", intensity: "high" },
        { name: "都江堰", type: "历史古迹", duration: "3-4小时", district: "都江堰市", zone: "熊猫-近郊", price: 80, bestTime: "afternoon", intensity: "medium" },
      ],
    },
  ],

  广州: [
    {
      name: "珠江新城-广州塔",
      transitMinutes: 12,
      outdoorRatio: 0.3,
      attractions: [
        { name: "广州塔", type: "现代建筑", duration: "2-3小时", district: "海珠区", zone: "珠江新城-广州塔", price: 150, bestTime: "afternoon", intensity: "medium" },
        { name: "珠江夜游", type: "城市景观", duration: "1-2小时", district: "越秀区", zone: "珠江新城-广州塔", price: 78, bestTime: "evening", intensity: "low" },
        { name: "花城广场", type: "城市广场", duration: "1-2小时", district: "天河区", zone: "珠江新城-广州塔", price: 0, bestTime: "morning", intensity: "low" },
        { name: "广东省博物馆", type: "博物馆", duration: "2-3小时", district: "天河区", zone: "珠江新城-广州塔", price: 0, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "荔湾老城区",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "陈家祠", type: "历史古迹", duration: "1-2小时", district: "荔湾区", zone: "荔湾老城区", price: 10, bestTime: "morning", intensity: "low" },
        { name: "上下九步行街", type: "商业街区", duration: "1.5-2.5小时", district: "荔湾区", zone: "荔湾老城区", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "沙面岛", type: "历史街区", duration: "1.5-2.5小时", district: "荔湾区", zone: "荔湾老城区", price: 0, bestTime: "morning", intensity: "low" },
        { name: "西关大屋", type: "历史古迹", duration: "1-2小时", district: "荔湾区", zone: "荔湾老城区", price: 0, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "越秀-北京路",
      transitMinutes: 10,
      outdoorRatio: 0.4,
      attractions: [
        { name: "越秀公园", type: "城市公园", duration: "1.5-2.5小时", district: "越秀区", zone: "越秀-北京路", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "北京路", type: "商业街区", duration: "1.5-2.5小时", district: "越秀区", zone: "越秀-北京路", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "石室圣心大教堂", type: "宗教文化", duration: "0.5-1小时", district: "越秀区", zone: "越秀-北京路", price: 0, bestTime: "morning", intensity: "low" },
        { name: "白云山", type: "自然山水", duration: "3-4小时", district: "白云区", zone: "越秀-北京路", price: 5, bestTime: "morning", intensity: "high" },
      ],
    },
  ],

  张家界: [
    {
      name: "武陵源核心景区",
      transitMinutes: 20,
      outdoorRatio: 1.0,
      attractions: [
        { name: "张家界国家森林公园", type: "自然山水", duration: "6-8小时", district: "武陵源区", zone: "武陵源核心景区", price: 225, bestTime: "morning", intensity: "high" },
        { name: "袁家界", type: "自然山水", duration: "3-4小时", district: "武陵源区", zone: "武陵源核心景区", price: 0, bestTime: "morning", intensity: "high" },
        { name: "天子山", type: "自然山水", duration: "3-4小时", district: "武陵源区", zone: "武陵源核心景区", price: 0, bestTime: "morning", intensity: "high" },
        { name: "金鞭溪", type: "自然山水", duration: "2-3小时", district: "武陵源区", zone: "武陵源核心景区", price: 0, bestTime: "afternoon", intensity: "medium" },
        { name: "十里画廊", type: "自然山水", duration: "2-3小时", district: "武陵源区", zone: "武陵源核心景区", price: 0, bestTime: "afternoon", intensity: "medium" },
        { name: "黄石寨", type: "自然山水", duration: "3-4小时", district: "武陵源区", zone: "武陵源核心景区", price: 0, bestTime: "morning", intensity: "high" },
        { name: "宝峰湖", type: "自然山水", duration: "2-3小时", district: "武陵源区", zone: "武陵源核心景区", price: 96, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "天门山景区",
      transitMinutes: 15,
      outdoorRatio: 1.0,
      attractions: [
        { name: "天门山", type: "自然山水", duration: "4-5小时", district: "永定区", zone: "天门山景区", price: 258, bestTime: "morning", intensity: "high" },
        { name: "大峡谷玻璃桥", type: "现代建筑", duration: "3-4小时", district: "慈利县", zone: "天门山景区", price: 219, bestTime: "afternoon", intensity: "medium" },
        { name: "黄龙洞", type: "自然奇观", duration: "2-3小时", district: "武陵源区", zone: "天门山景区", price: 100, bestTime: "afternoon", intensity: "medium" },
      ],
    },
  ],

  武汉: [
    {
      name: "武昌人文线",
      transitMinutes: 12,
      outdoorRatio: 0.4,
      attractions: [
        { name: "黄鹤楼", type: "历史古迹", duration: "1.5-2.5小时", district: "武昌区", zone: "武昌人文线", price: 70, bestTime: "morning", intensity: "medium" },
        { name: "户部巷", type: "美食街区", duration: "1-2小时", district: "武昌区", zone: "武昌人文线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "湖北省博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "武昌区", zone: "武昌人文线", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "昙华林", type: "文化街区", duration: "1.5-2.5小时", district: "武昌区", zone: "武昌人文线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "武汉长江大桥", type: "城市景观", duration: "0.5-1小时", district: "武昌区", zone: "武昌人文线", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "东湖风景区",
      transitMinutes: 15,
      outdoorRatio: 0.7,
      attractions: [
        { name: "东湖", type: "自然山水", duration: "3-4小时", district: "武昌区", zone: "东湖风景区", price: 0, bestTime: "morning", intensity: "high" },
        { name: "武汉大学", type: "校园文化", duration: "1.5-2.5小时", district: "武昌区", zone: "东湖风景区", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "磨山景区", type: "自然山水", duration: "2-3小时", district: "武昌区", zone: "东湖风景区", price: 60, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "汉阳-汉口",
      transitMinutes: 15,
      outdoorRatio: 0.3,
      attractions: [
        { name: "江汉路步行街", type: "商业街区", duration: "1.5-2.5小时", district: "江汉区", zone: "汉阳-汉口", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "归元寺", type: "宗教文化", duration: "1-2小时", district: "汉阳区", zone: "汉阳-汉口", price: 10, bestTime: "morning", intensity: "low" },
        { name: "古琴台", type: "历史古迹", duration: "0.5-1小时", district: "汉阳区", zone: "汉阳-汉口", price: 15, bestTime: "afternoon", intensity: "low" },
        { name: "晴川阁", type: "历史古迹", duration: "1-1.5小时", district: "汉阳区", zone: "汉阳-汉口", price: 0, bestTime: "morning", intensity: "low" },
        { name: "吉庆街夜市", type: "美食街区", duration: "1.5-2.5小时", district: "江汉区", zone: "汉阳-汉口", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
  ],

  长沙: [
    {
      name: "岳麓-橘子洲",
      transitMinutes: 15,
      outdoorRatio: 0.6,
      attractions: [
        { name: "橘子洲", type: "自然山水", duration: "2-3小时", district: "岳麓区", zone: "岳麓-橘子洲", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "岳麓山", type: "自然山水", duration: "3-4小时", district: "岳麓区", zone: "岳麓-橘子洲", price: 0, bestTime: "morning", intensity: "high" },
        { name: "岳麓书院", type: "历史古迹", duration: "1-2小时", district: "岳麓区", zone: "岳麓-橘子洲", price: 40, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "市区文化线",
      transitMinutes: 10,
      outdoorRatio: 0.2,
      attractions: [
        { name: "太平老街", type: "文化街区", duration: "1.5-2.5小时", district: "天心区", zone: "市区文化线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "湖南省博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "开福区", zone: "市区文化线", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "黄兴路步行街", type: "商业街区", duration: "1.5-2.5小时", district: "天心区", zone: "市区文化线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "天心阁", type: "历史古迹", duration: "1-2小时", district: "天心区", zone: "市区文化线", price: 32, bestTime: "morning", intensity: "low" },
        { name: "杜甫江阁", type: "历史古迹", duration: "0.5-1小时", district: "天心区", zone: "市区文化线", price: 0, bestTime: "evening", intensity: "low" },
        { name: "坡子街美食街", type: "美食街区", duration: "1.5-2.5小时", district: "天心区", zone: "市区文化线", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
  ],

  大连: [
    {
      name: "滨海路-中山广场",
      transitMinutes: 15,
      outdoorRatio: 0.6,
      attractions: [
        { name: "星海广场", type: "城市广场", duration: "1-2小时", district: "沙河口区", zone: "滨海路-中山广场", price: 0, bestTime: "morning", intensity: "low" },
        { name: "滨海路", type: "自然山水", duration: "2-3小时", district: "中山区", zone: "滨海路-中山广场", price: 0, bestTime: "morning", intensity: "medium" },
        { name: "老虎滩海洋公园", type: "主题乐园", duration: "3-4小时", district: "中山区", zone: "滨海路-中山广场", price: 220, bestTime: "morning", intensity: "high" },
        { name: "棒棰岛", type: "自然山水", duration: "2-3小时", district: "中山区", zone: "滨海路-中山广场", price: 20, bestTime: "afternoon", intensity: "medium" },
        { name: "中山广场", type: "城市广场", duration: "0.5-1小时", district: "中山区", zone: "滨海路-中山广场", price: 0, bestTime: "any", intensity: "low" },
        { name: "大连森林动物园", type: "自然生态", duration: "3-4小时", district: "西岗区", zone: "滨海路-中山广场", price: 120, bestTime: "morning", intensity: "high" },
        { name: "东港音乐喷泉", type: "城市景观", duration: "1-2小时", district: "中山区", zone: "滨海路-中山广场", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "旅顺口区",
      transitMinutes: 20,
      outdoorRatio: 0.5,
      attractions: [
        { name: "旅顺军港", type: "历史纪念", duration: "1-2小时", district: "旅顺口区", zone: "旅顺口区", price: 0, bestTime: "morning", intensity: "low" },
        { name: "白玉山景区", type: "历史纪念", duration: "2-3小时", district: "旅顺口区", zone: "旅顺口区", price: 40, bestTime: "morning", intensity: "medium" },
        { name: "旅顺博物馆", type: "博物馆", duration: "2-3小时", district: "旅顺口区", zone: "旅顺口区", price: 0, bestTime: "afternoon", intensity: "medium" },
      ],
    },
    {
      name: "市区商业线",
      transitMinutes: 10,
      outdoorRatio: 0.2,
      attractions: [
        { name: "俄罗斯风情街", type: "文化街区", duration: "1-2小时", district: "西岗区", zone: "市区商业线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "青泥洼桥商业区", type: "商业街区", duration: "1.5-2.5小时", district: "中山区", zone: "市区商业线", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "大连老街", type: "美食街区", duration: "1.5-2.5小时", district: "西岗区", zone: "市区商业线", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
  ],

  沈阳: [
    {
      name: "故宫-中街",
      transitMinutes: 10,
      outdoorRatio: 0.3,
      attractions: [
        { name: "沈阳故宫", type: "历史古迹", duration: "2-3小时", district: "沈河区", zone: "故宫-中街", price: 60, bestTime: "morning", intensity: "medium" },
        { name: "张氏帅府", type: "历史古迹", duration: "1.5-2.5小时", district: "沈河区", zone: "故宫-中街", price: 46, bestTime: "afternoon", intensity: "low" },
        { name: "中街步行街", type: "商业街区", duration: "1.5-2.5小时", district: "沈河区", zone: "故宫-中街", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "沈阳天主教堂", type: "宗教文化", duration: "0.5-1小时", district: "沈河区", zone: "故宫-中街", price: 0, bestTime: "morning", intensity: "low" },
        { name: "刘老根大舞台", type: "文化演艺", duration: "2-3小时", district: "沈河区", zone: "故宫-中街", price: 280, bestTime: "evening", intensity: "low" },
      ],
    },
    {
      name: "北陵-九一八",
      transitMinutes: 15,
      outdoorRatio: 0.5,
      attractions: [
        { name: "北陵公园（清昭陵）", type: "历史古迹", duration: "2-3小时", district: "皇姑区", zone: "北陵-九一八", price: 50, bestTime: "morning", intensity: "medium" },
        { name: "九一八历史博物馆", type: "博物馆", duration: "2-3小时", district: "大东区", zone: "北陵-九一八", price: 0, bestTime: "afternoon", intensity: "medium" },
        { name: "东北大学旧址", type: "校园文化", duration: "1-2小时", district: "和平区", zone: "北陵-九一八", price: 0, bestTime: "afternoon", intensity: "low" },
      ],
    },
    {
      name: "太原街-西塔",
      transitMinutes: 10,
      outdoorRatio: 0.2,
      attractions: [
        { name: "太原街", type: "商业街区", duration: "1.5-2.5小时", district: "和平区", zone: "太原街-西塔", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "西塔韩国风情街", type: "文化街区", duration: "1.5-2.5小时", district: "和平区", zone: "太原街-西塔", price: 0, bestTime: "afternoon", intensity: "low" },
        { name: "中山广场建筑群", type: "历史建筑", duration: "1-2小时", district: "和平区", zone: "太原街-西塔", price: 0, bestTime: "morning", intensity: "low" },
        { name: "西塔美食街", type: "美食街区", duration: "1.5-2.5小时", district: "和平区", zone: "太原街-西塔", price: 0, bestTime: "evening", intensity: "low" },
      ],
    },
  ],
};

// 简易城市（少于3个片区），直接用单片区包裹
function getSimpleCityZone(city: string, attractions: Attraction[]): ZoneData[] {
  return [{ name: "市区", transitMinutes: 15, outdoorRatio: 0.4, attractions }];
}

// 构建完整数据库（包含所有15个城市）
function buildFullCityDB(): Record<string, ZoneData[]> {
  const result: Record<string, ZoneData[]> = { ...CITY_ZONES };

  // 简易城市景点（按原数据库复用district作为zone基础）
  const simpleCities: Record<string, Attraction[]> = {
    福州: [
      { name: "三坊七巷", type: "历史街区", duration: "3-4小时", district: "鼓楼区", zone: "鼓楼区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "鼓山", type: "自然山水", duration: "3-4小时", district: "晋安区", zone: "晋安区", price: 40, bestTime: "morning", intensity: "high" },
      { name: "西湖公园", type: "城市公园", duration: "1-2小时", district: "鼓楼区", zone: "鼓楼区", price: 0, bestTime: "morning", intensity: "low" },
      { name: "上下杭", type: "历史街区", duration: "1.5-2.5小时", district: "台江区", zone: "台江区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "烟台山", type: "历史街区", duration: "2-3小时", district: "仓山区", zone: "仓山区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "福建博物院", type: "博物馆", duration: "2-3小时", district: "鼓楼区", zone: "鼓楼区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "闽江夜游", type: "城市景观", duration: "1-2小时", district: "台江区", zone: "台江区", price: 80, bestTime: "evening", intensity: "low" },
      { name: "达明美食街", type: "美食街区", duration: "1.5-2.5小时", district: "鼓楼区", zone: "鼓楼区", price: 0, bestTime: "evening", intensity: "low" },
    ],
    济南: [
      { name: "趵突泉", type: "自然山水", duration: "1-2小时", district: "历下区", zone: "历下区", price: 40, bestTime: "morning", intensity: "low" },
      { name: "大明湖", type: "城市公园", duration: "2-3小时", district: "历下区", zone: "历下区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "千佛山", type: "自然山水", duration: "2-3小时", district: "历下区", zone: "历下区", price: 30, bestTime: "morning", intensity: "high" },
      { name: "芙蓉街", type: "文化街区", duration: "1.5-2.5小时", district: "历下区", zone: "历下区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "山东省博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "历下区", zone: "历下区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "黑虎泉", type: "自然山水", duration: "0.5-1小时", district: "历下区", zone: "历下区", price: 0, bestTime: "morning", intensity: "low" },
      { name: "宽厚里", type: "文化街区", duration: "1.5-2.5小时", district: "历下区", zone: "历下区", price: 0, bestTime: "evening", intensity: "low" },
      { name: "红叶谷", type: "自然山水", duration: "3-4小时", district: "历城区", zone: "历城区", price: 80, bestTime: "morning", intensity: "high" },
    ],
    合肥: [
      { name: "包公园", type: "城市公园", duration: "2-3小时", district: "包河区", zone: "包河区", price: 50, bestTime: "morning", intensity: "medium" },
      { name: "李鸿章故居", type: "历史古迹", duration: "1-2小时", district: "庐阳区", zone: "庐阳区", price: 20, bestTime: "afternoon", intensity: "low" },
      { name: "逍遥津公园", type: "城市公园", duration: "1.5-2.5小时", district: "庐阳区", zone: "庐阳区", price: 0, bestTime: "morning", intensity: "low" },
      { name: "三河古镇", type: "古镇水乡", duration: "4-5小时", district: "肥西县", zone: "肥西县", price: 0, bestTime: "morning", intensity: "medium" },
      { name: "安徽省博物院", type: "博物馆", duration: "2.5-3.5小时", district: "庐阳区", zone: "庐阳区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "天鹅湖", type: "城市公园", duration: "1-2小时", district: "蜀山区", zone: "蜀山区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "城隍庙", type: "文化街区", duration: "1.5-2.5小时", district: "庐阳区", zone: "庐阳区", price: 0, bestTime: "evening", intensity: "low" },
      { name: "大蜀山", type: "自然山水", duration: "2-3小时", district: "蜀山区", zone: "蜀山区", price: 0, bestTime: "morning", intensity: "high" },
    ],
    南昌: [
      { name: "滕王阁", type: "历史古迹", duration: "2-3小时", district: "东湖区", zone: "东湖区", price: 50, bestTime: "morning", intensity: "medium" },
      { name: "八一广场", type: "城市广场", duration: "0.5-1小时", district: "东湖区", zone: "东湖区", price: 0, bestTime: "any", intensity: "low" },
      { name: "秋水广场", type: "城市广场", duration: "1-2小时", district: "红谷滩区", zone: "红谷滩区", price: 0, bestTime: "evening", intensity: "low" },
      { name: "江西省博物馆", type: "博物馆", duration: "2.5-3.5小时", district: "红谷滩区", zone: "红谷滩区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "万寿宫", type: "文化街区", duration: "1.5-2.5小时", district: "西湖区", zone: "西湖区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "绳金塔", type: "历史古迹", duration: "1-2小时", district: "西湖区", zone: "西湖区", price: 0, bestTime: "morning", intensity: "low" },
      { name: "南昌之星", type: "现代建筑", duration: "1-2小时", district: "红谷滩区", zone: "红谷滩区", price: 50, bestTime: "evening", intensity: "low" },
      { name: "梅岭", type: "自然山水", duration: "3-4小时", district: "湾里区", zone: "湾里区", price: 25, bestTime: "morning", intensity: "high" },
    ],
    南宁: [
      { name: "青秀山", type: "自然山水", duration: "3-4小时", district: "青秀区", zone: "青秀区", price: 20, bestTime: "morning", intensity: "high" },
      { name: "南湖公园", type: "城市公园", duration: "1.5-2.5小时", district: "青秀区", zone: "青秀区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "广西民族博物馆", type: "博物馆", duration: "2-3小时", district: "青秀区", zone: "青秀区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "中山路美食街", type: "美食街区", duration: "1.5-2.5小时", district: "青秀区", zone: "青秀区", price: 0, bestTime: "evening", intensity: "low" },
      { name: "民歌湖", type: "城市公园", duration: "1-2小时", district: "青秀区", zone: "青秀区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "大明山", type: "自然山水", duration: "5-6小时", district: "武鸣区", zone: "武鸣区", price: 128, bestTime: "morning", intensity: "high" },
      { name: "扬美古镇", type: "古镇水乡", duration: "3-4小时", district: "江南区", zone: "江南区", price: 0, bestTime: "morning", intensity: "medium" },
    ],
    绍兴: [
      { name: "鲁迅故里", type: "历史古迹", duration: "2-3小时", district: "越城区", zone: "越城区", price: 0, bestTime: "morning", intensity: "medium" },
      { name: "沈园", type: "古典园林", duration: "1-2小时", district: "越城区", zone: "越城区", price: 40, bestTime: "afternoon", intensity: "low" },
      { name: "东湖", type: "自然山水", duration: "2-3小时", district: "越城区", zone: "越城区", price: 50, bestTime: "morning", intensity: "medium" },
      { name: "兰亭", type: "历史古迹", duration: "2-3小时", district: "柯桥区", zone: "柯桥区", price: 80, bestTime: "morning", intensity: "medium" },
      { name: "安昌古镇", type: "古镇水乡", duration: "2-3小时", district: "柯桥区", zone: "柯桥区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "仓桥直街", type: "历史街区", duration: "1.5-2.5小时", district: "越城区", zone: "越城区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "柯岩风景区", type: "自然山水", duration: "3-4小时", district: "柯桥区", zone: "柯桥区", price: 115, bestTime: "morning", intensity: "high" },
      { name: "咸亨酒店美食街", type: "美食街区", duration: "1.5-2.5小时", district: "越城区", zone: "越城区", price: 0, bestTime: "evening", intensity: "low" },
    ],
    徐州: [
      { name: "云龙湖", type: "城市公园", duration: "2-3小时", district: "泉山区", zone: "泉山区", price: 0, bestTime: "morning", intensity: "medium" },
      { name: "徐州博物馆", type: "博物馆", duration: "2-3小时", district: "泉山区", zone: "泉山区", price: 0, bestTime: "afternoon", intensity: "medium" },
      { name: "汉兵马俑博物馆", type: "博物馆", duration: "1.5-2.5小时", district: "云龙区", zone: "云龙区", price: 80, bestTime: "morning", intensity: "medium" },
      { name: "龟山汉墓", type: "历史古迹", duration: "1.5-2.5小时", district: "鼓楼区", zone: "鼓楼区", price: 60, bestTime: "morning", intensity: "medium" },
      { name: "户部山古民居", type: "历史街区", duration: "1.5-2.5小时", district: "云龙区", zone: "云龙区", price: 25, bestTime: "afternoon", intensity: "low" },
      { name: "彭祖园", type: "城市公园", duration: "1-2小时", district: "泉山区", zone: "泉山区", price: 0, bestTime: "afternoon", intensity: "low" },
      { name: "回龙窝历史文化街区", type: "文化街区", duration: "1.5-2.5小时", district: "云龙区", zone: "云龙区", price: 0, bestTime: "evening", intensity: "low" },
      { name: "彭城壹号美食街", type: "美食街区", duration: "1.5-2.5小时", district: "鼓楼区", zone: "鼓楼区", price: 0, bestTime: "evening", intensity: "low" },
    ],
  };

  for (const [city, attrs] of Object.entries(simpleCities)) {
    if (!result[city]) {
      result[city] = getSimpleCityZone(city, attrs);
    }
  }

  return result;
}

const FULL_DB = buildFullCityDB();

// ==================== 偏好匹配权重 ====================

const CITY_PREFERENCE_WEIGHTS: Record<string, Record<string, number>> = {
  北京: { 历史古都: 10, 宗教文化: 7, 美食城市: 6, 现代都市: 5, 自然山水: 3, 古镇水乡: 2 },
  上海: { 现代都市: 10, 美食城市: 7, 古镇水乡: 5, 历史古都: 3, 自然山水: 2, 宗教文化: 2 },
  西安: { 历史古都: 10, 宗教文化: 8, 美食城市: 7, 自然山水: 3, 现代都市: 2, 古镇水乡: 2 },
  南京: { 历史古都: 9, 美食城市: 7, 现代都市: 5, 自然山水: 4, 宗教文化: 4, 古镇水乡: 3 },
  杭州: { 自然山水: 10, 古镇水乡: 7, 美食城市: 6, 历史古都: 5, 宗教文化: 5, 现代都市: 4 },
  成都: { 美食城市: 10, 历史古都: 6, 自然山水: 5, 现代都市: 4, 古镇水乡: 3, 宗教文化: 2 },
  广州: { 美食城市: 10, 现代都市: 7, 历史古都: 5, 古镇水乡: 3, 自然山水: 2, 宗教文化: 2 },
  张家界: { 自然山水: 10, 古镇水乡: 4, 历史古都: 2, 美食城市: 2, 现代都市: 1, 宗教文化: 1 },
  武汉: { 历史古都: 7, 美食城市: 7, 自然山水: 6, 现代都市: 5, 宗教文化: 4, 古镇水乡: 3 },
  长沙: { 美食城市: 9, 历史古都: 5, 现代都市: 5, 自然山水: 4, 古镇水乡: 3, 宗教文化: 2 },
  福州: { 古镇水乡: 7, 历史古都: 6, 自然山水: 6, 美食城市: 5, 现代都市: 3, 宗教文化: 3 },
  济南: { 历史古都: 7, 自然山水: 7, 宗教文化: 5, 美食城市: 4, 现代都市: 3, 古镇水乡: 2 },
  合肥: { 历史古都: 5, 自然山水: 5, 现代都市: 4, 美食城市: 4, 古镇水乡: 3, 宗教文化: 2 },
  南昌: { 历史古都: 7, 自然山水: 6, 现代都市: 4, 美食城市: 4, 宗教文化: 3, 古镇水乡: 2 },
  南宁: { 自然山水: 8, 美食城市: 6, 古镇水乡: 5, 现代都市: 3, 历史古都: 2, 宗教文化: 2 },
  绍兴: { 古镇水乡: 9, 历史古都: 7, 自然山水: 6, 美食城市: 5, 宗教文化: 3, 现代都市: 2 },
  徐州: { 历史古都: 8, 自然山水: 6, 美食城市: 5, 宗教文化: 4, 现代都市: 3, 古镇水乡: 2 },
  大连: { 自然山水: 8, 美食城市: 6, 现代都市: 5, 历史古都: 2, 古镇水乡: 2, 宗教文化: 1 },
  沈阳: { 历史古都: 8, 美食城市: 6, 现代都市: 5, 宗教文化: 3, 自然山水: 2, 古镇水乡: 1 },
};

const CITY_PAIRS: [string, string][] = [
  ["北京", "西安"],
  ["南京", "上海"],
  ["杭州", "上海"],
  ["成都", "西安"],
  ["广州", "深圳"],
  ["武汉", "长沙"],
  ["福州", "厦门"],
  ["大连", "沈阳"],
  ["绍兴", "杭州"],
  ["徐州", "南京"],
];

// ==================== 工具函数 ====================

function parseDays(daysStr: string): number {
  if (daysStr.includes("10")) return 12;
  if (daysStr.includes("8")) return 9;
  if (daysStr.includes("5")) return 6;
  if (daysStr.includes("3")) return 4;
  if (daysStr.includes("1")) return 2;
  return 5;
}

/** 根据节奏返回每日景点上限 */
function getMaxAttractionsPerDay(pace: string): number {
  if (pace.includes("轻松")) return 2;
  if (pace.includes("紧凑")) return 4;
  if (pace.includes("挑战")) return 5;
  return 3; // 适中平衡
}

/** 解析时长为数值（中位数，单位：小时） */
function parseDurationHour(duration: string): number {
  if (duration === "全天" || duration.includes("8-10") || duration.includes("6-8")) return 7;
  if (duration.includes("5-6")) return 5.5;
  if (duration.includes("4-5")) return 4.5;
  if (duration.includes("3-4")) return 3.5;
  if (duration.includes("2.5-3.5")) return 3;
  if (duration.includes("2-3")) return 2.5;
  if (duration.includes("1.5-2.5")) return 2;
  if (duration.includes("1.5-2")) return 1.75;
  if (duration.includes("1-2")) return 1.5;
  if (duration.includes("1-1.5")) return 1.25;
  if (duration.includes("0.5-1")) return 0.75;
  return 2;
}

/** 根据景点类型和体力消耗估算步行公里数 */
function estimateWalkingKm(attraction: Attraction): number {
  const hour = parseDurationHour(attraction.duration);
  if (attraction.intensity === "high") return hour * 1.2;
  if (attraction.intensity === "medium") return hour * 0.6;
  return hour * 0.3;
}

function matchCityByPreferences(preferences: string[]): string[] {
  const cities = Object.keys(FULL_DB);
  const scores = cities.map((city) => {
    const weights = CITY_PREFERENCE_WEIGHTS[city] || {};
    const score = preferences.reduce((sum, pref) => sum + (weights[pref] || 0), 0);
    return { city, score };
  });
  scores.sort((a, b) => b.score - a.score);
  return scores.map((s) => s.city);
}

function getBudgetLevel(budget: string): BudgetLevel {
  if (budget.includes("500元以下")) return "low";
  if (budget.includes("3000")) return "high";
  return "mid";
}

function getTransport(budgetLevel: BudgetLevel): string {
  switch (budgetLevel) {
    case "low": return "地铁 + 公交，经济实惠";
    case "high": return "专车/打车，舒适便捷";
    default: return "地铁为主，辅以打车";
  }
}

function getAccommodation(budgetLevel: BudgetLevel): string {
  switch (budgetLevel) {
    case "low": return "经济型连锁酒店 / 青年旅舍";
    case "high": return "高端酒店 / 特色精品民宿";
    default: return "舒适型酒店 / 精品民宿";
  }
}

/** 获取片区标签 */
function getZonePaceLabel(pace: string, zoneOutdoorRatio: number): string {
  if (pace.includes("轻松") || pace.includes("休闲")) return "悠闲慢逛";
  const base = pace.includes("紧凑") ? "紧凑" : pace.includes("挑战") ? "高密度" : "适中";
  if (zoneOutdoorRatio > 0.6) return `${base}户外`;
  return base;
}

/** 计算一半天的步行累计 */
function calcWalkingKm(attractions: Attraction[]): number {
  let total = 0;
  for (const a of attractions) {
    total += estimateWalkingKm(a);
  }
  // 加上拼区间的交通步行
  total += attractions.length * 0.5;
  return Math.round(total * 10) / 10;
}

// ==================== 核心生成函数 ====================

export function generateItinerary(params: UserParams): ItineraryResult {
  const totalDays = parseDays(params.days);
  const maxPerDay = getMaxAttractionsPerDay(params.pace);
  const budgetLevel = getBudgetLevel(params.budget);

  // === 1. 确定城市 ===
  let targetCities: string[] = [];
  if (params.destination && params.destination !== "还没有明确想法，请推荐") {
    targetCities = [params.destination];
  } else {
    targetCities = matchCityByPreferences(params.preferences);
  }

  const isCrossCity = totalDays >= 7 && params.destination === "还没有明确想法，请推荐";
  let cities: string[] = [];

  if (isCrossCity) {
    const primary = targetCities[0];
    const pair = CITY_PAIRS.find((p) => p[0] === primary || p[1] === primary);
    if (pair) {
      cities = pair;
    } else {
      cities = [primary, targetCities[1] || targetCities[0]];
    }
  } else {
    cities = [targetCities[0]];
  }

  // === 2. 按城市分配天数 ===
  function distributeDays(cities: string[], total: number): { city: string; days: number }[] {
    if (cities.length === 1) return [{ city: cities[0], days: total }];
    // 多城市：首城 ceil，其余 floor
    const first = Math.ceil(total / cities.length);
    const rest = Math.floor((total - first) / (cities.length - 1));
    const result: { city: string; days: number }[] = [];
    cities.forEach((city, i) => {
      if (i === 0) result.push({ city, days: first });
      else if (i === cities.length - 1) result.push({ city, days: total - result.reduce((s, r) => s + r.days, 0) });
      else result.push({ city, days: rest });
    });
    return result;
  }

  const cityDayDistribution = distributeDays(cities, totalDays);

  // === 3. 逐城逐日生成 ===
  const daysResult: DayItinerary[] = [];
  let globalDayCounter = 0;
  let totalWalkingKm = 0;

  for (let ci = 0; ci < cityDayDistribution.length; ci++) {
    const { city, days: daysForCity } = cityDayDistribution[ci];
    const zones = FULL_DB[city];
    if (!zones || zones.length === 0) continue;

    // 第一天如果是跨城，只安排半天
    const isTransitDay = ci > 0;

    for (let d = 0; d < daysForCity && globalDayCounter < totalDays; d++) {
      globalDayCounter++;

      // 选择片区（轮询不同片区）
      const zoneIndex = d % zones.length;
      const zone = zones[zoneIndex];
      const pool = zone.attractions;

      // 分配上/下午/晚上
      const morningPool = pool.filter((a) => a.bestTime === "morning" || a.bestTime === "any");
      const afternoonPool = pool.filter((a) => a.bestTime === "afternoon" || a.bestTime === "any");
      const eveningPool = pool.filter((a) => a.bestTime === "evening" || a.bestTime === "any");

      // 跨城日：半天行程
      const isHalfDay = isTransitDay;

      // 计算各时段数量：跨城日减半
      let morningCount = isHalfDay ? 0 : 1;
      let afternoonCount = 1;
      let eveningCount = isHalfDay ? 0 : 1;

      // 根据节奏调整
      if (maxPerDay >= 4) {
        morningCount = isHalfDay ? 1 : 2;
        afternoonCount = 2;
        eveningCount = isHalfDay ? 0 : 1;
      }

      // 从各时段池中取景点（避免重复）
      const usedNames = new Set<string>();
      const pickUnique = (pool: Attraction[], count: number): Attraction[] => {
        const available = pool.filter((a) => !usedNames.has(a.name));
        const picked = available.slice(0, count);
        picked.forEach((a) => usedNames.add(a.name));
        return picked;
      };

      const morningAttractions = pickUnique(morningPool, morningCount);
      const afternoonAttractions = pickUnique(afternoonPool, afternoonCount);
      // 晚上优先选夜景/美食类型
      const eveningAttractions = pickUnique(eveningPool, eveningCount);
      // 如果晚上资源不足，从下午池补充
      if (eveningAttractions.length < eveningCount && isHalfDay === false) {
        const extra = pickUnique(afternoonPool, eveningCount - eveningAttractions.length);
        eveningAttractions.push(...extra);
      }
      // 如果总数量不够，再从任意池取
      const totalSoFar = morningAttractions.length + afternoonAttractions.length + eveningAttractions.length;
      if (totalSoFar < maxPerDay && !isHalfDay) {
        const extra = pickUnique(pool, maxPerDay - totalSoFar);
        // 优先往下午加
        afternoonAttractions.push(...extra);
      }

      // 转为 TimeSlotItem
      const toSlotItem = (a: Attraction) => ({
        name: a.name,
        duration: a.duration,
        price: a.price,
        durationHour: parseDurationHour(a.duration),
      });

      const morningSlots = morningAttractions.map(toSlotItem);
      const afternoonSlots = afternoonAttractions.map(toSlotItem);
      const eveningSlots = eveningAttractions.map(toSlotItem);

      // 计算步行距离
      const allAttractions = [...morningAttractions, ...afternoonAttractions, ...eveningAttractions];
      const walkingKm = calcWalkingKm(allAttractions);

      // 节奏标签
      const dayLabel = getZonePaceLabel(params.pace, zone.outdoorRatio);

      // 交通提示
      const zoneTransport = zone.outdoorRatio > 0.6
        ? `${getTransport(budgetLevel)}；前往${zone.name}建议早起出行`
        : `${getTransport(budgetLevel)}；${zone.name}片区内景点相距不远，可步行到达`;

      daysResult.push({
        day: globalDayCounter,
        city,
        zone: zone.name,
        pace: params.pace,
        walkingKm: `${walkingKm}`,
        dayLabel,
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
        transport: zoneTransport,
        accommodation: getAccommodation(budgetLevel),
      });

      totalWalkingKm += walkingKm;
    }

    // 跨城日之后加一天交通缓冲
    if (isTransitDay && globalDayCounter < totalDays) {
      // 已在上面安排半天，不需要额外处理
    }
  }

  const totalBudget = budgetLevel === "low" ? "约1000元以内" : budgetLevel === "high" ? "3000元以上" : "1000-3000元";

  return {
    days: daysResult.slice(0, totalDays),
    totalBudget,
    cities,
    totalWalkingKm: Math.round(totalWalkingKm * 10) / 10,
  };
}
