import { CreditCard, FileText, Wifi, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { PaymentGuide } from "./PaymentGuide";
import { VisaGuide } from "./VisaGuide";
import { InternetGuide } from "./InternetGuide";

export function SurvivalKit() {
  const { t } = useLanguage();
  const items = [
    { key: "pay" as const, icon: <CreditCard className="size-6" /> },
    { key: "visa" as const, icon: <FileText className="size-6" /> },
    { key: "vpn" as const, icon: <Wifi className="size-6" /> },
  ];

  return (
    <section id="survival-kit" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.kit.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.kit.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.kit.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ key, icon }) => {
            const item = t.kit.items[key];
            const cta = (
              <button className="mt-6 inline-flex items-center gap-1 self-start text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                {item.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            );
            const card = (
              <div className="group relative flex h-full flex-col rounded-2xl bg-card p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                {cta}
              </div>
            );
            if (key === "pay") {
              return (
                <PaymentGuide
                  key={key}
                  trigger={<button className="text-left">{card}</button>}
                />
              );
            }
            if (key === "visa") {
              return (
                <VisaGuide
                  key={key}
                  trigger={<button className="text-left">{card}</button>}
                />
              );
            }
            if (key === "vpn") {
              return (
                <InternetGuide
                  key={key}
                  trigger={<button className="text-left">{card}</button>}
                />
              );
            }
            return <div key={key}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
