import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITY_COORDS, CITY_LABELS_EN, CITY_LABELS_ZH, type CityKey, type RegionKey } from "@/lib/china-geo";
import type { Lang } from "@/lib/i18n";
import { ATTRACTION_META, CATEGORY_LABELS, type AttractionCategory } from "@/lib/attractions-meta";
import { CITY_MAPS } from "@/lib/city-maps-data";

// --- 分类卡通图标 (inline SVG) ---
// 每个分类有独特的颜色+图标，全国统一

const CATEGORY_ICON_CONFIG: Record<AttractionCategory, { bg: string; ring: string; svg: string }> = {
  history: {
    bg: "#B45309",    // amber-700 宫殿/塔楼
    ring: "#FDE68A",  // amber-200
    // 中式宫殿/古建筑图标
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="22" width="24" height="10" rx="1" fill="currentColor"/>
      <rect x="4" y="16" width="28" height="6" rx="1" fill="currentColor"/>
      <rect x="8" y="8" width="20" height="8" rx="1" fill="currentColor"/>
      <rect x="14" y="3" width="8" height="5" rx="1" fill="currentColor"/>
      <circle cx="18" cy="13" r="1.5" fill="white"/>
      <rect x="12" y="28" width="5" height="4" rx="0.5" fill="white"/>
      <rect x="19" y="28" width="5" height="4" rx="0.5" fill="white"/>
    </svg>`,
  },
  nature: {
    bg: "#166534",    // green-800 山/树
    ring: "#BBF7D0",  // green-200
    // 山水自然图标
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 30 L10 14 L16 22 L22 8 L28 20 L34 30 Z" fill="currentColor"/>
      <circle cx="10" cy="13" r="2.5" fill="currentColor"/>
      <circle cx="28" cy="19" r="2" fill="currentColor"/>
      <rect x="14" y="28" width="8" height="3" rx="1" fill="currentColor"/>
    </svg>`,
  },
  urban: {
    bg: "#1E40AF",    // blue-800 摩天大楼
    ring: "#BFDBFE",  // blue-200
    // 现代都市/摩天大楼图标
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="8" height="24" rx="1" fill="currentColor"/>
      <rect x="14" y="4" width="8" height="28" rx="1" fill="currentColor"/>
      <rect x="24" y="12" width="8" height="20" rx="1" fill="currentColor"/>
      <rect x="6" y="11" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="8.5" y="11" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="6" y="16" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="8.5" y="16" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="16" y="7" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="18.5" y="7" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="16" y="12" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="18.5" y="12" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="26" y="15" width="2" height="3" rx="0.5" fill="white"/>
      <rect x="28.5" y="15" width="2" height="3" rx="0.5" fill="white"/>
    </svg>`,
  },
  "food-shopping": {
    bg: "#BE185D",    // pink-700 美食/购物袋
    ring: "#FBCFE8",  // pink-200
    // 美食购物图标（碗筷+购物袋）
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20 Q18 8 28 20" stroke="currentColor" stroke-width="3" fill="none"/>
      <rect x="6" y="20" width="24" height="10" rx="3" fill="currentColor"/>
      <ellipse cx="18" cy="25" rx="8" ry="3" fill="white"/>
      <path d="M10 30 L10 33 M26 30 L26 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  family: {
    bg: "#6B21A8",    // purple-800 家庭/游乐
    ring: "#E9D5FF",  // purple-200
    // 亲子娱乐图标（摩天轮/游乐园）
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="14" stroke="currentColor" stroke-width="2.5" fill="none"/>
      <circle cx="18" cy="18" r="3" fill="currentColor"/>
      <line x1="18" y1="18" x2="18" y2="4" stroke="currentColor" stroke-width="2.5"/>
      <line x1="18" y1="18" x2="28" y2="8" stroke="currentColor" stroke-width="2.5"/>
      <line x1="18" y1="18" x2="30" y2="22" stroke="currentColor" stroke-width="2.5"/>
      <line x1="18" y1="18" x2="26" y2="30" stroke="currentColor" stroke-width="2.5"/>
      <line x1="18" y1="18" x2="8" y2="28" stroke="currentColor" stroke-width="2.5"/>
      <line x1="18" y1="18" x2="6" y2="10" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="18" cy="4" r="2" fill="currentColor"/>
      <circle cx="28" cy="8" r="2" fill="currentColor"/>
      <circle cx="30" cy="22" r="2" fill="currentColor"/>
      <circle cx="26" cy="30" r="2" fill="currentColor"/>
      <circle cx="8" cy="28" r="2" fill="currentColor"/>
      <circle cx="6" cy="10" r="2" fill="currentColor"/>
    </svg>`,
  },
};

// 构建分类图标的 DivIcon 工厂函数
function makeCategoryIcon(category: AttractionCategory) {
  const cfg = CATEGORY_ICON_CONFIG[category];
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 44px; height: 44px;
      background: ${cfg.bg};
      border: 3px solid ${cfg.ring};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      color: white;
      overflow: hidden;
    ">
      <div style="width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        ${cfg.svg}
      </div>
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -42],
  });
}

// 分类图标缓存
const categoryIconCache: Record<string, L.DivIcon> = {};

function getCategoryIcon(category: AttractionCategory): L.DivIcon {
  if (!categoryIconCache[category]) {
    categoryIconCache[category] = makeCategoryIcon(category);
  }
  return categoryIconCache[category];
}

// 默认图标（兼容旧逻辑）
const DefaultIcon = L.divIcon({
  className: "custom-marker",
  html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="#E53E3E"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -38],
});

const REGION_DOT: Record<RegionKey, string> = {
  north: "bg-orange-400",
  east: "bg-sky-400",
  central: "bg-emerald-400",
  south: "bg-rose-400",
  southwest: "bg-violet-400",
  northwest: "bg-amber-400",
  northeast: "bg-cyan-400",
};

// --- Map controller: handles fly-to animations ---

function MapController({
  city,
  viewMode,
  onModeChange,
}: {
  city: CityKey;
  viewMode: "overview" | "detail";
  onModeChange: (mode: "overview" | "detail") => void;
}) {
  const map = useMap();
  const initialFitDone = useRef(false);
  const prevViewMode = useRef(viewMode);
  const prevCity = useRef(city);

  // On mount: fit China bounds
  useEffect(() => {
    if (!initialFitDone.current) {
      map.fitBounds(
        [
          [18, 73],
          [53.5, 135],
        ],
        { padding: [20, 20] },
      );
      initialFitDone.current = true;
    }
  }, [map]);

  // Respond to mode changes
  useEffect(() => {
    if (!initialFitDone.current) return;

    if (viewMode === "overview" && prevViewMode.current !== "overview") {
      map.flyTo([35, 105], 4.5, { duration: 1.0 });
    } else if (viewMode === "detail") {
      const coord = CITY_COORDS[city];
      const mapData = CITY_MAPS[city];
      map.flyTo(coord ? [coord.lat, coord.lng] : mapData.center, mapData.zoom, {
        duration: 1.2,
      });
    }

    prevViewMode.current = viewMode;
    prevCity.current = city;
  }, [viewMode, city, map]);

  // Same city change while in detail mode
  useEffect(() => {
    if (!initialFitDone.current) return;
    if (viewMode === "detail" && prevCity.current !== city) {
      const mapData = CITY_MAPS[city];
      if (mapData) {
        map.flyTo(mapData.center, mapData.zoom, { duration: 1.0 });
      }
      prevCity.current = city;
    }
  }, [city, viewMode, map]);

  return null;
}

// --- Props ---

interface UnifiedCityMapProps {
  city: CityKey;
  cityName: string;
  region: RegionKey;
  lang: Lang;
}

// --- Main Component ---

export function UnifiedCityMap({ city, cityName, region, lang }: UnifiedCityMapProps) {
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // When city changes externally (from grid), switch to detail
  useEffect(() => {
    setViewMode("detail");
  }, [city]);

  // All city dots
  const allCities = useMemo(
    () =>
      Object.entries(CITY_COORDS).map(([key, coord]) => ({
        key: key as CityKey,
        lat: coord.lat,
        lng: coord.lng,
      })),
    [],
  );

  // Custom icons for city dots
  const cityDotIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-marker",
        html: `<div class="w-3 h-3 rounded-full bg-[#a8a29e] border border-white shadow-sm cursor-pointer hover:scale-150 transition-transform"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    [],
  );

  const cityDotSelectedIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-marker",
        html: `<div class="w-5 h-5 rounded-full bg-primary border-2 border-white shadow-md animate-pulse cursor-pointer"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    [],
  );

  const selected = CITY_COORDS[city] ?? { lat: 35, lng: 105 };
  const attractionData = CITY_MAPS[city] ?? { center: [35, 105] as [number, number], zoom: 4, attractions: [] };

  // 根据城市+景点名称查找分类
  const getAttractionCategory = useCallback(
    (cityKey: CityKey, attractionName: string): AttractionCategory | null => {
      const metaList = ATTRACTION_META[cityKey];
      if (!metaList) return null;
      // CITY_MAPS 中的景点名与 ATTRACTION_META 通过数组索引对齐
      const mapAttractions = CITY_MAPS[cityKey]?.attractions;
      if (!mapAttractions) return null;
      const idx = mapAttractions.findIndex((a) => a.name === attractionName);
      if (idx < 0 || idx >= metaList.length) return null;
      return metaList[idx].category;
    },
    [],
  );

  const goToOverview = useCallback(() => {
    setViewMode("overview");
  }, []);

  const handleCityDotClick = useCallback(
    (ckey: CityKey) => {
      // Notify parent to update active city (syncs with city grid)
      window.dispatchEvent(
        new CustomEvent("gochina:unified-map-city-clicked", { detail: ckey }),
      );
      // Switch to detail mode immediately (even if same city)
      setViewMode("detail");
    },
    [],
  );

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
        <div className="h-[380px] sm:h-[460px] flex items-center justify-center text-sm text-muted-foreground">
          Loading map…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {viewMode === "detail" ? (
            <button
              onClick={goToOverview}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              {lang === "zh" ? "全国总览" : "All Cities"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h4 className="text-lg font-bold text-foreground">
                {lang === "zh" ? "中国城市 & 景点分布" : "Cities & Attractions Map"}
              </h4>
            </div>
          )}
          {viewMode === "detail" && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-px bg-border" />
              <MapPin className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{cityName}</span>
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {viewMode === "detail"
            ? `${attractionData.attractions.length} ${lang === "zh" ? "个景点" : "attractions"}`
            : `${allCities.length} ${lang === "zh" ? "座城市" : "cities"}`}
        </span>
      </div>

      {/* Map Container */}
      <div className="relative h-[380px] w-full sm:h-[460px]">
        <MapContainer
          center={[35, 105]}
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapController city={city} viewMode={viewMode} onModeChange={setViewMode} />

          <TileLayer
              attribution={lang === "zh" ? '&copy; 高德地图 | AutoNavi' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}
              url={lang === "zh"
                ? "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
              subdomains={lang === "zh" ? ["1", "2", "3", "4"] : "abcd"}
              maxZoom={18}
              key={lang}
            />

          {/* ---- OVERVIEW: city dots ---- */}
          {allCities.map((c) => {
            const isSelected = c.key === city && viewMode === "detail";
            return (
              <Marker
                key={`city-${c.key}`}
                position={[c.lat, c.lng]}
                icon={isSelected ? cityDotSelectedIcon : cityDotIcon}
                eventHandlers={{
                  click: () => handleCityDotClick(c.key),
                }}
              >
                <Popup closeButton={false}>
                  <div className="text-sm font-semibold text-foreground">
                    {lang === "zh" ? CITY_LABELS_ZH[c.key] : CITY_LABELS_EN[c.key]}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* ---- DETAIL: attraction markers ---- */}
          {viewMode === "detail" &&
            attractionData.attractions.map((a) => {
              const cat = getAttractionCategory(city, a.name);
              const icon = cat ? getCategoryIcon(cat) : DefaultIcon;
              return (
                <Marker key={`attr-${a.name}`} position={a.position} icon={icon}>
                  <Popup>
                    <div className="w-56">
                      {/* 分类标签 */}
                      {cat && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CATEGORY_ICON_CONFIG[cat].bg }}
                          />
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: CATEGORY_ICON_CONFIG[cat].ring,
                              color: CATEGORY_ICON_CONFIG[cat].bg,
                            }}
                          >
                            {lang === "zh" ? CATEGORY_LABELS[cat].zh : CATEGORY_LABELS[cat].en}
                          </span>
                        </div>
                      )}
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">{a.desc}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>

        {/* Floating info card */}
        {viewMode === "overview" && selected && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-border/50 p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("size-3 rounded-full", REGION_DOT[region])} />
                <span className="text-sm font-semibold text-foreground">{cityName}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {selected.lat.toFixed(2)}°N, {selected.lng.toFixed(2)}°E
                </span>
              </div>
              <button
                onClick={() => setViewMode("detail")}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <MapPin className="size-4" />
                {lang === "zh" ? "查看景点分布" : "Explore Attractions"}
              </button>
            </div>
          </div>
        )}

        {/* Detail mode: attraction count badge */}
        {viewMode === "detail" && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-border/50 p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className={cn("size-3 rounded-full", REGION_DOT[region])} />
                <span className="text-sm font-semibold text-foreground">{cityName}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {attractionData.attractions.length} {lang === "zh" ? "景点" : "spots"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
