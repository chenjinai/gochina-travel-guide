import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITY_COORDS, type CityKey, type RegionKey, REGION_LABELS } from "@/lib/china-geo";
import type { Lang } from "@/lib/i18n";


interface ChinaCityLocatorProps {
  city: CityKey;
  cityName: string;
  region: RegionKey;
  lang: Lang;
  onViewAttractions: () => void;
}

const REGION_DOT: Record<RegionKey, string> = {
  north: "bg-orange-400",
  east: "bg-sky-400",
  central: "bg-emerald-400",
  south: "bg-rose-400",
  southwest: "bg-violet-400",
  northwest: "bg-amber-400",
  northeast: "bg-cyan-400",
};

function MapController({ city }: { city: CityKey }) {
  const map = useMap();
  const initialFitDone = useRef(false);

  useEffect(() => {
    if (!initialFitDone.current) {
      map.fitBounds(
        [
          [18, 73], // Southwest corner
          [53.5, 135], // Northeast corner
        ],
        { padding: [20, 20] }
      );
      initialFitDone.current = true;
    }
  }, [map]);

  useEffect(() => {
    if (initialFitDone.current) {
      const coord = CITY_COORDS[city];
      map.flyTo([coord.lat, coord.lng], 9, { duration: 1.2 });
    }
  }, [city, map]);

  return null;
}

export function ChinaCityLocator({
  city,
  cityName,
  region,
  lang,
  onViewAttractions,
}: ChinaCityLocatorProps) {
  const selected = CITY_COORDS[city];

  // All cities with their coordinates
  const allCities = Object.entries(CITY_COORDS).map(([key, coord]) => ({
    key: key as CityKey,
    lat: coord.lat,
    lng: coord.lng,
  }));

  // Custom icon for unselected cities
  const defaultIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-marker",
        html: `<div class="w-2.5 h-2.5 rounded-full bg-[#a8a29e] border border-white shadow-sm opacity-70"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      }),
    []
  );

  // Custom icon for selected city
  const selectedIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-marker",
        html: `<div class="w-5 h-5 rounded-full bg-primary border-2 border-white shadow-md animate-pulse"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    []
  );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" />
          <h4 className="text-lg font-bold text-foreground">
            {lang === "zh" ? "城市定位" : "City Location"}
          </h4>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {REGION_LABELS[region][lang]}
        </span>
      </div>

      {/* Map Container */}
      <div className="relative h-[320px] w-full sm:h-[380px]">
        <MapContainer
          center={[35, 105]}
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapController city={city} />
          
          {/* Light styled tiles */}
          <TileLayer
            attribution={lang === "zh" ? '&copy; 高德地图 | AutoNavi' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}
            url={lang === "zh"
              ? "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
            subdomains={lang === "zh" ? ["1", "2", "3", "4"] : "abcd"}
            maxZoom={18}
            key={lang}
          />
          />

          {/* All city markers */}
          {allCities.map((c) => {
            const isSelected = c.key === city;
            return (
              <Marker
                key={c.key}
                position={[c.lat, c.lng]}
                icon={isSelected ? selectedIcon : defaultIcon}
              >
                {isSelected && (
                  <Popup closeButton={false}>
                    <div className="text-sm font-semibold text-foreground">
                      {cityName}
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>

        {/* Selected city info card */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64">
          <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-border/50 p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("size-3 rounded-full", REGION_DOT[region])} />
              <span className="text-sm font-semibold text-foreground">{cityName}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {selected.lat.toFixed(2)}°N, {selected.lng.toFixed(2)}°E
              </span>
            </div>
            <button
              onClick={onViewAttractions}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              <MapIcon className="size-4" />
              {lang === "zh" ? "查看景点分布" : "View Attractions Map"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
