import { useState, useEffect, useRef } from "react";
import { Menu, X, Languages, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import {
  REGIONS,
  REGION_LABELS,
  PROVINCES,
  type RegionKey,
  type ProvinceKey,
  type CityKey,
  CITY_LABELS_EN,
  CITY_LABELS_ZH,
} from "@/lib/china-geo";

// City images
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

const CITY_IMAGES: Record<CityKey, string> = {
  beijing: beijingImg, nanjing: nanjingImg, xian: xianImg,
  shanghai: shanghaiImg, suzhou: hangzhouImg, zhangjiajie: zhangjiajieImg,
  hangzhou: hangzhouImg, guangzhou: guangzhouImg, chengdu: chengduImg,
  wuhan: wuhanImg, changsha: changshaImg,
  fuzhou: fuzhouImg, jinan: jinanImg, hefei: hefeiImg,
  nanchang: nanchangImg, nanning: nanningImg,
  dalian: shanghaiImg, shenyang: beijingImg, harbin: xianImg,
  daqing: jinanImg, changchun: nanjingImg, jilin: hefeiImg, yanji: changshaImg,
};

/** 按区域分组获取省份列表 */
function getProvincesByRegion(region: RegionKey): ProvinceKey[] {
  return (Object.keys(PROVINCES) as ProvinceKey[]).filter(
    (p) => PROVINCES[p].region === region,
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<RegionKey>("east");
  const destRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.destinations, href: "#destinations", hasDropdown: true },
    { label: t.nav.survival, href: "#survival-kit" },
    { label: t.nav.about, href: "#about" },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 点击外部关闭下拉
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
      setDestOpen(false);
    }
  };

  const toggleLang = () => setLang(lang === "en" ? "zh" : "en");

  const LangSwitch = ({ className }: { className?: string }) => (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent",
        className
      )}
    >
      <Languages className="size-3.5" />
      <span className={lang === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "zh" ? "text-primary" : "text-muted-foreground"}>中文</span>
    </button>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={(e) => handleClick(e, "#home")}
          className="text-xl font-bold tracking-tight text-foreground"
        >
          GoChina <span className="text-primary">Guide</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.href} className="relative" ref={destRef}>
                <button
                  onClick={() => setDestOpen(!destOpen)}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    destOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </button>
                {destOpen && (
                  <DestinationsDropdown
                    lang={lang}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    onCityClick={(city) => {
                      setDestOpen(false);
                      const el = document.querySelector("#destinations");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        // 触发自定义事件通知 Destinations 组件切换城市
                        window.dispatchEvent(new CustomEvent("gochina:select-city", { detail: city }));
                      }
                    }}
                  />
                )}
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )
          )}
          <LangSwitch />
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <LangSwitch />
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 pb-6 pt-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 下拉菜单组件                                                       */
/* ------------------------------------------------------------------ */

interface DestinationsDropdownProps {
  lang: string;
  activeRegion: RegionKey;
  setActiveRegion: (r: RegionKey) => void;
  onCityClick: (city: CityKey) => void;
}

function DestinationsDropdown({
  lang,
  activeRegion,
  setActiveRegion,
  onCityClick,
}: DestinationsDropdownProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-[680px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex h-[420px]">
        {/* 左侧：区域列表 */}
        <div className="w-44 border-r border-border bg-muted/30 p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "zh" ? "选择区域" : "Select Region"}
          </p>
          <div className="space-y-1">
            {REGIONS.map((rkey) => {
              const label = REGION_LABELS[rkey][lang as "en" | "zh"];
              const provinces = getProvincesByRegion(rkey);
              const cityCount = provinces.reduce((sum, p) => sum + PROVINCES[p].cities.length, 0);
              return (
                <button
                  key={rkey}
                  onClick={() => setActiveRegion(rkey)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                    activeRegion === rkey
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <span>{label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      activeRegion === rkey ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {cityCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧：当前区域的城市列表 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {REGION_LABELS[activeRegion][lang as "en" | "zh"]}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {getProvincesByRegion(activeRegion).map((pkey) =>
              PROVINCES[pkey].cities.map((city) => {
                const ckey = city as CityKey;
                const label = lang === "zh" ? CITY_LABELS_ZH[ckey] : CITY_LABELS_EN[ckey];
                return (
                  <button
                    key={ckey}
                    onClick={() => onCityClick(ckey)}
                    className="group relative overflow-hidden rounded-xl border border-border transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="relative h-24">
                      <img
                        src={CITY_IMAGES[ckey]}
                        alt={label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-sm font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          {label}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
