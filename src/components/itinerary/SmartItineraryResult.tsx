/**
 * 智能行程结果页 —— 通用化重构版
 * 支持评分展示、节奏切换、行程编辑、PDF导出
 */

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  type ItineraryResult as SmartItineraryResult,
  type UserParams,
  type DayItinerary,
} from "@/lib/itinerary";
import { generateAiItinerary } from "@/lib/api/generate-itinerary.functions";
import { exportItineraryToPdf } from "@/lib/pdf-export";
import {
  Clock, Ticket, Hotel, RotateCcw, Calendar, Users, Heart, Zap, Wallet,
  MapPin, Footprints, Sun, Moon, Coffee, Utensils, Download, Home,
  AlertTriangle, Sparkles, Bot,
} from "lucide-react";

// ==================== 类型 ====================

interface SearchParams {
  days?: string;
  companions?: string;
  preferences?: string;
  pace?: string;
  budget?: string;
  destination?: string;
}

// ==================== 工具函数 ====================

/** 安全地将 search param 值转为字符串数组（处理 Router 自动解析的情况） */
function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

/** 安全地将 destination search param 转为字符串数组 */
function normalizeDestination(value: unknown): string[] {
  const fallback = ["还没有明确想法，请推荐"];
  if (Array.isArray(value)) {
    return value.length > 0 ? value.filter((v): v is string => typeof v === "string") : fallback;
  }
  if (typeof value === "string") {
    if (!value) return fallback;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
      return [value];
    } catch {
      return [value];
    }
  }
  return fallback;
}

// ==================== 组件 ====================

export function SmartItineraryResult() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/itinerary" }) as SearchParams;
  const contentRef = useRef<HTMLDivElement>(null);

  const [itinerary, setItinerary] = useState<SmartItineraryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // TanStack Router 会自动解析 search params 中的 JSON 数组
  // 所以 search.destination / search.preferences 可能已经是数组，不需要再次 JSON.parse
  const userParams: UserParams = useMemo(() => ({
    days: search.days || "3-4天",
    companions: (search.companions || "独自旅行") as any,
    preferences: normalizeStringArray(search.preferences),
    pace: (search.pace || "适中平衡") as any,
    budget: search.budget || "1000-2000元",
    destination: normalizeDestination(search.destination),
  }), [search.days, search.companions, search.preferences, search.pace, search.budget, search.destination]);

  // 生成行程（AI 智能生成）
  const regenerate = useCallback(async (params: UserParams) => {
    setLoading(true);
    setAiError(null);

    try {
      const aiResult = await generateAiItinerary({ data: params });
      setItinerary(aiResult);
    } catch (err: any) {
      console.error("[AI Itinerary] Failed:", err.message);
      setAiError(err.message || "AI 生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    regenerate(userParams);
  }, [userParams, regenerate]);

  // 导航
  const handleRestart = () => navigate({ to: "/planner" });
  const handleGoHome = () => navigate({ to: "/" });

  // PDF 导出 —— 使用增强版
  const handleExportPdf = async () => {
    if (!itinerary || exporting) return;
    setExporting(true);
    try {
      await exportItineraryToPdf(itinerary, userParams, {
        title: "你的专属行程",
        showTips: true,
      });
    } catch (err) {
      console.error("PDF 导出失败:", err);
      alert("PDF 导出失败，请稍后重试");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-lg font-medium text-foreground">AI 正在为你智能定制最优行程...</p>
          <p className="text-sm text-muted-foreground">分析偏好、匹配景点、优化路线中</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    // 如果有错误信息，显示错误界面而非空白页
    if (aiError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
          <div className="flex max-w-md flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">行程生成失败</h2>
              <p className="mt-2 text-sm text-muted-foreground">{aiError}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => regenerate(userParams)}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                重试
              </button>
              <button
                onClick={handleGoHome}
                className="rounded-lg border-2 border-muted bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/30"
              >
                返回主页
              </button>
            </div>
          </div>
        </div>
      );
    }
    // 理论上不会走到这里（除非 loading 刚结束且无错误），但保留 null 作为兜底
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-8 sm:py-12">
      <div ref={contentRef} className="mx-auto max-w-[800px]">
        {/* 顶部标题 */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              你的专属行程
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              AI 智能生成
            </span>
          </div>
          <p className="text-muted-foreground">
            {itinerary.cities.join(" → ")} · {itinerary.days.length}天 · {userParams.pace}
          </p>
          {aiError && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              {aiError}
            </div>
          )}
        </div>

        {/* 用户信息摘要 */}
        <div className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <SummaryItem icon={<Calendar className="h-4 w-4 text-primary" />} label="天数" value={userParams.days} />
            <SummaryItem icon={<Users className="h-4 w-4 text-primary" />} label="同行" value={userParams.companions} />
            <SummaryItem icon={<Zap className="h-4 w-4 text-primary" />} label="节奏" value={userParams.pace} />
            <SummaryItem icon={<Wallet className="h-4 w-4 text-primary" />} label="预算" value={userParams.budget} />
            <SummaryItem icon={<Footprints className="h-4 w-4 text-primary" />} label="全程步行" value={`约${itinerary.totalWalkingKm}公里`} />
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

// ==================== 子组件 ====================

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{label}：</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function DayCard({ day }: { day: DayItinerary }) {
  const allItems = [...day.morning, ...day.afternoon, ...day.evening];
  const totalHours = allItems.reduce((s, a) => s + a.duration, 0);
  const transitCount = Math.max(0, allItems.length - 1);
  const transitHours = transitCount * 0.5;
  const totalWithTransit = totalHours + transitHours + 1.5 + 1.0 + 0.5; // +午餐+晚餐+缓冲

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
              <h3 className="text-base font-semibold text-foreground">{day.cityName}</h3>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{day.area}</span>
            </div>
            <p className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Footprints className="h-3 w-3" />
                当日步行约{day.walkingKm}公里
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                约{Math.round(totalWithTransit)}小时
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 行程内容 */}
      <div className="p-6">
        <div className="space-y-4">
          {day.morning.length > 0 && (
            <TimeBlock label="上午" icon={<Sun className="h-4 w-4" />} color="bg-amber-50 text-amber-700 border-amber-200" items={day.morning} />
          )}

          <MealBlock label="午餐" duration="1小时" note="推荐品尝当地特色美食，顺便休息恢复体力" color="orange" />

          {day.afternoon.length > 0 && (
            <TimeBlock label="下午" icon={<Coffee className="h-4 w-4" />} color="bg-blue-50 text-blue-700 border-blue-200" items={day.afternoon} />
          )}

          <MealBlock label="晚餐" duration="1小时" note="享受当地美食，补充能量" color="purple" />

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

function TimeBlock({
  label,
  icon,
  color,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  items: { id: string; name: string; type: string; duration: number; intensity: number; ticketPrice: number }[];
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
          key={item.id || index}
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
                建议游玩 {item.duration}小时
              </span>
              {item.ticketPrice > 0 ? (
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  参考门票 {item.ticketPrice}元
                </span>
              ) : (
                <span className="text-green-600">免费</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MealBlock({ label, duration, note, color }: { label: string; duration: string; note: string; color: string }) {
  const bgMap: Record<string, string> = {
    orange: "border-orange-200 bg-orange-50/40",
    purple: "border-purple-200 bg-purple-50/40",
  };
  const iconMap: Record<string, string> = {
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-dashed px-4 py-3 ${bgMap[color] || bgMap.orange}`}>
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconMap[color] || iconMap.orange}`}>
        <Utensils className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label} · {duration}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}


