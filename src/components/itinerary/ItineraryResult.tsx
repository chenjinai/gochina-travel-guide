import { useEffect, useState, useRef, useCallback } from "react";
import { useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { generateItinerary, type ItineraryResult, type UserParams } from "@/lib/itinerary-engine";
import { Clock, Ticket, Hotel, RotateCcw, Calendar, Users, Heart, Zap, Wallet, MapPin, Footprints, Sun, Moon, Coffee, Utensils, Download, Home, Loader2 } from "lucide-react";
import { getStaticMapUrl, loadImageAsBase64 } from "@/lib/pdf-utils";
import type { CityKey } from "@/lib/china-geo";
import { CITY_LABELS_ZH, CITY_LABELS_EN } from "@/lib/china-geo";

interface SearchParams {
  days?: string;
  companions?: string;
  preferences?: string;
  pace?: string;
  budget?: string;
  destination?: string;
}

export function ItineraryResult() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/itinerary" }) as SearchParams;
  const contentRef = useRef<HTMLDivElement>(null);

  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const userParams: UserParams = {
    days: search.days || "3-4天",
    companions: search.companions || "独自旅行",
    preferences: (() => {
      try { return JSON.parse(search.preferences || "[]"); } catch { return []; }
    })(),
    pace: search.pace || "适中平衡",
    budget: search.budget || "1000-2000元",
    destination: search.destination || "还没有明确想法，请推荐",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = generateItinerary(userParams);
      setItinerary(result);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => navigate({ to: "/planner" });
  const handleGoHome = () => navigate({ to: "/" });

  // ---------- Resolve city string to CityKey ----------
  const resolveCityKey = useCallback((cityStr: string): CityKey | null => {
    for (const [key, label] of Object.entries(CITY_LABELS_EN)) {
      if (label.toLowerCase() === cityStr.toLowerCase()) return key as CityKey;
    }
    for (const [key, label] of Object.entries(CITY_LABELS_ZH)) {
      if (label === cityStr) return key as CityKey;
    }
    return null;
  }, []);

  /** 导出为 PDF —— 增强版：含城市景点分布地图 + 精美排版 */
  const handleExportPdf = useCallback(async () => {
    if (!itinerary || exporting) return;
    setExporting(true);

    try {
      // ---- Step 1: Preload city map images ----
      const cityMapImages: Record<string, string> = {};
      const { CITY_MAPS } = await import("@/lib/city-maps-data");

      for (const day of itinerary.days) {
        if (cityMapImages[day.city] !== undefined) continue;
        const cityKey = resolveCityKey(day.city);
        if (!cityKey) { cityMapImages[day.city] = ""; continue; }

        const cityData = CITY_MAPS[cityKey];
        if (!cityData) { cityMapImages[day.city] = ""; continue; }

        const allNames = itinerary.days
          .filter(d => d.city === day.city)
          .flatMap(d => [...d.morning, ...d.afternoon, ...d.evening].map(a => a.name));
        const uniqueNames = [...new Set(allNames)];

        const indices = uniqueNames
          .map(n => cityData.attractions.findIndex(a => a.name === n || a.name.includes(n) || n.includes(a.name)))
          .filter(i => i >= 0);

        if (indices.length > 0) {
          const mapUrl = getStaticMapUrl(cityKey, indices);
          if (mapUrl) {
            try { cityMapImages[day.city] = await loadImageAsBase64(mapUrl); }
            catch { cityMapImages[day.city] = ""; }
          } else { cityMapImages[day.city] = ""; }
        } else { cityMapImages[day.city] = ""; }
      }

      // ---- Step 2: Build HTML ----
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("请允许浏览器打开弹窗以导出 PDF");
        setExporting(false);
        return;
      }

      const citiesStr = itinerary.cities.join(" → ");
      const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

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
  <h1>你的专属行程</h1>
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
        if (!cityGroups[day.city]) cityGroups[day.city] = [];
        cityGroups[day.city].push(day);
      }

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
      };

      for (const [cityName, cityDays] of Object.entries(cityGroups)) {
        const dayNums = cityDays.map(d => d.day).join(", ");
        const attCount = cityDays.reduce((s, d) => s + d.morning.length + d.afternoon.length + d.evening.length, 0);

        html += `
<div class="city-section">
  <div class="city-line"></div>
  <h2>${cityName}</h2>
  <p class="city-meta">Day ${dayNums} · ${cityDays.length}天 · ${attCount}个景点</p>
`;

        if (cityMapImages[cityName]) {
          html += `
  <div class="map-container"><img src="${cityMapImages[cityName]}" alt="${cityName}景点分布地图" /></div>
  <p class="map-caption">📍 景点分布地图 — 直观了解每日景点位置与距离，便于合理取舍</p>
`;
        }

        for (const day of cityDays) {
          const allItems = [...day.morning, ...day.afternoon, ...day.evening];
          const totalHours = allItems.reduce((s, i) => s + (i.durationHour || 2), 0);
          const dayTotal = totalHours + (allItems.length * 30) / 60 + 2.5;
          const sc = day.walkingKm > 8 ? "#DC2626" : day.walkingKm > 5 ? "#D97706" : "#16A34A";
          const sl = day.walkingKm > 8 ? "高强度" : day.walkingKm > 5 ? "适中" : "轻松";

          html += `
  <div class="day-card">
    <div class="day-header">
      <div class="day-badge">D${day.day}</div>
      <div class="day-header-info">
        <h3>${day.city} · ${day.zone}</h3>
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
          <div class="att-meta">建议游玩 ${it.duration}${it.price > 0 ? ` · 参考门票 ¥${it.price}` : ` · <span class="free">免费</span>`}</div>
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
</body>
</html>`;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setExporting(false);
      }, 600);
    } catch (err) {
      console.error("PDF 导出失败:", err);
      alert("PDF 导出失败: " + (err instanceof Error ? err.message : String(err)));
      setExporting(false);
    }
  }, [itinerary, exporting, userParams, resolveCityKey]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">正在为你定制最优行程...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-8 sm:py-12">
      <div ref={contentRef} className="mx-auto max-w-[800px]">
        {/* 顶部标题 */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            你的专属行程
          </h1>
          <p className="text-muted-foreground">
            {itinerary.cities.join(" → ")} · {itinerary.days.length}天 · {userParams.pace}
          </p>
        </div>

        {/* 用户信息摘要 */}
        <div className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">天数：</span>
              <span className="font-medium">{userParams.days}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">同行：</span>
              <span className="font-medium">{userParams.companions}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">偏好：</span>
              <div className="flex flex-wrap gap-1">
                {userParams.preferences.map((pref) => (
                  <span key={pref} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">节奏：</span>
              <span className="font-medium">{userParams.pace}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">预算：</span>
              <span className="font-medium">{userParams.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">全程步行：</span>
              <span className="font-medium">约{itinerary.totalWalkingKm}公里</span>
            </div>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className={`flex items-center gap-2 rounded-lg border-2 px-5 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                exporting
                  ? "cursor-wait border-primary/50 bg-primary/70 text-primary-foreground/80"
                  : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <Download className={`h-4 w-4 ${exporting ? "animate-pulse" : ""}`} />
              {exporting ? "导出中..." : "导出行程 (PDF)"}
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 rounded-lg border-2 border-muted bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/30"
            >
              <Home className="h-4 w-4" />
              返回主页
            </button>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
          >
            <RotateCcw className="h-4 w-4" />
            重新规划
          </button>
        </div>

        {/* 行程卡片 */}
        <div className="space-y-6">
          {itinerary.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        {/* 底部 */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p className="mb-1">行程仅供参考，实际安排请根据天气、开放时间和个人情况调整</p>
          <p className="text-xs">步行距离为估算值，实际可能因交通方式和路线不同而有所差异</p>
        </div>
      </div>
    </div>
  );
}

/** 单天行程卡片 */
function DayCard({ day }: { day: NonNullable<ItineraryResult["days"][number]> }) {
  const walkingKm = parseFloat(day.walkingKm);
  const allItems = [...day.morning, ...day.afternoon, ...day.evening];
  const totalHours = allItems.reduce((s, i) => s + (i.durationHour || 2), 0);
  const transitCount = allItems.length;
  const transitMinutes = transitCount * 30; // 景点间各30分钟
  const totalWithTransit = totalHours + transitMinutes / 60 + 2.5; // 含午餐1h+晚餐1h+0.5h缓冲

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* 卡片头部 */}
      <div className="flex items-center justify-between bg-primary/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            D{day.day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{day.city}</h3>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{day.zone}</span>
            </div>
            <p className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Footprints className="h-3 w-3" />
                当日步行约{walkingKm}公里
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                约{Math.round(totalWithTransit)}小时
              </span>
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {day.dayLabel}
        </span>
      </div>

      {/* 行程内容 */}
      <div className="p-6">
        <div className="space-y-4">
          {/* 上午 */}
          {day.morning.length > 0 && (
            <TimeBlock label="上午" icon={<Sun className="h-4 w-4" />} color="bg-amber-50 text-amber-700 border-amber-200" items={day.morning} />
          )}

          {/* 午餐 */}
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-orange-200 bg-orange-50/40 px-4 py-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">午餐 · 1小时</p>
              <p className="text-xs text-muted-foreground">推荐品尝当地特色美食，顺便休息恢复体力</p>
            </div>
          </div>

          {/* 下午 */}
          {day.afternoon.length > 0 && (
            <TimeBlock label="下午" icon={<Coffee className="h-4 w-4" />} color="bg-blue-50 text-blue-700 border-blue-200" items={day.afternoon} />
          )}

          {/* 晚餐 */}
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-purple-200 bg-purple-50/40 px-4 py-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">晚餐 · 1小时</p>
              <p className="text-xs text-muted-foreground">享受当地美食，补充能量</p>
            </div>
          </div>

          {/* 晚上 */}
          {day.evening.length > 0 && (
            <TimeBlock label="晚上" icon={<Moon className="h-4 w-4" />} color="bg-indigo-50 text-indigo-700 border-indigo-200" items={day.evening} />
          )}
        </div>

        {/* 交通+住宿 */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">交通提示</p>
              <p className="text-sm text-foreground">{day.transport}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-2.5">
            <Hotel className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">住宿推荐</p>
              <p className="text-sm text-foreground">{day.accommodation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 时段资源块 */
function TimeBlock({
  label,
  icon,
  color,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  items: { name: string; duration: string; price: number }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${color.split(" ")[0]} ${color.split(" ")[1]}`}>
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-muted/20"
        >
          <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color}`}>
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                建议游玩 {item.duration}
              </span>
              {item.price > 0 && (
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  参考门票 {item.price}元
                </span>
              )}
              {item.price === 0 && <span className="text-green-600">免费</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
