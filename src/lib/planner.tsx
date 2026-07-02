import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  ATTRACTION_META,
  CITY_LABELS,
  intensityScore,
  type CityKey,
  type Intensity,
} from "./attractions-meta";

export type WishlistItem = {
  id: string; // `${city}-${index}`
  city: CityKey;
  index: number;
  name: string;
  duration: number;
  intensity: Intensity;
};

export type ItineraryDay = {
  day: number;
  city: CityKey;
  items: WishlistItem[];
  totalHours: number;
  stamina: "Easy" | "Moderate" | "Active";
};

type PlannerCtx = {
  wishlist: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: Omit<WishlistItem, "duration" | "intensity">) => void;
  clear: () => void;
  generate: () => ItineraryDay[];
};

const Ctx = createContext<PlannerCtx | null>(null);

function computeStamina(items: WishlistItem[]): ItineraryDay["stamina"] {
  const score = items.reduce((s, i) => s + intensityScore(i.intensity), 0);
  if (score <= 3) return "Easy";
  if (score <= 5) return "Moderate";
  return "Active";
}

function planItinerary(items: WishlistItem[]): ItineraryDay[] {
  // Group by city to keep same-city attractions on the same day(s).
  const byCity = new Map<CityKey, WishlistItem[]>();
  for (const it of items) {
    if (!byCity.has(it.city)) byCity.set(it.city, []);
    byCity.get(it.city)!.push(it);
  }

  const days: ItineraryDay[] = [];
  let dayCounter = 1;
  const MAX_HOURS = 8;

  for (const [city, cityItems] of byCity) {
    // Sort: High-intensity first so they get placed cleanly (one per day).
    const sorted = [...cityItems].sort(
      (a, b) => intensityScore(b.intensity) - intensityScore(a.intensity),
    );
    const cityDays: ItineraryDay[] = [];

    for (const item of sorted) {
      let placed = false;
      for (const d of cityDays) {
        const hoursOk = d.totalHours + item.duration <= MAX_HOURS;
        const highCount = d.items.filter((i) => i.intensity === "High").length;
        const intensityOk = item.intensity !== "High" || highCount === 0;
        if (hoursOk && intensityOk) {
          d.items.push(item);
          d.totalHours += item.duration;
          placed = true;
          break;
        }
      }
      if (!placed) {
        cityDays.push({
          day: 0,
          city,
          items: [item],
          totalHours: item.duration,
          stamina: "Easy",
        });
      }
    }

    for (const d of cityDays) {
      d.day = dayCounter++;
      d.stamina = computeStamina(d.items);
      days.push(d);
    }
  }

  return days;
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const has = useCallback((id: string) => wishlist.some((w) => w.id === id), [wishlist]);

  const toggle = useCallback<PlannerCtx["toggle"]>((item) => {
    setWishlist((prev) => {
      if (prev.some((w) => w.id === item.id)) return prev.filter((w) => w.id !== item.id);
      const meta = ATTRACTION_META[item.city]?.[item.index];
      if (!meta) return prev;
      return [...prev, { ...item, duration: meta.duration, intensity: meta.intensity }];
    });
  }, []);

  const clear = useCallback(() => setWishlist([]), []);
  const generate = useCallback(() => planItinerary(wishlist), [wishlist]);

  const value = useMemo(
    () => ({ wishlist, has, toggle, clear, generate }),
    [wishlist, has, toggle, clear, generate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlanner() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlanner must be used inside <PlannerProvider>");
  return ctx;
}

export { CITY_LABELS };
export type { CityKey, Intensity };
