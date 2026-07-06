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

type VisaType = { code: string; name: string; stay: string; who: string };
type CountryRow = { country: string; stay: string; note?: string };
type PortRow = { region: string; ports: string; area: string };
type FeeRow = { type: string; us: string; ca: string; other: string; rush: string };

type Content = {
  title: string;
  subtitle: string;
  intro: string;
  types: { title: string; headers: [string, string, string, string]; rows: VisaType[] };
  visaFree: {
    title: string;
    unilateralTitle: string;
    unilateralDesc: string;
    unilateralCountries: string[];
    unilateralWarn: string;
    mutualTitle: string;
    mutualRows: CountryRow[];
    updateNote: string;
  };
  transit: {
    title: string;
    what: string;
    conditionsTitle: string;
    conditions: string[];
    countriesTitle: string;
    countries: string;
    portsTitle: string;
    portsHeaders: [string, string, string];
    portRows: PortRow[];
    tip: string;
  };
  apply: {
    title: string;
    intro: string;
    docsTitle: string;
    docs: string[];
    processTitle: string;
    process: string[];
    feesTitle: string;
    feesHeaders: [string, string, string, string, string];
    feeRows: FeeRow[];
    feeNote: string;
  };
  entry: {
    title: string;
    docsTitle: string;
    docs: string[];
    customsTitle: string;
    customs: string[];
    forbidden: string;
    extendTitle: string;
    extend: string[];
    overstay: string;
  };
};

const en: Content = {
  title: "Visa & Entry Policy",
  subtitle: "Everything foreign visitors need to know before flying to China (2026)",
  intro:
    "Depending on your nationality and itinerary, you may qualify for visa-free entry, a 240-hour transit exemption, or need a regular tourist (L) visa. This guide covers all three paths.",
  types: {
    title: "China visa types overview",
    headers: ["Type", "Name", "Stay", "Who it's for"],
    rows: [
      { code: "L", name: "Tourist Visa", stay: "30–90 days", who: "Tourists & sightseers" },
      { code: "M", name: "Business Visa", stay: "30–180 days", who: "Business trips, meetings, training" },
      { code: "Q", name: "Family Visit", stay: "180–360 days", who: "Family reunion" },
      { code: "X", name: "Study Visa", stay: "Duration of study", who: "Long-term study / students" },
      { code: "Z", name: "Work Visa", stay: "Employment period", who: "Employment in China" },
      { code: "G", name: "Transit Visa", stay: "72–240 hours", who: "Transit passengers" },
      { code: "APEC", name: "APEC Card", stay: "60–90 days", who: "Valid APEC card holders" },
    ],
  },
  visaFree: {
    title: "Who can enter China visa-free?",
    unilateralTitle: "Unilateral visa-free (ordinary passport)",
    unilateralDesc:
      "Since 30 Nov 2024, China has granted unilateral visa-free entry to 38 countries (extended through 2025), covering most of Europe and key Asia-Pacific nations. Each stay up to 30 days for tourism, business, family visits or transit.",
    unilateralCountries: [
      "France 🇫🇷", "Germany 🇩🇪", "Italy 🇮🇹", "Netherlands 🇳🇱", "Spain 🇪🇸",
      "Switzerland 🇨🇭", "Ireland 🇮🇪", "Hungary 🇭🇺", "Austria 🇦🇹", "Belgium 🇧🇪",
      "Luxembourg 🇱🇺", "Portugal 🇵🇹", "Greece 🇬🇷", "Norway 🇳🇴", "Denmark 🇩🇰",
      "Finland 🇫🇮", "Iceland 🇮🇸", "Sweden 🇸🇪", "Poland 🇵🇱", "Czech Republic 🇨🇿",
      "Slovakia 🇸🇰", "Slovenia 🇸🇮", "Croatia 🇭🇷", "Bulgaria 🇧🇬",
      "Romania 🇷🇴", "Estonia 🇪🇪", "Latvia 🇱🇻", "Lithuania 🇱🇹",
      "Malta 🇲🇹", "Cyprus 🇨🇾", "Montenegro 🇲🇪", "North Macedonia 🇲🇰",
      "Monaco 🇲🇨", "Liechtenstein 🇱🇮", "Andorra 🇦🇩",
      "South Korea 🇰🇷", "Japan 🇯🇵", "New Zealand 🇳🇿", "Australia 🇦🇺",
    ],
    unilateralWarn:
      "Only for tourism, business, family visits or transit — NOT for work, study or journalism. Max 30 days per entry (as stamped at the border).",
    mutualTitle: "Mutual visa-exemption agreements",
    mutualRows: [
      { country: "Singapore 🇸🇬", stay: "30 days", note: "Up to 90 days per calendar year" },
      { country: "Thailand 🇹🇭", stay: "30 days", note: "Permanent mutual since Mar 2024" },
      { country: "Malaysia 🇲🇾", stay: "30 days", note: "Mutual since Dec 2023" },
      { country: "Georgia 🇬🇪", stay: "30 days" },
      { country: "Kazakhstan 🇰🇿", stay: "30 days", note: "Up to 90 days per 180-day period" },
      { country: "Azerbaijan 🇦🇿", stay: "30 days" },
      { country: "Armenia 🇦🇲", stay: "90 days", note: "Per 180-day period" },
      { country: "Serbia 🇷🇸", stay: "30 days" },
      { country: "Bosnia & Herzegovina 🇧🇦", stay: "90 days", note: "Per 180-day period" },
      { country: "Belarus 🇧🇾", stay: "30 days" },
      { country: "Albania 🇦🇱", stay: "90 days", note: "Per 180-day period" },
      { country: "UAE 🇦🇪", stay: "30 days" },
      { country: "Qatar 🇶🇦", stay: "30 days" },
      { country: "Maldives 🇲🇻", stay: "30 days" },
      { country: "Jamaica 🇯🇲", stay: "30 days" },
      { country: "Fiji 🇫🇯", stay: "30 days" },
      { country: "Ecuador 🇪🇨", stay: "90 days" },
      { country: "Mauritius 🇲🇺", stay: "30 days" },
      { country: "Seychelles 🇸🇨", stay: "30 days" },
    ],
    updateNote:
      "Lists are updated frequently — always reconfirm with the Chinese Ministry of Foreign Affairs or your local Chinese embassy before booking.",
  },
  transit: {
    title: "240-hour Transit Visa Exemption",
    what:
      "Even if you don't qualify for visa-free entry, you may still enter China for up to 240 hours (10 days) if you are transiting to a third country. Upgraded from the previous 144-hour (6-day) policy in Dec 2024, now with cross-province travel allowed!",
    conditionsTitle: "Eligibility",
    conditions: [
      "Hold a valid passport AND an onward ticket to a third country (cannot return to your country of origin).",
      "Be a citizen of one of the eligible countries.",
      "Enter through one of the designated ports.",
      "Stay no more than 240 hours (10 days).",
      "Cross-province travel is now permitted within the designated zone.",
    ],
    countriesTitle: "Eligible countries (54 total)",
    countries:
      "All Schengen states · UK · Ireland · USA · Canada · Brazil · Mexico · Argentina · Chile · Australia · New Zealand · South Korea · Japan · Singapore · Brunei · UAE · Qatar · Bahrain · Kuwait · Saudi Arabia · Oman · Serbia · Croatia · Bosnia · Montenegro · North Macedonia · Albania · Iran · Tunisia · Kazakhstan · Russia · Ukraine · Morocco · South Africa · Egypt · Israel · India · Indonesia · Vietnam · Philippines · Mongolia · Turkey.",
    portsTitle: "Open ports & travel zones",
    portsHeaders: ["Region", "Entry ports", "Allowed area"],
    portRows: [
      { region: "Beijing / Tianjin / Hebei", ports: "PEK, PKX, TSN airports; Tianjin port", area: "Beijing, Tianjin, Hebei" },
      { region: "Shanghai / Jiangsu / Zhejiang", ports: "PVG, SHA, Hongqiao Rail, Wusongkou port", area: "Shanghai, Jiangsu, Zhejiang" },
      { region: "Guangdong", ports: "CAN, SZX airports; Gongbei (Zhuhai)", area: "Guangdong" },
      { region: "Liaoning", ports: "SHE (Shenyang), DLC (Dalian)", area: "Liaoning" },
      { region: "Chongqing", ports: "CKG airport, Chongqing port", area: "Chongqing" },
      { region: "Shaanxi", ports: "XIY (Xi'an Xianyang)", area: "Shaanxi" },
      { region: "Sichuan", ports: "CTU / TFU (Chengdu)", area: "Sichuan" },
      { region: "Fujian", ports: "XMN (Xiamen), FOC (Fuzhou)", area: "Fujian" },
      { region: "Yunnan", ports: "KMG (Kunming)", area: "Designated Yunnan zones" },
      { region: "Shandong", ports: "TAO (Qingdao), TNA (Jinan)", area: "Shandong" },
      { region: "Guangxi", ports: "KWL (Guilin), NNG (Nanning)", area: "Guangxi" },
      { region: "Hainan", ports: "HAK (Haikou), SYX (Sanya)", area: "Hainan" },
      { region: "Henan", ports: "CGO (Zhengzhou)", area: "Henan" },
      { region: "Hubei", ports: "WUH (Wuhan)", area: "Hubei" },
      { region: "Hunan", ports: "CSX (Changsha)", area: "Hunan" },
    ],
    tip: "Pro tip: Book a multi-stop ticket like New York → Beijing → Tokyo and you'll get 6 free days in Beijing on the way.",
  },
  apply: {
    title: "How to apply for a tourist (L) visa",
    intro:
      "If you're not eligible for visa-free entry, or need to stay longer, apply for an L visa at your nearest Chinese Visa Application Centre.",
    docsTitle: "Required documents",
    docs: [
      "Passport — valid for 6+ months, at least 2 blank pages.",
      "Completed visa application form (printed & signed).",
      "Recent passport photo (48×33 mm, white background).",
      "Round-trip flight booking (full itinerary).",
      "Hotel booking confirmations or invitation letter.",
      "Travel itinerary covering all dates in China.",
      "Proof of funds (bank statements) — sometimes required.",
      "Copies of previous Chinese visas (if any) — improves approval odds.",
    ],
    processTitle: "Process",
    process: [
      "Register on visaforchina.cn and fill the online application form.",
      "Prepare paper copies of all documents (photo attached to form).",
      "Book an appointment at your nearest Chinese visa centre.",
      "Submit documents in person and pay the visa fee.",
      "Wait for processing — usually 4–8 business days (express: 2–3 days).",
      "Collect your passport (in person or by post) and verify the visa page.",
    ],
    feesTitle: "Fees (reference)",
    feesHeaders: ["Entries", "USA", "Canada", "Other (most)", "Express"],
    feeRows: [
      { type: "Single entry", us: "$140", ca: "$100 CAD / $140 USD", other: "$30–85", rush: "+$25" },
      { type: "Double entry", us: "$140", ca: "$100 CAD / $140 USD", other: "$45–125", rush: "+$25" },
      { type: "6-month multi", us: "$140", ca: "$100 CAD / $140 USD", other: "$60–170", rush: "+$25" },
      { type: "12-month multi", us: "$140", ca: "$100 CAD / $140 USD", other: "$120–230", rush: "+$25" },
    ],
    feeNote: "Reference only — confirm with your local Chinese visa centre.",
  },
  entry: {
    title: "At the border — what to know",
    docsTitle: "Documents to bring",
    docs: [
      "Valid passport (6+ months validity).",
      "Valid visa, or proof that you meet visa-free conditions.",
      "Round-trip ticket (print a copy).",
      "Hotel booking confirmation (print).",
      "Customs health declaration (in some cases, completed before arrival).",
    ],
    customsTitle: "Declare at customs",
    customs: [
      "Cash equivalent to over USD $5,000.",
      "High-value personal items over ¥5,000 (cameras, laptops, etc.).",
      "More than the duty-free allowance of tobacco/alcohol (400 cigarettes / 100 cigars / 1.5L spirits).",
      "Animal & plant products, fresh fruit, meat (generally prohibited).",
      "Printed/audio-visual material containing sensitive content.",
    ],
    forbidden:
      "STRICTLY prohibited: drugs, weapons, anti-government propaganda, protected wildlife products, un-inspected fruit / meat / eggs. Penalties are severe, including criminal charges.",
    extendTitle: "Extending your stay",
    extend: [
      "Apply at least 7 days before expiry at the local Public Security Bureau Exit-Entry office.",
      "Submit passport + copy of visa or visa-free entry stamp + reason for extension.",
      "Provide supporting documents (e.g. medical certificate, force majeure).",
      "Wait 3–5 business days for approval.",
      "Receive a new stay permit if approved.",
    ],
    overstay:
      "Do NOT overstay! Penalties: ¥500/day (capped at ¥10,000), detention, deportation, and possible future entry bans.",
  },
};

const zh: Content = {
  title: "签证与入境政策",
  subtitle: "外国游客来华前需要了解的全部签证与入境信息（2026）",
  intro:
    "根据你的国籍和行程，你可能可以免签入境、申请 240 小时过境免签，或需要办理正式的旅游 (L) 签证。本指南涵盖三种情况。",
  types: {
    title: "中国签证类型一览",
    headers: ["签证类型", "名称", "停留期", "适用人群"],
    rows: [
      { code: "L 字", name: "Tourist Visa", stay: "30–90 天", who: "来华旅游观光" },
      { code: "M 字", name: "Business Visa", stay: "30–180 天", who: "商务考察、会议、培训" },
      { code: "Q 字", name: "Family Visit", stay: "180–360 天", who: "探亲 / 团聚" },
      { code: "X 字", name: "Study Visa", stay: "学习期限", who: "长期学习 / 留学" },
      { code: "Z 字", name: "Work Visa", stay: "工作期限", who: "在华工作" },
      { code: "G 字", name: "Transit Visa", stay: "72–240 小时", who: "过境旅客" },
      { code: "APEC", name: "APEC Card", stay: "60–90 天", who: "持有效 APEC 卡的商旅人士" },
    ],
  },
  visaFree: {
    title: "谁可以免签入境？",
    unilateralTitle: "单方面免签（普通护照）",
    unilateralDesc:
      "自 2024 年 11 月 30 日起，中国单方面对 38 个国家持普通护照人员试行免签政策（2025 年进一步延期），涵盖欧洲大部及亚太主要国家。每次停留不超过 30 天，可用于旅游、商务、探亲或过境。",
    unilateralCountries: [
      "法国 🇫🇷", "德国 🇩🇪", "意大利 🇮🇹", "荷兰 🇳🇱", "西班牙 🇪🇸",
      "瑞士 🇨🇭", "爱尔兰 🇮🇪", "匈牙利 🇭🇺", "奥地利 🇦🇹", "比利时 🇧🇪",
      "卢森堡 🇱🇺", "葡萄牙 🇵🇹", "希腊 🇬🇷", "挪威 🇳🇴", "丹麦 🇩🇰",
      "芬兰 🇫🇮", "冰岛 🇮🇸", "瑞典 🇸🇪", "波兰 🇵🇱", "捷克 🇨🇿",
      "斯洛伐克 🇸🇰", "斯洛文尼亚 🇸🇮", "克罗地亚 🇭🇷", "保加利亚 🇧🇬",
      "罗马尼亚 🇷🇴", "爱沙尼亚 🇪🇪", "拉脱维亚 🇱🇻", "立陶宛 🇱🇹",
      "马耳他 🇲🇹", "塞浦路斯 🇨🇾", "黑山 🇲🇪", "北马其顿 🇲🇰",
      "摩纳哥 🇲🇨", "列支敦士登 🇱🇮", "安道尔 🇦🇩",
      "韩国 🇰🇷", "日本 🇯🇵", "新西兰 🇳🇿", "澳大利亚 🇦🇺",
    ],
    unilateralWarn:
      "免签适用于旅游、商务、探亲或过境，不适用于工作、学习或新闻报道。每次入境最长 30 天（以海关标注为准）。",
    mutualTitle: "互免签证协议国家",
    mutualRows: [
      { country: "新加坡 🇸🇬", stay: "30 天", note: "每自然年累计不超过 90 天" },
      { country: "泰国 🇹🇭", stay: "30 天", note: "2024 年 3 月起永久互免" },
      { country: "马来西亚 🇲🇾", stay: "30 天", note: "2023 年 12 月起互免" },
      { country: "格鲁吉亚 🇬🇪", stay: "30 天" },
      { country: "哈萨克斯坦 🇰🇿", stay: "30 天", note: "每 180 天累计不超过 90 天" },
      { country: "阿塞拜疆 🇦🇿", stay: "30 天" },
      { country: "亚美尼亚 🇦🇲", stay: "90 天", note: "每 180 天累计" },
      { country: "塞尔维亚 🇷🇸", stay: "30 天" },
      { country: "波黑 🇧🇦", stay: "90 天", note: "每 180 天累计" },
      { country: "白俄罗斯 🇧🇾", stay: "30 天" },
      { country: "阿尔巴尼亚 🇦🇱", stay: "90 天", note: "每 180 天累计" },
      { country: "阿联酋 🇦🇪", stay: "30 天" },
      { country: "卡塔尔 🇶🇦", stay: "30 天" },
      { country: "马尔代夫 🇲🇻", stay: "30 天" },
      { country: "牙买加 🇯🇲", stay: "30 天" },
      { country: "斐济 🇫🇯", stay: "30 天" },
      { country: "厄瓜多尔 🇪🇨", stay: "90 天" },
      { country: "毛里求斯 🇲🇺", stay: "30 天" },
      { country: "塞舌尔 🇸🇨", stay: "30 天" },
    ],
    updateNote: "免签名单持续更新，出发前请通过中国外交部官网或驻当地大使馆确认最新政策。",
  },
  transit: {
    title: "240 小时过境免签",
    what:
      "即使你不符合免签条件，只要是经中国过境前往第三国，仍可在指定省市免签停留最多 240 小时（10 天）。2024 年 12 月从原 144 小时（6 天）升级为 240 小时，并放开跨省旅行限制。",
    conditionsTitle: "适用条件",
    conditions: [
      "持有效护照与前往第三国的国际联程机票（不能原路返回）。",
      "来自适用国家之一。",
      "从指定口岸入境。",
      "停留不超过 240 小时（10 天）。",
      "可在允许区域内跨省旅行。",
    ],
    countriesTitle: "适用国家（共 54 个）",
    countries:
      "申根国家 · 英国 · 爱尔兰 · 美国 · 加拿大 · 巴西 · 墨西哥 · 阿根廷 · 智利 · 澳大利亚 · 新西兰 · 韩国 · 日本 · 新加坡 · 文莱 · 阿联酋 · 卡塔尔 · 巴林 · 科威特 · 沙特阿拉伯 · 阿曼 · 塞尔维亚 · 克罗地亚 · 波黑 · 黑山 · 北马其顿 · 阿尔巴尼亚 · 伊朗 · 突尼斯 · 哈萨克斯坦 · 俄罗斯 · 乌克兰 · 摩洛哥 · 南非 · 埃及 · 以色列 · 印度 · 印度尼西亚 · 越南 · 菲律宾 · 蒙古 · 土耳其。",
    portsTitle: "开放口岸及活动区域",
    portsHeaders: ["区域", "入境口岸", "活动范围"],
    portRows: [
      { region: "北京 / 天津 / 河北", ports: "首都、大兴、天津滨海等机场；天津港", area: "北京、天津、河北全境" },
      { region: "上海 / 江苏 / 浙江", ports: "浦东、虹桥机场、虹桥火车站、吴淞口码头", area: "上海、江苏、浙江全境" },
      { region: "广东", ports: "广州白云、深圳宝安机场；珠海拱北口岸", area: "广东全境" },
      { region: "辽宁", ports: "沈阳桃仙、大连周水子机场", area: "辽宁全境" },
      { region: "重庆", ports: "重庆江北机场；重庆港", area: "重庆全境" },
      { region: "陕西", ports: "西安咸阳机场", area: "陕西全境" },
      { region: "四川", ports: "成都双流 / 天府机场", area: "四川全境" },
      { region: "福建", ports: "厦门高崎、福州长乐机场", area: "福建全境" },
      { region: "云南", ports: "昆明长水机场", area: "云南指定区域" },
      { region: "山东", ports: "青岛胶东、济南遥墙机场", area: "山东全境" },
      { region: "广西", ports: "桂林两江、南宁吴圩机场", area: "广西全境" },
      { region: "海南", ports: "海口美兰、三亚凤凰机场", area: "海南全境" },
      { region: "河南", ports: "郑州新郑机场", area: "河南全境" },
      { region: "湖北", ports: "武汉天河机场", area: "湖北全境" },
      { region: "湖南", ports: "长沙黄花机场", area: "湖南全境" },
    ],
    tip: "使用技巧：购买「出发地→中国某城市→第三国」的联程机票，例如纽约→北京→东京，可在北京免签游览 6 天。",
  },
  apply: {
    title: "如何申请旅游 (L) 签证",
    intro: "如果不在免签范围内，或需要更长的停留时间，请到当地中国签证中心申请 L 签证。",
    docsTitle: "申请材料",
    docs: [
      "护照原件：6 个月以上有效期，至少 2 页空白。",
      "签证申请表：在线填写、打印并签名。",
      "近期证件照：48×33mm、白底、正面免冠彩照。",
      "往返机票预订单（完整航班信息）。",
      "酒店预订单或邀请函。",
      "在华行程计划。",
      "银行流水或存款证明（部分情况要求）。",
      "过往中国签证复印件（如有，有助审批）。",
    ],
    processTitle: "办理流程",
    process: [
      "登录 visaforchina.cn 注册账号并填写申请表。",
      "准备所有材料的纸质版（照片贴在申请表上）。",
      "在线预约就近的中国签证中心。",
      "亲自递交材料并缴纳签证费。",
      "等待审核：通常 4–8 个工作日（加急 2–3 天）。",
      "领取护照并核对签证页信息。",
    ],
    feesTitle: "签证费用参考",
    feesHeaders: ["签证次数", "美国", "加拿大", "其他多数国家", "加急费"],
    feeRows: [
      { type: "一次入境", us: "$140", ca: "$100 CAD / $140 USD", other: "$30–85", rush: "+$25" },
      { type: "两次入境", us: "$140", ca: "$100 CAD / $140 USD", other: "$45–125", rush: "+$25" },
      { type: "半年多次", us: "$140", ca: "$100 CAD / $140 USD", other: "$60–170", rush: "+$25" },
      { type: "一年多次", us: "$140", ca: "$100 CAD / $140 USD", other: "$120–230", rush: "+$25" },
    ],
    feeNote: "仅供参考，请以当地中国签证中心公布的价格为准。",
  },
  entry: {
    title: "入境注意事项",
    docsTitle: "随身文件",
    docs: [
      "有效护照（6 个月以上有效期）。",
      "有效签证或符合免签条件的证明。",
      "往返机票行程单（建议打印）。",
      "酒店预订确认函（建议打印）。",
      "海关健康申报（部分情况下需提前填写）。",
    ],
    customsTitle: "需向海关申报",
    customs: [
      "超过 5000 美元等值外币现金。",
      "个人贵重物品（如相机、笔记本）价值超过 ¥5,000。",
      "超出免税额度的烟酒（香烟 400 支 / 雪茄 100 支 / 酒精 1.5 升以内）。",
      "动植物产品、新鲜水果、肉类（通常禁止）。",
      "含敏感内容的印刷品和音像制品。",
    ],
    forbidden:
      "严禁携带：毒品、武器弹药、反动宣传品、受保护野生动植物及其制品、未经检疫的水果 / 肉类 / 蛋类。违者将面临严厉处罚甚至刑事责任。",
    extendTitle: "延长签证 / 免签停留期",
    extend: [
      "至少提前 7 天向居住地公安局出入境管理部门申请。",
      "提交护照、签证 / 入境章页复印件及延期原因说明。",
      "提供相关证明（如医院诊断书、不可抗力证明等）。",
      "等待 3–5 个工作日审批。",
      "获批后获得新的停留许可。",
    ],
    overstay:
      "切勿逾期滞留！超期将面临每日 ¥500（上限 ¥10,000）罚款、拘留、遣返及未来禁止入境等严重后果。",
  },
};

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

export function VisaGuide({ trigger }: { trigger: ReactNode }) {
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
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.types.title}</h3>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      {c.types.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.types.rows.map((r) => (
                      <tr key={r.code} className="border-t">
                        <td className="px-3 py-2 font-semibold text-primary">{r.code}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.stay}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.who}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />
            <section className="space-y-5">
              <h3 className="text-lg font-bold text-foreground">{c.visaFree.title}</h3>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.visaFree.unilateralTitle}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.visaFree.unilateralDesc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.visaFree.unilateralCountries.map((x) => (
                    <span key={x} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{x}</span>
                  ))}
                </div>
                <p className="mt-3 rounded-md border-l-2 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  ⚠️ {c.visaFree.unilateralWarn}
                </p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.visaFree.mutualTitle}</h4>
                <div className="mt-3 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <tbody>
                      {c.visaFree.mutualRows.map((r) => (
                        <tr key={r.country} className="border-t first:border-t-0">
                          <td className="px-3 py-2 font-medium text-foreground">{r.country}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.stay}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{r.note ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">
                  💡 {c.visaFree.updateNote}
                </p>
              </div>
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.transit.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.transit.what}</p>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.transit.conditionsTitle}</h4>
                <NumberedList items={c.transit.conditions} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.transit.countriesTitle}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.transit.countries}</p>
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.transit.portsTitle}</h4>
                <div className="mt-3 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        {c.transit.portsHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.transit.portRows.map((r) => (
                        <tr key={r.region} className="border-t">
                          <td className="px-3 py-2 font-medium text-foreground">{r.region}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.ports}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.area}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">
                💡 {c.transit.tip}
              </p>
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.apply.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.apply.intro}</p>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.apply.docsTitle}</h4>
                <BulletList items={c.apply.docs} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.apply.processTitle}</h4>
                <NumberedList items={c.apply.process} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.apply.feesTitle}</h4>
                <div className="mt-3 overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        {c.apply.feesHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.apply.feeRows.map((r) => (
                        <tr key={r.type} className="border-t">
                          <td className="px-3 py-2 font-medium text-foreground">{r.type}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.us}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.ca}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.other}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.rush}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{c.apply.feeNote}</p>
              </div>
            </section>

            <Separator />
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{c.entry.title}</h3>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.entry.docsTitle}</h4>
                <BulletList items={c.entry.docs} />
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.entry.customsTitle}</h4>
                <BulletList items={c.entry.customs} />
              </div>

              <p className="rounded-md border-l-2 border-destructive bg-destructive/10 p-3 text-xs text-destructive">
                ⛔ {c.entry.forbidden}
              </p>

              <div>
                <h4 className="text-base font-semibold text-foreground">{c.entry.extendTitle}</h4>
                <NumberedList items={c.entry.extend} />
              </div>

              <p className="rounded-md border-l-2 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                ⚠️ {c.entry.overstay}
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
