import { useState, useEffect, lazy, Suspense } from "react";
import {
  Landmark,
  UtensilsCrossed,
  MapPin,
  Clock,
  Lightbulb,
  Heart,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePlanner } from "@/lib/planner";
import { useSearch } from "@/lib/search-context";
import { ATTRACTION_META, CATEGORY_LABELS, type AttractionCategory } from "@/lib/attractions-meta";
import {
  REGIONS,
  REGION_LABELS,
  PROVINCES,
  type CityKey,
  type RegionKey,
  type ProvinceKey,
} from "@/lib/china-geo";
import type { Lang } from "@/lib/i18n";

const UnifiedCityMap = lazy(() =>
  import("./UnifiedCityMap").then((m) => ({ default: m.UnifiedCityMap })),
);

// --- City images ---
import beijingImg from "@/assets/beijing.jpg";
import nanjingImg from "@/assets/nanjing.jpg";
import xianImg from "@/assets/xian.jpg";
import shanghaiImg from "@/assets/shanghai.jpg";
import zhangjiajieImg from "@/assets/zhangjiajie.jpg";
import hangzhouImg from "@/assets/hangzhou.jpg";
import guangzhouImg from "@/assets/guangzhou.jpg";
import chengduImg from "@/assets/chengdu.jpg";
import wuhanImg from "@/assets/wuhan.jpg";
import changshaImg from "@/assets/changsha.jpg";
import fuzhouImg from "@/assets/fuzhou.jpg";
import jinanImg from "@/assets/jinan.jpg";
import hefeiImg from "@/assets/hefei.jpg";
import nanchangImg from "@/assets/nanchang.jpg";
import nanningImg from "@/assets/nanning.jpg";
// 青甘大环线
import xiningImg from "@/assets/xining.jpg";
import qinghaihuImg from "@/assets/qinghaihu.jpg";
import chakaImg from "@/assets/chaka.jpg";
import delinghaImg from "@/assets/delingha.jpg";
import dachaidanImg from "@/assets/dachaidan.jpg";
import dunhuangImg from "@/assets/dunhuang.jpg";
import jiayuguanImg from "@/assets/jiayuguan.jpg";
import zhangyeImg from "@/assets/zhangye.jpg";
import lanzhouImg from "@/assets/lanzhou.jpg";

const CITY_IMAGES: Record<CityKey, string> = {
  beijing: beijingImg, nanjing: nanjingImg, xian: xianImg,
  shanghai: shanghaiImg, suzhou: hangzhouImg, zhangjiajie: zhangjiajieImg,
  hangzhou: hangzhouImg, guangzhou: guangzhouImg, chengdu: chengduImg,
  wuhan: wuhanImg, changsha: changshaImg,
  fuzhou: fuzhouImg, jinan: jinanImg, hefei: hefeiImg,
  nanchang: nanchangImg, nanning: nanningImg,
  dalian: shanghaiImg, shenyang: beijingImg, harbin: xianImg,
  daqing: jinanImg, changchun: nanjingImg, jilin: hefeiImg, yanji: changshaImg,
  // 青甘大环线
  xining: xiningImg, qinghaihu: qinghaihuImg, chaka: chakaImg,
  delingha: delinghaImg, dachaidan: dachaidanImg,
  dunhuang: dunhuangImg, jiayuguan: jiayuguanImg, zhangye: zhangyeImg, lanzhou: lanzhouImg,
  jiuzhaigou: zhangjiajieImg,
};

// --- Helpers to group cities by region ---
function getCitiesByRegion(region: RegionKey): CityKey[] {
  const result: CityKey[] = [];
  for (const pkey of Object.keys(PROVINCES) as ProvinceKey[]) {
    if (PROVINCES[pkey].region === region) {
      for (const city of PROVINCES[pkey].cities) {
        result.push(city as CityKey);
      }
    }
  }
  return result;
}

const regionCities: Record<RegionKey, CityKey[]> = Object.fromEntries(
  REGIONS.map((r) => [r, getCitiesByRegion(r)]),
) as Record<RegionKey, CityKey[]>;

// --- Component ---
export function Destinations() {
  const { t, lang } = useLanguage();
  const { has, toggle } = usePlanner();
  const { searchTarget, setSearchTarget } = useSearch();

  const [activeRegion, setActiveRegion] = useState<RegionKey>("east");
  const [active, setActive] = useState<CityKey>("shanghai");
  const [categoryFilter, setCategoryFilter] = useState<AttractionCategory | "all">("all");
  const [showAllAttractions, setShowAllAttractions] = useState(false);

  // Reset category filter & expand state when city changes
  useEffect(() => {
    setCategoryFilter("all");
    setShowAllAttractions(false);
  }, [active]);

  // Respond to Hero search navigation
  useEffect(() => {
    if (searchTarget) {
      setActive(searchTarget);
      for (const [rkey, cities] of Object.entries(regionCities)) {
        if (cities.includes(searchTarget)) {
          setActiveRegion(rkey as RegionKey);
          break;
        }
      }
      setSearchTarget(null);
    }
  }, [searchTarget, setSearchTarget]);

  // Listen for navbar dropdown city selection
  useEffect(() => {
    const handler = (e: Event) => {
      const city = (e as CustomEvent<CityKey>).detail;
      if (city) {
        setActive(city);
        for (const [rkey, cities] of Object.entries(regionCities)) {
          if (cities.includes(city)) {
            setActiveRegion(rkey as RegionKey);
            break;
          }
        }
      }
    };
    window.addEventListener("gochina:select-city", handler);
    return () => window.removeEventListener("gochina:select-city", handler);
  }, []);

  // Listen for unified map city-dot clicks
  useEffect(() => {
    const handler = (e: Event) => {
      const city = (e as CustomEvent<CityKey>).detail;
      if (city) {
        setActive(city);
        for (const [rkey, cities] of Object.entries(regionCities)) {
          if (cities.includes(city)) {
            setActiveRegion(rkey as RegionKey);
            break;
          }
        }
      }
    };
    window.addEventListener("gochina:unified-map-city-clicked", handler);
    return () => window.removeEventListener("gochina:unified-map-city-clicked", handler);
  }, []);

  const city = t.destinations.cities[active];
  const currentCities = regionCities[activeRegion];

  // Scroll to city detail helper
  const scrollToCityDetail = () => {
    setTimeout(() => {
      const el = document.getElementById("city-detail");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <section id="destinations" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.destinations.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.destinations.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.destinations.subtitle}
          </p>
        </div>

        {/* === Unified City & Attractions Map === */}
        <div className="mb-12">
          <Suspense fallback={
            <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
              <div className="h-[380px] sm:h-[460px] flex items-center justify-center text-sm text-muted-foreground">
                Loading map…
              </div>
            </div>
          }>
            <UnifiedCityMap
              city={active}
              cityName={city.name}
              region={activeRegion}
              lang={lang as Lang}
            />
          </Suspense>
        </div>

        {/* === Region Tabs === */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {REGIONS.map((rkey) => {
            const cities = regionCities[rkey];
            if (cities.length === 0) return null;
            const label = REGION_LABELS[rkey][lang as Lang];
            return (
              <button
                key={rkey}
                onClick={() => {
                  setActiveRegion(rkey);
                  if (cities.length > 0) setActive(cities[0]);
                }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                  activeRegion === rkey
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-foreground hover:bg-accent",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* === City Grid (within active region) === */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {currentCities.map((ckey) => {
            const cityData = t.destinations.cities[ckey];
            return (
              <button
                key={ckey}
                onClick={() => setActive(ckey)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-2 transition-all duration-200",
                  active === ckey
                    ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                    : "border-border hover:border-primary/50 hover:shadow-md",
                )}
              >
                <div className="relative h-24 sm:h-28">
                  <img
                    src={CITY_IMAGES[ckey]}
                    alt={cityData.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                    <p className="text-sm font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-base">
                      {cityData.name}
                    </p>
                    <ChevronDown
                      className={cn(
                        "absolute bottom-2 right-2 size-4 text-primary transition-transform",
                        active === ckey && "rotate-180",
                      )}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* === Selected City Detail === */}
        <div id="city-detail" className="mb-10 overflow-hidden rounded-3xl bg-card shadow-md scroll-mt-24">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <img
                src={CITY_IMAGES[active]}
                alt={city.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 sm:p-10">
              <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">{city.region}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{city.name}</h3>
              <p className="mt-1 text-base font-medium text-primary">{city.tagline}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{city.intro}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{t.destinations.recommended}: {city.duration}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Lightbulb className="size-4" />
                  <span>{t.destinations.bestTime}: {city.bestTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attractions + Foods */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Attractions */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Landmark className="size-5" />
              </div>
              <h4 className="text-xl font-bold text-foreground">{t.destinations.attractionsTitle}</h4>
              <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {city.attractions.length}
              </span>
            </div>

            {/* Category Filter Chips */}
            {(() => {
              const allAttractions = city.attractions as ReadonlyArray<{ name: string; desc: string; tip?: string }>;
              // Only show filters when there are enough attractions
              if (allAttractions.length < 6) return null;
              const categories: Array<AttractionCategory | "all"> = ["all", "history", "nature", "urban", "food-shopping", "family"];
              // Count items per category for display
              const counts = new Map<AttractionCategory, number>();
              allAttractions.forEach((_, i) => {
                const meta = ATTRACTION_META[active]?.[i];
                if (meta) counts.set(meta.category, (counts.get(meta.category) || 0) + 1);
              });
              return (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    if (cat === "all") {
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter("all")}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition-all",
                            categoryFilter === "all"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary text-muted-foreground hover:bg-accent",
                          )}
                        >
                          <Filter className="mr-1 inline size-3" />
                          {lang === "zh" ? "全部" : "All"} ({allAttractions.length})
                        </button>
                      );
                    }
                    const count = counts.get(cat) || 0;
                    if (count === 0) return null;
                    const label = CATEGORY_LABELS[cat][lang as Lang];
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat === categoryFilter ? "all" : cat)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-all",
                          categoryFilter === cat
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-muted-foreground hover:bg-accent",
                        )}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            <ul className="space-y-4">
              {(() => {
                const allAttractions = city.attractions as ReadonlyArray<{ name: string; desc: string; tip?: string }>;
                const indexed = allAttractions.map((a, i) => ({ ...a, index: i }));
                const filtered = categoryFilter === "all"
                  ? indexed
                  : indexed.filter((a) => ATTRACTION_META[active]?.[a.index]?.category === categoryFilter);
                const display = showAllAttractions || filtered.length <= 7 ? filtered : filtered.slice(0, 7);

                return (
                  <>
                    {filtered.length === 0 && (
                      <li className="py-6 text-center text-sm text-muted-foreground">
                        {lang === "zh" ? "该分类暂无景点" : "No attractions in this category"}
                      </li>
                    )}
                    {display.map((a) => {
                      const i = a.index;
                      const id = `${active}-${i}`;
                      const saved = has(id);
                      const meta = ATTRACTION_META[active]?.[i];
                      return (
                        <li key={i} className="relative border-l-2 border-primary/40 pl-4 pr-10">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{a.name}</p>
                            {meta && (
                              <span className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                meta.category === "history" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                meta.category === "nature" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                meta.category === "urban" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                meta.category === "food-shopping" && "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
                                meta.category === "family" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                              )}>
                                {CATEGORY_LABELS[meta.category][lang as Lang]}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                          {meta && (
                            <p className="mt-1 text-xs text-muted-foreground/80">
                              ⏱ {meta.duration}h · {meta.intensity} intensity
                            </p>
                          )}
                          {a.tip && (
                            <p className="mt-1 text-xs italic text-primary/80">💡 {a.tip}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => toggle({ id, city: active, index: i, name: a.name })}
                            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                            aria-pressed={saved}
                            className={cn(
                              "absolute right-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full transition-all",
                              saved
                                ? "bg-rose-50 text-rose-500 scale-110"
                                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-rose-500",
                            )}
                          >
                            <Heart className={cn("size-4", saved && "fill-current")} />
                          </button>
                        </li>
                      );
                    })}
                  </>
                );
              })()}
            </ul>

            {/* Show More / Show Less button */}
            {(() => {
              const allAttractions = city.attractions as ReadonlyArray<{ name: string; desc: string; tip?: string }>;
              const indexed = allAttractions.map((a, i) => ({ ...a, index: i }));
              const filtered = categoryFilter === "all"
                ? indexed
                : indexed.filter((a) => ATTRACTION_META[active]?.[a.index]?.category === categoryFilter);
              if (filtered.length <= 7) return null;
              return (
                <button
                  onClick={() => setShowAllAttractions(!showAllAttractions)}
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  {showAllAttractions ? (
                    <>
                      <ChevronUp className="size-4" />
                      {lang === "zh" ? "收起" : "Show less"}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      {lang === "zh" ? `查看全部 ${filtered.length} 个景点` : `Show all ${filtered.length} attractions`}
                    </>
                  )}
                </button>
              );
            })()}
          </div>

          {/* Foods */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UtensilsCrossed className="size-5" />
              </div>
              <h4 className="text-xl font-bold text-foreground">{t.destinations.foodsTitle}</h4>
            </div>
            <ul className="space-y-4">
              {(city.foods as ReadonlyArray<{ name: string; desc: string; where?: string }>).map((f, i) => (
                <li key={i} className="border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">{f.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  {f.where && (
                    <p className="mt-1 text-xs italic text-primary/80">📍 {f.where}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
