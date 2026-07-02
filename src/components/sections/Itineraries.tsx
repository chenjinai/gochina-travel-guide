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
import { MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { CityKey } from "@/lib/china-geo";
import { ALL_CITIES } from "@/lib/china-geo";

const images: Record<CityKey, string> = {
  beijing: beijingImg, nanjing: nanjingImg, xian: xianImg,
  shanghai: shanghaiImg, zhangjiajie: zhangjiajieImg,
  hangzhou: hangzhouImg, guangzhou: guangzhouImg, chengdu: chengduImg,
  wuhan: wuhanImg, changsha: changshaImg,
  fuzhou: fuzhouImg, jinan: jinanImg, hefei: hefeiImg,
  nanchang: nanchangImg, nanning: nanningImg,
};

export function Itineraries() {
  const { t } = useLanguage();
  const keys: readonly CityKey[] = ALL_CITIES;

  return (
    <section id="itineraries" className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.itineraries.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.itineraries.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.itineraries.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {keys.map((key) => {
            const item = t.itineraries.cities[key];
            return (
              <div
                key={key}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={images[key]}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {t.itineraries.days(item.duration)}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">{item.name}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.tagline}</h3>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {item.highlights.map((h) => (
                      <li key={h} className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3">
                    <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                      {t.itineraries.view}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
