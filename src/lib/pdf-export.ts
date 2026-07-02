/**
 * PDF 导出增强模块 —— 共享的行程 PDF 导出功能
 * 支持地图嵌入、精美排版、城市分组等
 */

import type { ItineraryResult, UserParams } from "./itinerary/types";

// ==================== 类型 ====================

export interface PdfExportOptions {
  title?: string;
  subtitle?: string;
  showMap?: boolean;
  showTips?: boolean;
}

// ==================== 地图相关（可选） ====================

/** 生成静态地图 URL（简化版，不依赖外部服务） */
export function getStaticMapUrl(cityKey: string, attractionIndices: number[]): string | null {
  // 这里可以接入真实的地图服务
  // 目前返回 null，让 PDF 不显示地图
  return null;
}

/** 加载图片为 base64 */
export async function loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ==================== HTML 构建 ====================

/** 构建增强版 PDF 导出 HTML */
export function buildEnhancedPdfHtml(
  itinerary: ItineraryResult,
  userParams: UserParams,
  options: PdfExportOptions = {}
): string {
  const { title = "你的专属行程", showTips = true } = options;
  const citiesStr = itinerary.cities.join(" → ");
  const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

  // 城市提示语
  const tipMap: Record<string, string> = {
    "北京": "💡 北京景点人流量大，建议8点前出门避开高峰。故宫需提前预约门票！",
    "上海": "💡 外滩最适合黄昏时分，白天看建筑，晚上看灯光秀。",
    "西安": "💡 兵马俑距市区约1小时车程，建议安排半天。回民街晚上最热闹！",
    "南京": "💡 夫子庙秦淮河夜景最美，建议晚上乘船游览。",
    "苏州": "💡 园林早上7:30开门，早去可拍到无人绝美照片。",
    "杭州": "💡 西湖环湖约15公里，租辆自行车是最佳游览方式。",
    "广州": "💡 早茶最好11点前去，广州人称之为「饮早茶」。",
    "成都": "💡 大熊猫8-10点最活跃，一定要赶早去看喂食！",
    "武汉": "💡 热干面是武汉灵魂早餐，户部巷早上最地道。",
    "长沙": "💡 橘子洲头灯光秀每晚8点开始，别错过！",
    "延吉": "💡 延吉是朝鲜族自治州首府，朝鲜族美食和民俗文化是最大特色！",
    "西宁": "💡 西宁海拔2261米，初到高原避免剧烈运动，多吃当地酸奶助适应。",
    "青海湖": "💡 青海湖海拔3200米，早晚温差极大，务必带厚外套。7月油菜花最美！",
    "茶卡盐湖": "💡 晴天+无风是最佳拍摄条件，建议穿亮色长裙，赤脚下湖注意盐粒扎脚。",
    "德令哈": "💡 海子诗中「姐姐，今夜我在德令哈」，小城安静适合休整补给。",
    "大柴旦": "💡 翡翠湖早晚光线最佳，无人机拍摄效果惊艳。南八仙无信号，提前下载离线地图。",
    "敦煌": "💡 莫高窟需提前预约门票，旺季一票难求！鸣沙山日落时分最美，建议下午4点后进入。",
    "嘉峪关": "💡 嘉峪关城楼+悬壁长城+第一墩可买联票更划算，全程约需大半天。",
    "张掖": "💡 七彩丹霞雨后颜色最艳丽，建议下午前往，日落时分光影最佳。",
    "兰州": "💡 一定要吃一碗正宗兰州牛肉面！正宁路夜市是美食天堂，牛奶鸡蛋醪糟必尝。",
  };

  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>GoChina 专属行程单</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif; background: #FFFBF5; color: #333; line-height: 1.7; }
    .cover { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 40px; page-break-after: always; }
    .cover-brand { color: #B45309; font-size: 13px; letter-spacing: 3px; margin-bottom: 50px; }
    .cover-line { width: 180px; height: 3px; background: #B45309; margin-bottom: 30px; border-radius: 2px; }
    .cover h1 { font-size: 42px; color: #1a1a1a; margin-bottom: 18px; font-weight: 300; letter-spacing: 2px; }
    .cover .route { font-size: 16px; color: #888; margin-bottom: 16px; }
    .cover .stats { font-size: 14px; color: #999; margin-bottom: 50px; }
    .cover .brand-card { background: #FCFAF7; border: 1px solid #E8E2D8; border-radius: 12px; padding: 20px 32px; }
    .cover .brand-card p { font-size: 14px; color: #666; }
    .cover .brand-card p:first-child { color: #B45309; font-weight: 600; margin-bottom: 4px; }
    .city-section { padding: 40px 48px; page-break-before: always; }
    .city-line { width: 50px; height: 3px; background: #B45309; margin-bottom: 12px; border-radius: 2px; }
    .city-section h2 { font-size: 32px; color: #1a1a1a; font-weight: 300; margin-bottom: 6px; }
    .city-meta { font-size: 13px; color: #999; margin-bottom: 20px; }
    .map-container { border: 1px solid #E8E2D8; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
    .map-container img { width: 100%; display: block; }
    .map-caption { font-size: 11px; color: #aaa; font-style: italic; margin-bottom: 24px; padding-left: 4px; }
    .day-card { background: #FCFAF7; border: 1px solid #E8E2D8; border-radius: 14px; margin-bottom: 20px; overflow: hidden; }
    .day-header { display: flex; align-items: center; gap: 14px; padding: 16px 20px; }
    .day-badge { width: 42px; height: 42px; background: #B45309; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex-shrink: 0; }
    .day-header-info h3 { font-size: 17px; color: #1a1a1a; margin-bottom: 2px; }
    .day-header-info span { font-size: 12px; color: #999; }
    .day-stamina { margin-left: auto; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap; }
    .day-body { padding: 0 20px 20px; }
    .day-divider { border: none; border-top: 1px dashed #E0D8CB; margin: 0 0 16px; }
    .time-label { font-size: 13px; font-weight: 700; color: #B45309; margin: 18px 0 10px; padding-bottom: 6px; border-bottom: 1px dotted #E8E2D8; }
    .attraction { display: flex; align-items: flex-start; margin-bottom: 10px; gap: 10px; }
    .att-num { flex-shrink: 0; width: 26px; height: 26px; background: #FEF3E2; color: #B45309; border-radius: 50%; text-align: center; line-height: 26px; font-size: 12px; font-weight: 700; }
    .att-info h4 { font-size: 14px; color: #333; margin-bottom: 2px; }
    .att-info .att-meta { font-size: 12px; color: #999; }
    .att-info .att-meta .free { color: #16A34A; font-weight: 600; }
    .meal-block { background: #FFF8F0; border-radius: 8px; padding: 10px 16px; margin: 12px 0; font-size: 13px; color: #777; }
    .day-footer { margin-top: 14px; padding-top: 12px; border-top: 1px solid #F0EBE4; font-size: 12px; color: #999; display: flex; gap: 24px; }
    .day-footer span strong { color: #666; }
    .tip-box { background: #FFFBF0; border-left: 4px solid #B45309; padding: 10px 16px; margin: 14px 0; border-radius: 0 8px 8px 0; font-size: 12px; color: #8B6914; }
    .page-footer { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 40px; background: #FFFBF5; page-break-before: always; }
    .page-footer h2 { font-size: 28px; color: #1a1a1a; font-weight: 300; margin-bottom: 24px; }
    .page-footer .tips-list { font-size: 13px; color: #666; line-height: 2.2; margin-bottom: 30px; }
    .page-footer .generated { font-size: 12px; color: #aaa; }
    @media print { body { background: #fff; } .day-card { page-break-inside: avoid; } }
  </style>
</head>
<body>
<div class="cover">
  <div class="cover-brand">GOCHINA GUIDE</div>
  <div class="cover-line"></div>
  <h1>${title}</h1>
  <p class="route">${citiesStr}</p>
  <p class="stats">${itinerary.days.length}天行程 · ${userParams.pace} · 全程约${itinerary.totalWalkingKm}公里步行</p>
  <div class="brand-card">
    <p>由 GoChina Guide 精心打造</p>
    <p>AI 智能规划 · 开启你的中国探索之旅</p>
  </div>
</div>
<div class="city-section">
  <div class="city-line"></div>
  <h2>行程概览</h2>
  <p class="city-meta">${dateStr} · ${userParams.days} · ${userParams.pace}节奏</p>
  <div style="display:flex;flex-wrap:wrap;gap:12px 32px;font-size:14px;color:#666;">
    <div><strong style="color:#B45309;">同行：</strong>${userParams.companions}</div>
    <div><strong style="color:#B45309;">预算：</strong>${userParams.budget}</div>
    <div><strong style="color:#B45309;">全程步行：</strong>约${itinerary.totalWalkingKm}公里</div>
    ${userParams.preferences.length > 0 ? `<div style="width:100%;margin-top:4px;"><strong style="color:#B45309;">偏好：</strong>${userParams.preferences.map((p: string) => `<span style="display:inline-block;background:#B45309;color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;margin-right:6px;">${p}</span>`).join('')}</div>` : ''}
  </div>
</div>
`;

  // ---- City sections ----
  const cityGroups: Record<string, typeof itinerary.days> = {};
  for (const day of itinerary.days) {
    if (!cityGroups[day.cityName]) cityGroups[day.cityName] = [];
    cityGroups[day.cityName].push(day);
  }

  for (const [cityName, cityDays] of Object.entries(cityGroups)) {
    const dayNums = cityDays.map(d => d.day).join(", ");
    const attCount = cityDays.reduce((s, d) => s + d.morning.length + d.afternoon.length + d.evening.length, 0);

    html += `
<div class="city-section">
  <div class="city-line"></div>
  <h2>${cityName}</h2>
  <p class="city-meta">Day ${dayNums} · ${cityDays.length}天 · ${attCount}个景点</p>
`;

    for (const day of cityDays) {
      const allItems = [...day.morning, ...day.afternoon, ...day.evening];
      const totalHours = allItems.reduce((s, i) => s + (i.duration || 2), 0);
      const dayTotal = totalHours + (allItems.length * 30) / 60 + 2.5;
      const sc = day.walkingKm > 8 ? "#DC2626" : day.walkingKm > 5 ? "#D97706" : "#16A34A";
      const sl = day.walkingKm > 8 ? "高强度" : day.walkingKm > 5 ? "适中" : "轻松";

      html += `
  <div class="day-card">
    <div class="day-header">
      <div class="day-badge">D${day.day}</div>
      <div class="day-header-info">
        <h3>${day.cityName} · ${day.area}</h3>
        <span>步行约${day.walkingKm}公里 · 约${Math.round(dayTotal)}小时</span>
      </div>
      <div class="day-stamina" style="background:${sc};">${sl}</div>
    </div>
    <div class="day-body"><hr class="day-divider">
`;

      const renderSlot = (label: string, items: typeof day.morning, emoji: string) => {
        if (!items.length) return '';
        let s = `<div class="time-label">${emoji} ${label}</div>`;
        items.forEach((it, idx) => {
          s += `
      <div class="attraction">
        <div class="att-num">${idx + 1}</div>
        <div class="att-info">
          <h4>${it.name}</h4>
          <div class="att-meta">建议游玩 ${it.duration}小时${it.ticketPrice > 0 ? ` · 参考门票 ¥${it.ticketPrice}` : ' · <span class="free">免费</span>'}</div>
        </div>
      </div>`;
        });
        return s;
      };

      html += renderSlot("上午", day.morning, "☀️");
      if (day.morning.length) html += `<div class="meal-block">🍽️ 午餐 · 约1小时 — 推荐当地特色美食</div>`;
      html += renderSlot("下午", day.afternoon, "🌤️");
      if (day.afternoon.length) html += `<div class="meal-block">🍽️ 晚餐 · 约1小时 — 享受美食，补充能量</div>`;
      html += renderSlot("晚上", day.evening, "🌙");

      html += `
      <div class="day-footer">
        <span><strong>交通：</strong>${day.transport}</span>
        <span><strong>住宿：</strong>${day.accommodation}</span>
      </div>
    </div>
  </div>
`;
    }

    const tip = tipMap[cityName] || "💡 出发前请查看景点开放时间，部分景点周一闭馆。";
    html += `  <div class="tip-box">${tip}</div>\n</div>\n`;
  }

  if (showTips) {
    html += `
<div class="page-footer">
  <h2>准备好出发了吗？</h2>
  <div class="tips-list">
    <p>📱 下载离线地图（Google Maps 在中国不可用）</p>
    <p>🛂 随身携带护照，酒店入住和火车票需要</p>
    <p>📶 购买本地 SIM 卡或 eSIM 方便上网</p>
    <p>💳 大部分景点支持微信支付/支付宝</p>
  </div>
  <p class="generated">由 GoChina Guide 生成 · ${dateStr} · 行程仅供参考</p>
</div>
`;
  }

  html += `</body></html>`;
  return html;
}

// ==================== 导出执行 ====================

/** 执行 PDF 导出 */
export async function exportItineraryToPdf(
  itinerary: ItineraryResult,
  userParams: UserParams,
  options: PdfExportOptions = {}
): Promise<void> {
  const html = buildEnhancedPdfHtml(itinerary, userParams, options);
  const printWindow = window.open("", "_blank");
  
  if (!printWindow) {
    throw new Error("请允许浏览器打开弹窗以导出 PDF");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
        resolve();
      } catch (err) {
        reject(err);
      }
    }, 600);
  });
}
