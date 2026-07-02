import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { ALL_CITIES, CITY_LABELS_ZH, type CityKey } from "@/lib/china-geo";

// 从数据源动态生成城市选项（中文名）
const CITY_OPTIONS: string[] = ALL_CITIES.map((ck) => CITY_LABELS_ZH[ck as CityKey]);

// 问题配置数据
const STEPS = [
  {
    id: 1,
    question: "你计划在中国待几天？",
    field: "days" as const,
    options: ["1-2天", "3-4天", "5-7天", "8-10天", "10天以上"],
  },
  {
    id: 2,
    question: "你和谁一起旅行？",
    field: "companions" as const,
    options: ["独自旅行", "情侣/夫妻", "朋友结伴", "家庭出游", "亲子旅行"],
  },
  {
    id: 3,
    question: "你对哪些旅行体验感兴趣？（可多选）",
    field: "preferences" as const,
    options: [
      "历史古都",
      "自然山水",
      "美食城市",
      "现代都市",
      "古镇水乡",
      "宗教文化",
    ],
    multiSelect: true,
  },
  {
    id: 4,
    question: "你偏好什么样的旅行节奏？",
    field: "pace" as const,
    options: ["轻松悠闲", "适中平衡", "紧凑充实", "挑战极限"],
  },
  {
    id: 5,
    question: "你的旅行预算范围是？（每人每天）",
    field: "budget" as const,
    options: ["500元以下", "500-1000元", "1000-2000元", "2000-3000元", "3000元以上"],
  },
  {
    id: 6,
    question: "有明确想去的城市吗？",
    field: "destination" as const,
    isDropdown: true,
  },
];

const TOTAL_STEPS = STEPS.length;

interface PlannerData {
  days: string;
  companions: string;
  preferences: string[];
  pace: string;
  budget: string;
  destination: string[];
}

const defaultData: PlannerData = {
  days: "",
  companions: "",
  preferences: [],
  pace: "",
  budget: "",
  destination: [],
};

export function TripPlanner() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PlannerData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);

  // 城市搜索相关状态
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // 根据搜索词过滤城市 + 兜底选项
  const filteredCityOptions = useMemo(() => {
    const allOptions = [...CITY_OPTIONS, "还没有明确想法，请推荐"];
    if (!citySearch.trim()) return allOptions;
    const q = citySearch.trim().toLowerCase();
    const filtered = CITY_OPTIONS.filter((c) => c.toLowerCase().includes(q));
    // 如果搜索词精确匹配已有城市，只显示匹配结果；否则追加"其他"选项
    if (filtered.length === 0 || !filtered.some((c) => c === citySearch.trim())) {
      return [...filtered, `其他：${citySearch.trim()}`];
    }
    return filtered;
  }, [citySearch]);

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  // 检查当前步骤是否已选择
  const isSelected = useCallback(() => {
    const value = data[step.field];
    if (step.field === "preferences" || step.field === "destination") {
      return (value as string[]).length > 0;
    }
    return value !== "";
  }, [data, step.field]);

  // 处理选项选择
  const handleSelect = useCallback(
    (option: string) => {
      setData((prev) => {
        if (step.field === "preferences") {
          const current = prev.preferences;
          const updated = current.includes(option)
            ? current.filter((item) => item !== option)
            : [...current, option];
          return { ...prev, preferences: updated };
        }
        return { ...prev, [step.field]: option };
      });
    },
    [step.field]
  );



  // 下一步
  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 最后一步，显示加载并跳转
      setIsLoading(true);
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set("days", data.days);
        params.set("companions", data.companions);
        params.set("preferences", JSON.stringify(data.preferences));
        params.set("pace", data.pace);
        params.set("budget", data.budget);
        params.set("destination", JSON.stringify(data.destination));
        navigate({ to: `/itinerary?${params.toString()}` });
      }, 3000);
    }
  }, [currentStep, data, navigate]);

  // 上一步
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // 获取当前步骤的选中状态
  const getSelectedState = (option: string) => {
    const value = data[step.field];
    if (Array.isArray(value)) {
      return value.includes(option);
    }
    return value === option;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6">
          {/* 旋转加载动画 */}
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">
            正在为你定制最优行程...
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-4 rounded-lg border-2 border-primary bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
          >
            返回主页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {/* 左上角返回主页 */}
      <button
        onClick={() => navigate({ to: "/" })}
        className="absolute left-6 top-6 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回主页
      </button>

      <div className="w-full max-w-[640px]">
        {/* 标题 */}
        <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          定制你的专属中国之旅
        </h1>

        {/* 进度条 */}
        <div className="mb-2">
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 步骤文案 */}
        <p className="mb-8 text-center text-sm text-muted-foreground">
          第{currentStep + 1}步/共{TOTAL_STEPS}步：
          {step.field === "days" && "旅行天数"}
          {step.field === "companions" && "同行人员"}
          {step.field === "preferences" && "目的地偏好"}
          {step.field === "pace" && "旅行节奏"}
          {step.field === "budget" && "预算范围"}
          {step.field === "destination" && "明确城市"}
        </p>

        {/* 问题 */}
        <h2 className="mb-6 text-center text-xl font-semibold text-foreground sm:text-2xl">
          {step.question}
        </h2>

        {/* 选项区域 */}
        <div className="mb-10">
          {/* 搜索式城市选择（问题6） */}
          {step.isDropdown ? (
            <div className="mx-auto max-w-md" ref={cityDropdownRef}>
              {/* 已选城市标签 */}
              {data.destination.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {data.destination.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-sm text-primary"
                    >
                      {city}
                      <button
                        type="button"
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            destination: prev.destination.filter((d) => d !== city),
                          }));
                        }}
                        className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/20 hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* 搜索输入框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  ref={cityInputRef}
                  type="text"
                  placeholder="输入城市名称搜索或手动输入..."
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setCityDropdownOpen(true);
                  }}
                  onFocus={() => setCityDropdownOpen(true)}
                  className="h-14 w-full cursor-text rounded-lg border-2 border-border bg-white pl-10 pr-4 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setCityDropdownOpen((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* 下拉选项列表 */}
              {cityDropdownOpen && (
                <div className="absolute z-50 mt-1 w-[calc(100%-2rem)] max-w-md max-h-64 overflow-y-auto rounded-lg border-2 border-border bg-white shadow-xl">
                  {/* 清空全部 */}
                  {data.destination.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setData((prev) => ({ ...prev, destination: [] }));
                        setCitySearch("");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors border-b border-border/50"
                    >
                      清除全部已选
                    </button>
                  )}
                  {filteredCityOptions.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      未找到匹配城市，请尝试其他关键词
                    </div>
                  ) : (
                    filteredCityOptions.map((opt, idx) => {
                      const isCustom = opt.startsWith("其他：");
                      const isSelected = data.destination.includes(opt);
                      const isRecommend = opt === "还没有明确想法，请推荐";
                      return (
                        <button
                          key={`${opt}-${idx}`}
                          type="button"
                          onClick={() => {
                            if (isRecommend || isCustom) {
                              // 特殊选项：单选并关闭
                              setData((prev) => ({ ...prev, destination: [opt] }));
                              setCitySearch(isRecommend || isCustom ? opt : "");
                              setCityDropdownOpen(false);
                            } else {
                              // 普通城市：多选切换
                              setData((prev) => {
                                // 如果当前只有特殊选项，先清空
                                if (
                                  prev.destination.length === 1 &&
                                  (prev.destination[0] === "还没有明确想法，请推荐" ||
                                    prev.destination[0].startsWith("其他："))
                                ) {
                                  return { ...prev, destination: [opt] };
                                }
                                const updated = prev.destination.includes(opt)
                                  ? prev.destination.filter((d) => d !== opt)
                                  : [...prev.destination, opt];
                                return { ...prev, destination: updated };
                              });
                              // 保持搜索框为空，方便继续搜索
                              setCitySearch("");
                            }
                          }}
                          className={`flex w-full items-center px-4 py-2.5 text-left text-base transition-colors ${
                            isSelected
                              ? "bg-primary/10 text-primary font-semibold"
                              : isCustom
                                ? "text-primary hover:bg-primary/5 italic"
                                : isRecommend
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {/* 复选框（仅普通城市） */}
                          {!isRecommend && !isCustom && (
                            <span
                              className={`mr-3 inline-flex h-4 w-4 items-center justify-center rounded border ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted bg-white"
                              }`}
                            >
                              {isSelected && "✓"}
                            </span>
                          )}
                          {isCustom && (
                            <span className="inline-block mr-1.5 text-xs bg-primary/10 rounded px-1.5 py-0.5 align-middle">
                              自定义
                            </span>
                          )}
                          {opt}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ) : (
            /* 卡片选项 */
            <div
              className={`grid gap-3 ${
                step.options.length <= 4
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {step.options.map((option) => {
                const isActive = getSelectedState(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`rounded-lg border-2 px-6 py-4 text-left text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    {option}
                    {/* 多选标记 */}
                    {step.multiSelect && (
                      <span
                        className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded border-2 text-xs ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-white"
                        }`}
                      >
                        {isActive && "✓"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between gap-4">
          {/* 上一步 */}
          <button
            onClick={handlePrev}
            className={`h-12 rounded-lg border-2 border-primary bg-white px-8 text-base font-semibold text-primary transition-all hover:bg-primary/5 ${
              currentStep === 0 ? "invisible" : ""
            }`}
          >
            上一步
          </button>

          {/* 下一步 / 生成行程 */}
          <button
            onClick={handleNext}
            disabled={!isSelected()}
            className={`h-12 rounded-lg px-8 text-base font-semibold transition-all ${
              isSelected()
                ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {currentStep === TOTAL_STEPS - 1 ? "生成我的专属行程" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
}
