import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import beijingImg from "@/assets/beijing.jpg";
import shanghaiImg from "@/assets/shanghai.jpg";
import xianImg from "@/assets/xian.jpg";
import nanjingImg from "@/assets/nanjing.jpg";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useSearch } from "@/lib/search-context";
import { lookupVisa, POPULAR_NATIONALITIES } from "@/lib/visa-lookup";
import { Search, CheckCircle, Shield, ChevronDown } from "lucide-react";

const slides = [
  { src: beijingImg, city: "Beijing" },
  { src: shanghaiImg, city: "Shanghai" },
  { src: xianImg, city: "Xi'an" },
  { src: nanjingImg, city: "Nanjing" },
];

export function Hero() {
  const { t } = useLanguage();
  useSearch();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [visaQuery, setVisaQuery] = useState("");
  const [visaResult, setVisaResult] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const handleExplore = useCallback(() => {
    const el = document.getElementById("destinations");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handlePlan = useCallback(() => {
    navigate({ to: "/planner" });
  }, [navigate]);

  // 签证查询
  const handleVisaLookup = useCallback((value: string) => {
    setVisaQuery(value);
    if (value.trim().length >= 2) {
      const result = lookupVisa(value);
      setVisaResult(result);
    } else {
      setVisaResult(null);
    }
  }, []);

  const handleSuggestionClick = useCallback((nationality: string) => {
    setVisaQuery(nationality);
    setShowSuggestions(false);
    const result = lookupVisa(nationality);
    setVisaResult(result);
  }, []);

  // 过滤建议列表
  const filteredSuggestions = POPULAR_NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(visaQuery.toLowerCase())
  );

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={s.city}
            src={s.src}
            alt={`${s.city}, China`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Strong gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/85" />
        <div className="absolute inset-0 bg-ink/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {t.hero.eyebrow}
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl lg:text-7xl">
          {t.hero.title1}
          <br />
          <span className="bg-gradient-to-r from-amber-300 to-primary bg-clip-text text-transparent drop-shadow-none">
            {t.hero.title2}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={handleExplore}
            className="h-12 w-full rounded-full bg-white px-8 text-base font-semibold text-primary shadow-xl hover:bg-white/90"
          >
            自己探索
          </Button>
          <Button
            size="lg"
            onClick={handlePlan}
            className="h-12 w-full rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl hover:bg-primary/90"
          >
            帮我规划
          </Button>
        </div>

        {/* 签证查询 */}
        <div className="relative mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              ref={inputRef}
              type="text"
              value={visaQuery}
              onChange={(e) => handleVisaLookup(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={t.hero.visa.placeholder}
              className="h-12 w-full rounded-full border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-sm outline-none transition-all focus:border-white/40 focus:bg-white/15"
            />
            {visaResult && (
              <button
                onClick={() => { setVisaQuery(""); setVisaResult(null); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* 下拉建议 */}
          {showSuggestions && filteredSuggestions.length > 0 && visaQuery.length >= 1 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-1 backdrop-blur-md"
            >
              {filteredSuggestions.map((n) => (
                <button
                  key={n}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(n);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                >
                  <ChevronDown className="h-3 w-3 text-white/40" />
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* 签证查询结果 */}
          {visaResult && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
                {t.hero.visa.resultLabel}
              </p>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  visaResult.color === "green" ? "bg-green-500/20" :
                  visaResult.color === "amber" ? "bg-amber-500/20" : "bg-red-500/20"
                }`}>
                  {visaResult.color === "green" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : visaResult.color === "amber" ? (
                    <Shield className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Search className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${
                    visaResult.color === "green" ? "text-green-400" :
                    visaResult.color === "amber" ? "text-amber-400" : "text-red-400"
                  }`}>
                    {visaResult.label}
                    {visaResult.stay && <span className="ml-2 font-normal text-white/60">· {visaResult.stay}</span>}
                  </p>
                  {visaResult.note && (
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{visaResult.note}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/85">
          <div className="text-center">
            <p className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">4</p>
            <p className="text-sm">{t.hero.stats.routes}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">50+</p>
            <p className="text-sm">{t.hero.stats.tips}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">100%</p>
            <p className="text-sm">{t.hero.stats.friendly}</p>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.city}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.city}`}
            className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all ${
              i === index
                ? "bg-white/90 text-ink"
                : "bg-white/15 text-white/80 hover:bg-white/25"
            }`}
          >
            <span
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-1.5 bg-white/60"
              }`}
            />
            {s.city}
          </button>
        ))}
      </div>
    </section>
  );
}
