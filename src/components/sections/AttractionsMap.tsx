import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CityKey } from "@/lib/china-geo";
import { useLanguage } from "@/lib/i18n";
import { ATTRACTION_META, CATEGORY_LABELS, type AttractionCategory } from "@/lib/attractions-meta";
import { CITY_MAPS, type AttractionCoord } from "@/lib/city-maps-data";

// Re-export CITY_MAPS for backward compatibility
export { CITY_MAPS } from "@/lib/city-maps-data";

// --- 分类卡通图标配置 ---
const CATEGORY_ICON_CONFIG: Record<AttractionCategory, { bg: string; ring: string; svg: string }> = {
  history: {
    bg: "#B45309",
    ring: "#FDE68A",
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
    bg: "#166534",
    ring: "#BBF7D0",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 30 L10 14 L16 22 L22 8 L28 20 L34 30 Z" fill="currentColor"/>
      <circle cx="10" cy="13" r="2.5" fill="currentColor"/>
      <circle cx="28" cy="19" r="2" fill="currentColor"/>
      <rect x="14" y="28" width="8" height="3" rx="1" fill="currentColor"/>
    </svg>`,
  },
  urban: {
    bg: "#1E40AF",
    ring: "#BFDBFE",
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
    bg: "#BE185D",
    ring: "#FBCFE8",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20 Q18 8 28 20" stroke="currentColor" stroke-width="3" fill="none"/>
      <rect x="6" y="20" width="24" height="10" rx="3" fill="currentColor"/>
      <ellipse cx="18" cy="25" rx="8" ry="3" fill="white"/>
      <path d="M10 30 L10 33 M26 30 L26 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  family: {
    bg: "#6B21A8",
    ring: "#E9D5FF",
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

const categoryIconCache: Record<string, L.DivIcon> = {};

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

function getCategoryIcon(category: AttractionCategory): L.DivIcon {
  if (!categoryIconCache[category]) {
    categoryIconCache[category] = makeCategoryIcon(category);
  }
  return categoryIconCache[category];
}

// 默认图标（备用）
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

// 根据城市+景点名查找分类
function getAttractionCategory(cityKey: CityKey, attractionName: string): AttractionCategory | null {
  const metaList = ATTRACTION_META[cityKey];
  if (!metaList) return null;
  const mapAttractions = CITY_MAPS[cityKey]?.attractions;
  if (!mapAttractions) return null;
  const idx = mapAttractions.findIndex((a) => a.name === attractionName);
  if (idx < 0 || idx >= metaList.length) return null;
  return metaList[idx].category;
}

type Attraction = AttractionCoord;

function FlyToCity({ city }: { city: CityKey }) {
  const map = useMap();
  useEffect(() => {
    const { center, zoom } = CITY_MAPS[city];
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [city, map]);
  return null;
}

export function AttractionsMap({ city }: { city: CityKey }) {
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();
  useEffect(() => {
    setMounted(true);
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const data = CITY_MAPS[city];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="h-[420px] w-full sm:h-[500px]">
        {mounted ? (
          <MapContainer
            center={data.center}
            zoom={data.zoom}
            scrollWheelZoom={true}
            className="relative z-[10] h-full w-full"
            style={{ background: "var(--muted)" }}
          >
            <TileLayer
              attribution={lang === "zh" ? '&copy; 高德地图 | AutoNavi' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
              url={lang === "zh"
                ? "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
              subdomains={lang === "zh" ? ["1", "2", "3", "4"] : "abcd"}
              maxZoom={18}
              key={lang}
            />
            <FlyToCity city={city} />
            {data.attractions.map((a) => {
              const cat = getAttractionCategory(city, a.name);
              const icon = cat ? getCategoryIcon(cat) : DefaultIcon;
              return (
                <Marker key={a.name} position={a.position} icon={icon}>
                  <Popup>
                    <div className="w-56">
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
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Loading map…
          </div>
        )}
      </div>
    </div>
  );
}
