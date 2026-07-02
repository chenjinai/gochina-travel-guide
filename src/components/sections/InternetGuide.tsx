import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";

type AvailableRow = { cat: string; svc: string; note: string };
type AltRow = { foreign: string; china: string; feat: string };
type CarrierRow = { name: string; pros: string; cons: string; who: string };
type PlanRow = { plan: string; price: string; incl: string; rec: string };
type RoamRow = { carrier: string; plan: string; price: string; speed: string };
type EsimRow = { name: string; price: string; data: string; adv: string };
type ContactRow = { method: string; how: string; cost: string; rel: string };

type Content = {
  title: string;
  subtitle: string;
  intro: string;
  available: { title: string; rows: AvailableRow[]; headers: [string, string, string] };
  restricted: { title: string; desc: string; items: string[] };
  alts: { title: string; intro: string; rows: AltRow[]; headers: [string, string, string] };
  sim: {
    title: string;
    intro: string;
    carriers: CarrierRow[];
    carriersHeaders: [string, string, string, string];
    whereTitle: string;
    where: string[];
    plansTitle: string;
    plans: PlanRow[];
    plansHeaders: [string, string, string, string];
    tip: string;
  };
  roam: { title: string; rows: RoamRow[]; headers: [string, string, string, string]; warn: string };
  esim: {
    title: string;
    intro: string;
    rows: EsimRow[];
    headers: [string, string, string, string];
    warn: string;
  };
  pocket: { title: string; items: string[]; pros: string[] };
  vpn: { title: string; legal: string; whyTitle: string; reasons: string[]; betterTitle: string; better: string; legitTitle: string; legit: string[] };
  arrival: { title: string; items: string[] };
  wifi: {
    title: string;
    placesTitle: string;
    places: string[];
    stepsTitle: string;
    steps: string[];
  };
  contact: {
    title: string;
    rows: ContactRow[];
    headers: [string, string, string, string];
    best: string;
  };
};

const en: Content = {
  title: "Internet Access & VPN",
  subtitle: "Get online in China without headaches (2026)",
  intro:
    "Many foreign websites and apps (Google, WhatsApp, Instagram, etc.) are blocked in mainland China. This guide covers what works, what doesn't, how to get connected, and which local apps you'll want on your phone.",
  available: {
    title: "Foreign services that work in mainland China",
    headers: ["Category", "Available services", "Notes"],
    rows: [
      { cat: "Search engines", svc: "Bing, DuckDuckGo", note: "Google Search blocked" },
      { cat: "Social media", svc: "—", note: "Facebook / Twitter / Instagram all blocked" },
      { cat: "Messaging", svc: "iMessage, FaceTime", note: "WhatsApp / Telegram / Signal blocked" },
      { cat: "Video streaming", svc: "Netflix (unstable)", note: "YouTube blocked" },
      { cat: "Email", svc: "Gmail (via IMAP/SMTP client)", note: "Gmail web blocked" },
      { cat: "Cloud storage", svc: "OneDrive, Dropbox (sometimes throttled)", note: "Google Drive blocked" },
      { cat: "Maps", svc: "Apple Maps", note: "Google Maps needs alternative" },
      { cat: "News", svc: "BBC Chinese, CNN (intermittent)", note: "Some sites partially blocked" },
    ],
  },
  restricted: {
    title: "Services that require a VPN",
    desc: "The following are NOT accessible from mainland China without a VPN (note the legal risk below):",
    items: [
      "Google suite: Search, Gmail, Maps, Drive, YouTube, Play Store",
      "Meta suite: Facebook, Instagram, WhatsApp, Messenger",
      "Twitter / X and related apps",
      "Telegram, Discord, Slack",
      "Reddit, international TikTok",
      "Some Western news sites (NYT, WSJ, The Guardian, etc.)",
      "Wikipedia (large parts of zh-Wikipedia)",
      "Various blog platforms and personal sites",
    ],
  },
  alts: {
    title: "Chinese alternatives to use instead",
    intro:
      "Rather than fighting the Great Firewall, learn the local apps — they're often faster, better integrated and help you fit into local life.",
    headers: ["Foreign app", "Chinese alternative", "Features"],
    rows: [
      { foreign: "Google Maps", china: "高德地图 Gaode / 百度地图 Baidu", feat: "Metre-level navigation, walk/drive/transit/cycling" },
      { foreign: "Uber", china: "滴滴出行 DiDi", feat: "300+ cities, English UI available" },
      { foreign: "WhatsApp / Messenger", china: "微信 WeChat", feat: "1.3B users — chat + payment + mini programs" },
      { foreign: "Twitter / X", china: "微博 Weibo", feat: "Chinese equivalent of Twitter" },
      { foreign: "Instagram / TikTok", china: "抖音 Douyin / 小红书 RED", feat: "Short video + lifestyle sharing" },
      { foreign: "YouTube", china: "哔哩哔哩 Bilibili", feat: "Massive free video library" },
      { foreign: "Amazon / eBay", china: "淘宝 Taobao / 京东 JD", feat: "Competitive e-commerce pricing" },
      { foreign: "Airbnb", china: "美团 / 携程 民宿", feat: "Plenty of short-stay listings" },
      { foreign: "Yelp / TripAdvisor", china: "大众点评 Dianping", feat: "Restaurant reviews + attraction guides" },
      { foreign: "Google Translate", china: "百度翻译 / DeepL", feat: "Photo translation supported" },
      { foreign: "Spotify / Apple Music", china: "网易云音乐 / QQ音乐", feat: "Full music streaming catalogue" },
      { foreign: "Uber Eats", china: "饿了么 / 美团外卖", feat: "30-minute delivery" },
    ],
  },
  sim: {
    title: "Option 1 — Buy a local SIM card (recommended)",
    intro: "Best overall experience: real Chinese phone number + fast local data.",
    carriers: [
      { name: "China Mobile 中国移动", pros: "Best signal, esp. in remote areas", cons: "Slightly pricier", who: "Travellers heading west / rural" },
      { name: "China Unicom 中国联通", pros: "Best value plans, eSIM friendly", cons: "Weaker in some regions", who: "City travellers, value seekers" },
      { name: "China Telecom 中国电信", pros: "Great WiFi hotspots & broadband", cons: "Device compatibility varies", who: "Heavy data users" },
    ],
    carriersHeaders: ["Carrier", "Pros", "Cons", "Best for"],
    whereTitle: "Where to buy",
    where: [
      "Airport arrivals hall — easiest, staff often speak English and help with setup.",
      "Carrier shops — found in every city, bring your passport.",
      "Convenience stores like 7-Eleven — pre-loaded SIM kits.",
      "Taobao / JD — pre-order online, activate on arrival.",
      "Klook / Trip.com — online booking with airport pickup and multilingual support.",
    ],
    plansTitle: "Suggested plans (2026)",
    plans: [
      { plan: "Basic", price: "¥30–50/month", incl: "10–20GB domestic data + 50 min", rec: "★★☆ Light use" },
      { plan: "Standard", price: "¥59–89/month", incl: "40–80GB + 200 min", rec: "★★★ Most travellers" },
      { plan: "Unlimited", price: "¥99–149/month", incl: "100–150GB + unlimited calls", rec: "★★★★ Heavy use / digital nomads" },
      { plan: "Tourist SIM", price: "¥30–50/week", incl: "7–14 days, generous data", rec: "★★★★ Short trips" },
    ],
    plansHeaders: ["Plan", "Price", "Includes", "Recommendation"],
    tip: "Money-saving tip: for trips under 2 weeks, the 'Tourist SIM' is the best deal — large data buckets, auto-expires, no cancellation needed.",
  },
  roam: {
    title: "Option 2 — International roaming",
    headers: ["Home carrier", "Plan", "Approx price", "Speed"],
    rows: [
      { carrier: "T-Mobile (US)", plan: "Magenta Max — international roaming", price: "$0 extra", speed: "Throttled (256kbps–2G)" },
      { carrier: "Verizon (US)", plan: "TravelPass day pass", price: "$10/day", speed: "Full speed (depends on area)" },
      { carrier: "AT&T (US)", plan: "International Day Pass", price: "$10/day", speed: "Full speed" },
      { carrier: "Vodafone (UK)", plan: "Global Roaming Plus", price: "£6/day", speed: "Full speed (75 countries)" },
      { carrier: "O2 (UK)", plan: "International Bolt-On", price: "£6/day", speed: "Full speed" },
      { carrier: "EE (UK)", plan: "Travel Data Pass", price: "£8.88/day", speed: "Full speed" },
      { carrier: "Telstra (AU)", plan: "International Roaming", price: "AUD $10–15/day", speed: "Full speed" },
      { carrier: "SoftBank (JP)", plan: "World Supporter", price: "≈ ¥1,980/day", speed: "Full speed" },
    ],
    warn:
      "Roaming downsides: 1) expensive; 2) often throttled; 3) may not receive Chinese SMS (needed for WeChat / Alipay signup); 4) bank security SMS may be delayed. A local SIM is usually still the better choice.",
  },
  esim: {
    title: "Option 3 — eSIM data plans",
    intro: "If your iPhone or Android supports eSIM, this is the most convenient option — no physical card, just scan a QR to activate.",
    headers: ["Provider", "Price", "Data", "Advantage"],
    rows: [
      { name: "Airalo", price: "From $4.50 USD", data: "1GB–20GB", adv: "190+ countries, simple UX" },
      { name: "Nomad", price: "From $3 USD", data: "Flexible days/GB", adv: "Transparent pricing, no hidden fees" },
      { name: "Holafly", price: "From €19", data: "Unlimited", adv: "Unlimited data, great for heavy use" },
      { name: "GigSky", price: "From $9 USD", data: "Multiple bundles", adv: "Multi-device sharing" },
      { name: "Ubigi", price: "CAD/EUR billing", data: "By day / by GB", adv: "Worldwide coverage" },
    ],
    warn:
      "eSIM caveats: 1) most are data-only — no SMS/calls; 2) you may not be able to sign up for WeChat / Alipay (need SMS); 3) best setup is eSIM (data) + local physical SIM (SMS).",
  },
  pocket: {
    title: "Option 4 — Pocket WiFi rental",
    items: [
      "Where: airport counters, Ctrip, Fliggy online booking.",
      "Price: ¥30–60/day depending on data and length.",
      "Battery: usually 8–15 hours of continuous use.",
      "Coverage: one unit serves 3–5 devices simultaneously.",
      "Return: airport drop-off or shipping back.",
    ],
    pros: [
      "Pros: doesn't take your SIM slot, cheaper to share between people.",
      "Cons: extra device to carry and charge, loss risk, signal less stable than a local SIM.",
    ],
  },
  vpn: {
    title: "About VPNs",
    legal:
      "Legal notice: under Chinese law, building or using an unauthorised cross-border channel is illegal. The notes below are informational only — plan your usage in compliance with local law.",
    whyTitle: "Why we don't recommend relying on a VPN",
    reasons: [
      "Legal risk — using unauthorised VPNs violates Chinese cybersecurity law; warnings, fines or administrative penalties are possible.",
      "Technical blocking — the GFW continuously upgrades; most public VPNs get detected and dropped.",
      "Unstable — even when connected, speeds are often slow and connections drop.",
      "Security — many 'free' VPNs harvest your data and private info.",
      "Chicken-and-egg payment — buying a VPN itself requires international payment methods.",
    ],
    betterTitle: "A better mindset",
    better:
      "Instead of fighting for a VPN, embrace the Chinese internet ecosystem. WeChat handles almost any daily communication, Gaode/Baidu beats Google Maps in China, and DiDi rivals Uber for ride-hailing.",
    legitTitle: "Legitimate cross-border channels (for special cases)",
    legit: [
      "Corporate lines — multinationals can apply for cross-border MPLS-IP VPN.",
      "Education / research networks — universities and research institutes have dedicated international gateways.",
      "Embassy networks — some embassies provide internal services to their citizens.",
      "International hotels / Grade-A office buildings — some have registered international connectivity.",
    ],
  },
  arrival: {
    title: "First things to do on arrival",
    items: [
      "Buy or activate a Chinese SIM card (easiest at the airport).",
      "Test the connection by opening baidu.com in your browser.",
      "Install must-have apps: WeChat, Alipay, Gaode Map, Ctrip, Dianping, DiDi.",
      "Sign up for WeChat & Alipay and bind your bank card.",
      "Save family contacts and configure emergency calling.",
    ],
  },
  wifi: {
    title: "Public WiFi tips",
    placesTitle: "Where to find free WiFi",
    places: [
      "Airports, high-speed rail stations, star-rated hotels — free WiFi (usually phone-number or WeChat verification).",
      "Starbucks, McDonald's and other chains — free WiFi with phone-number verification.",
      "Large shopping malls — free WiFi available.",
    ],
    stepsTitle: "How to connect",
    steps: [
      "Open WiFi settings and pick the target network.",
      "Browser pops up an auth page (try opening any site if not).",
      "Enter your phone number and SMS code (or use WeChat).",
      "Once verified, you're online.",
      "Public WiFi is low-security — avoid banking or sensitive logins on it.",
    ],
  },
  contact: {
    title: "Staying in touch with family",
    headers: ["Method", "How", "Cost", "Reliability"],
    rows: [
      { method: "WeChat voice / video", how: "Family installs WeChat & adds you", cost: "Free (small data)", rel: "★★★★★ Top pick" },
      { method: "FaceTime Audio", how: "iPhone to iPhone", cost: "Free (data/WiFi)", rel: "★★★★★" },
      { method: "iMessage", how: "iPhone text/photo", cost: "Free", rel: "★★★★★" },
      { method: "Skype", how: "Both sides install Skype", cost: "Free (data/WiFi)", rel: "★★★★" },
      { method: "International call", how: "Dial via local SIM", cost: "≈ ¥0.5–2/min", rel: "★★★ Backup" },
      { method: "Email", how: "Any email service", cost: "Free", rel: "★★★ Async" },
    ],
    best:
      "Strongest recommendation: get your friends and family back home to install WeChat. You'll get free voice & video calls, image sharing, location sharing — essentially the WhatsApp experience, plus real-time translation built in.",
  },
};

const zh: Content = {
  title: "VPN 与上网",
  subtitle: "在中国轻松联网的完整指南（2026）",
  intro:
    "许多在国外常用的网站和应用（Google、WhatsApp、Instagram 等）在中国大陆无法直接访问。本指南介绍哪些可用、哪些不可用、如何联网，以及推荐使用的本地 App。",
  available: {
    title: "在中国大陆可正常使用的国际服务",
    headers: ["类别", "可用服务", "备注"],
    rows: [
      { cat: "搜索引擎", svc: "Bing 必应、DuckDuckGo", note: "Google 搜索不可用" },
      { cat: "社交媒体", svc: "—", note: "Facebook / Twitter / Instagram 均不可用" },
      { cat: "即时通讯", svc: "iMessage、FaceTime", note: "WhatsApp / Telegram / Signal 不可用" },
      { cat: "视频流媒体", svc: "Netflix（不稳定）", note: "YouTube 被屏蔽" },
      { cat: "邮件服务", svc: "Gmail（需 IMAP/SMTP 客户端）", note: "Gmail 网页版不可用" },
      { cat: "云存储", svc: "OneDrive、Dropbox（有时受限）", note: "Google Drive 不可用" },
      { cat: "地图导航", svc: "Apple Maps", note: "Google Maps 需替代方案" },
      { cat: "新闻资讯", svc: "BBC 中文网、CNN（间歇）", note: "部分新闻网站受限" },
    ],
  },
  restricted: {
    title: "需要 VPN 才能访问的服务",
    desc: "以下服务在中国大陆无法直接访问，请注意下方关于 VPN 的法律提示：",
    items: [
      "Google 全家桶：搜索、Gmail、地图、Drive、YouTube、Play Store",
      "Meta 全家桶：Facebook、Instagram、WhatsApp、Messenger",
      "Twitter / X 及相关应用",
      "Telegram、Discord、Slack",
      "Reddit、国际版 TikTok",
      "部分西方新闻媒体（NYT、WSJ、The Guardian 等)",
      "Wikipedia（中文维基大部分页面受限）",
      "某些博客平台和个人网站",
    ],
  },
  alts: {
    title: "推荐使用的中国本土替代应用",
    intro: "与其费心找 VPN，不如拥抱本地 App——速度更快，体验更好，也更融入当地生活。",
    headers: ["国外服务", "中国替代品", "特点"],
    rows: [
      { foreign: "Google Maps", china: "高德地图 / 百度地图", feat: "导航精确到米级，支持步行 / 驾车 / 公交 / 骑行" },
      { foreign: "Uber", china: "滴滴出行 DiDi", feat: "覆盖 300+ 城市，可切换英文界面" },
      { foreign: "WhatsApp / Messenger", china: "微信 WeChat", feat: "13 亿用户，聊天 + 支付 + 小程序" },
      { foreign: "Twitter / X", china: "微博 Weibo", feat: "类似 Twitter 的中国社交平台" },
      { foreign: "Instagram / TikTok", china: "抖音 / 小红书 RED", feat: "短视频和生活方式分享" },
      { foreign: "YouTube", china: "哔哩哔哩 Bilibili", feat: "海量免费视频" },
      { foreign: "Amazon / eBay", china: "淘宝 / 京东", feat: "电商购物，价格极具竞争力" },
      { foreign: "Airbnb", china: "美团民宿 / 携程民宿", feat: "短租房源丰富" },
      { foreign: "Yelp / TripAdvisor", china: "大众点评 Dianping", feat: "餐厅评价、景点攻略一站式" },
      { foreign: "Google Translate", china: "百度翻译 / DeepL", feat: "支持拍照翻译" },
      { foreign: "Spotify / Apple Music", china: "网易云音乐 / QQ 音乐", feat: "版权齐全" },
      { foreign: "Uber Eats", china: "饿了么 / 美团外卖", feat: "30 分钟送达" },
    ],
  },
  sim: {
    title: "方案一：购买中国本地 SIM 卡（推荐）",
    intro: "拥有本地手机号 + 高速数据，体验最好。",
    carriers: [
      { name: "中国移动 China Mobile", pros: "信号覆盖最好，尤其偏远地区", cons: "资费相对较高", who: "去西部 / 乡村旅行者" },
      { name: "中国联通 China Unicom", pros: "套餐性价比高，支持 eSIM", cons: "部分地区信号弱", who: "城市游为主，注重性价比" },
      { name: "中国电信 China Telecom", pros: "WiFi 热点 & 宽带资源好", cons: "兼容性稍差", who: "重度数据使用者" },
    ],
    carriersHeaders: ["运营商", "优点", "缺点", "适合人群"],
    whereTitle: "购买地点",
    where: [
      "机场到达大厅 —— 最方便，工作人员通常支持英文。",
      "运营商营业厅 —— 各大城市遍布，凭护照办理。",
      "便利店 —— 如 7-Eleven 出售 SIM 套包。",
      "电商平台 —— 提前在淘宝 / 京东购买，抵达后激活即可。",
      "Klook / Trip.com —— 在线预订机场取货，可选多语言客服。",
    ],
    plansTitle: "推荐套餐（2026）",
    plans: [
      { plan: "基础版", price: "¥30–50/月", incl: "10–20GB 国内流量 + 50 分钟通话", rec: "★★☆ 轻度使用" },
      { plan: "标准版", price: "¥59–89/月", incl: "40–80GB 流量 + 200 分钟通话", rec: "★★★ 大多数游客" },
      { plan: "畅享版", price: "¥99–149/月", incl: "100–150GB 流量 + 不限通话", rec: "★★★★ 重度使用 / 数字游民" },
      { plan: "旅游短期卡", price: "¥30–50/周", incl: "7–14 天有效，含大量流量", rec: "★★★★ 短途旅行首选" },
    ],
    plansHeaders: ["套餐", "价格", "包含内容", "推荐度"],
    tip: "省钱技巧：只待一两周的话，强烈推荐「旅游短期卡」——大流量、自动失效、无需注销。",
  },
  roam: {
    title: "方案二：开通国际漫游",
    headers: ["本国运营商", "漫游套餐", "价格参考", "网速"],
    rows: [
      { carrier: "T-Mobile (US)", plan: "Magenta Max 含国际漫游", price: "$0 额外费用", speed: "限速 (256kbps–2G)" },
      { carrier: "Verizon (US)", plan: "TravelPass 日套餐", price: "$10/天", speed: "高速（视地区而定）" },
      { carrier: "AT&T (US)", plan: "International Day Pass", price: "$10/天", speed: "高速" },
      { carrier: "Vodafone (UK)", plan: "Global Roaming Plus", price: "£6/天", speed: "高速（含 75 国）" },
      { carrier: "O2 (UK)", plan: "International Bolt-On", price: "£6/天", speed: "高速" },
      { carrier: "EE (UK)", plan: "Travel Data Pass", price: "£8.88/天", speed: "高速" },
      { carrier: "Telstra (AU)", plan: "International Roaming", price: "AUD $10–15/天", speed: "高速" },
      { carrier: "SoftBank (JP)", plan: "World Supporter", price: "约 JPY ¥1,980/天", speed: "高速" },
    ],
    warn:
      "漫游缺点：①价格昂贵；②可能限速；③可能无法接收中国本地短信（注册微信 / 支付宝必需）；④银行安全短信可能延迟或不达。综合来看，购买本地 SIM 仍是更优选择。",
  },
  esim: {
    title: "方案三：eSIM 数据套餐",
    intro: "如果你的 iPhone 或 Android 支持 eSIM，这是最便捷的方式——无需物理卡，扫码即可激活。",
    headers: ["服务商", "价格", "流量", "优势"],
    rows: [
      { name: "Airalo", price: "USD $4.5 起", data: "1GB–20GB", adv: "覆盖 190+ 国家，操作简单" },
      { name: "Nomad", price: "USD $3 起", data: "灵活选择天数 / 流量", adv: "价格透明，无隐藏收费" },
      { name: "Holafly", price: "EUR €19 起", data: "无限流量", adv: "适合重度使用者" },
      { name: "GigSky", price: "USD $9 起", data: "多种套餐", adv: "支持多设备共享" },
      { name: "Ubigi", price: "CAD/EUR 计费", data: "按天 / 按 GB", adv: "全球多地覆盖" },
    ],
    warn:
      "eSIM 注意事项：①通常只有数据功能，不含电话短信；②注册微信 / 支付宝等需要短信验证的 App 可能受限；③建议 eSIM + 本地实体 SIM 双卡搭配：eSIM 用数据，本地 SIM 收短信。",
  },
  pocket: {
    title: "方案四：租赁便携式 WiFi",
    items: [
      "租借地点：国内机场柜台、携程 / 飞猪在线预订。",
      "价格：约 ¥30–60/天（依流量和天数而定）。",
      "电池续航：一般 8–15 小时。",
      "覆盖人数：一台设备可供 3–5 台设备同时连接。",
      "归还方式：机场归还或快递寄回。",
    ],
    pros: [
      "优点：不占用手机 SIM 卡槽，多人共用更经济。",
      "缺点：需额外携带设备并充电，丢失风险，信号不如本地 SIM 稳定。",
    ],
  },
  vpn: {
    title: "关于 VPN 的重要说明",
    legal:
      "法律提示：根据中国法律法规，未经批准擅自建立或使用非法跨境信道属于违法行为。以下信息仅供研究与海外人士了解背景，请在遵守当地法律的前提下合理规划上网需求。",
    whyTitle: "为什么不建议依赖 VPN",
    reasons: [
      "法律风险 —— 使用未经授权的 VPN 违反中国网络安全法，可能面临警告、罚款乃至行政处罚。",
      "技术封锁 —— 防火长城 (GFW) 持续升级，大多数公共 VPN 会被识别并阻断。",
      "连接不稳 —— 即使能连上，速度往往很慢且频繁断线。",
      "安全隐患 —— 许多「免费」VPN 会收集用户数据和隐私。",
      "鸡生蛋问题 —— 购买 VPN 本身也需要国际支付方式。",
    ],
    betterTitle: "更好的思路",
    better:
      "与其花精力寻找 VPN，不如拥抱中国本土互联网生态。你会发现微信已能满足几乎所有日常通讯，高德地图比 Google Maps 更适合在中国使用，滴滴出行的体验也毫不逊于 Uber。",
    legitTitle: "合法的国际联网途径（特殊情况）",
    legit: [
      "企业专线 —— 外资企业可通过正规渠道申请跨境企业专线（MPLS-IP VPN）。",
      "教育科研网络 —— 高校和科研机构通常有独立的国际出口通道。",
      "使馆网络 —— 部分国家大使馆提供内部网络服务。",
      "国际酒店 / 高端写字楼 —— 部分涉外场所可能提供经过备案的国际联网通道。",
    ],
  },
  arrival: {
    title: "到达中国后的第一件事",
    items: [
      "购买或激活中国本地 SIM 卡（机场最方便）。",
      "测试网络连接（打开 baidu.com 验证）。",
      "下载必备 App：微信、支付宝、高德地图、携程、大众点评、滴滴出行。",
      "注册微信和支付宝账号，绑定银行卡。",
      "保存家人联系方式，设置紧急呼叫。",
    ],
  },
  wifi: {
    title: "公共 WiFi 使用指南",
    placesTitle: "哪里有免费 WiFi",
    places: [
      "机场、高铁站、星级酒店 —— 通常免费，需手机号或微信注册。",
      "星巴克、麦当劳等连锁店 —— 提供免费 WiFi（手机号验证）。",
      "大型购物中心 —— 通常有免费 WiFi。",
    ],
    stepsTitle: "连接步骤",
    steps: [
      "打开手机 WiFi 设置，选择目标网络。",
      "浏览器会自动弹出认证页面（如未弹出可手动打开任意网页）。",
      "输入手机号并接收短信验证码（或使用微信）。",
      "认证成功后即可使用。",
      "公共 WiFi 安全性较低，避免在此环境下进行银行转账或输入密码。",
    ],
  },
  contact: {
    title: "与家人保持联系的最佳方案",
    headers: ["方案", "操作方式", "成本", "可靠性"],
    rows: [
      { method: "微信语音 / 视频", how: "家人也安装微信并添加好友", cost: "免费（少量流量）", rel: "★★★★★ 最推荐" },
      { method: "FaceTime Audio", how: "iPhone 之间可直接拨打", cost: "免费（需数据 / WiFi）", rel: "★★★★★" },
      { method: "iMessage", how: "iPhone 之间文字 / 图片", cost: "免费", rel: "★★★★★" },
      { method: "Skype", how: "双方都安装 Skype", cost: "免费（需数据 / WiFi）", rel: "★★★★" },
      { method: "国际电话", how: "使用本地 SIM 卡拨打", cost: "约 ¥0.5–2/分钟", rel: "★★★ 应急备用" },
      { method: "邮件 Email", how: "任何邮箱均可", cost: "免费", rel: "★★★ 非实时" },
    ],
    best:
      "强烈推荐让国内的亲友 / 同事也安装微信！可以随时进行免费语音通话、视频聊天、发送图片和位置分享，体验与 WhatsApp 几乎完全一致，还支持实时翻译功能。",
  },
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {i + 1}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function InternetGuide({ trigger }: { trigger: ReactNode }) {
  const { lang } = useLanguage();
  const c = lang === "zh" ? zh : en;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="font-serif text-2xl">{c.title}</DialogTitle>
          <DialogDescription>{c.subtitle}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-5rem)]">
          <div className="space-y-8 px-6 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.available.title}</h3>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.available.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.available.rows.map((r) => (
                      <tr key={r.cat} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.cat}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.svc}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />
            <section>
              <h3 className="text-lg font-bold text-foreground">{c.restricted.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.restricted.desc}</p>
              <BulletList items={c.restricted.items} />
            </section>

            <Separator />
            <section>
              <h3 className="text-lg font-bold text-foreground">{c.alts.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.alts.intro}</p>
              <div className="mt-4 overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.alts.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.alts.rows.map((r) => (
                      <tr key={r.foreign} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.foreign}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.china}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.feat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.sim.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.sim.intro}</p>

              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.sim.carriersHeaders.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.sim.carriers.map((r) => (
                      <tr key={r.name} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.name}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.pros}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.cons}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.who}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.sim.whereTitle}</h4>
                <BulletList items={c.sim.where} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.sim.plansTitle}</h4>
                <div className="mt-3 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        {c.sim.plansHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.sim.plans.map((r) => (
                        <tr key={r.plan} className="border-t">
                          <td className="px-3 py-2 font-medium text-foreground">{r.plan}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.price}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{r.incl}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{r.rec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">💡 {c.sim.tip}</p>
            </section>

            <Separator />
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">{c.roam.title}</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.roam.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.roam.rows.map((r) => (
                      <tr key={r.carrier} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.carrier}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.plan}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.price}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.speed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-md border-l-2 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                ⚠️ {c.roam.warn}
              </p>
            </section>

            <Separator />
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">{c.esim.title}</h3>
              <p className="text-sm text-muted-foreground">{c.esim.intro}</p>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.esim.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.esim.rows.map((r) => (
                      <tr key={r.name} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.price}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.data}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.adv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-md border-l-2 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                ⚠️ {c.esim.warn}
              </p>
            </section>

            <Separator />
            <section>
              <h3 className="text-lg font-bold text-foreground">{c.pocket.title}</h3>
              <BulletList items={c.pocket.items} />
              <BulletList items={c.pocket.pros} />
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.vpn.title}</h3>
              <p className="rounded-md border-l-2 border-destructive bg-destructive/10 p-3 text-xs text-destructive">
                ⚠️ {c.vpn.legal}
              </p>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.vpn.whyTitle}</h4>
                <BulletList items={c.vpn.reasons} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.vpn.betterTitle}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.vpn.better}</p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.vpn.legitTitle}</h4>
                <BulletList items={c.vpn.legit} />
              </div>
            </section>

            <Separator />
            <section>
              <h3 className="text-lg font-bold text-foreground">{c.arrival.title}</h3>
              <NumberedList items={c.arrival.items} />
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.wifi.title}</h3>
              <div>
                <h4 className="text-base font-semibold text-foreground">{c.wifi.placesTitle}</h4>
                <BulletList items={c.wifi.places} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">{c.wifi.stepsTitle}</h4>
                <NumberedList items={c.wifi.steps} />
              </div>
            </section>

            <Separator />
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">{c.contact.title}</h3>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.contact.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.contact.rows.map((r) => (
                      <tr key={r.method} className="border-t">
                        <td className="px-3 py-2 font-medium text-foreground">{r.method}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.how}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.cost}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.rel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">💡 {c.contact.best}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
