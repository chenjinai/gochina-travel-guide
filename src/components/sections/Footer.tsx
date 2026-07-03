import { Heart, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();
  const exploreKeys = ["destinations", "survival", "itineraries", "blog"] as const;
  const supportKeys = ["faq", "contact", "privacy", "terms"] as const;

  return (
    <footer id="about" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#home" className="text-xl font-bold tracking-tight text-foreground">
              GoChina <span className="text-primary">Guide</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-5 space-y-2">
              <p className="text-sm font-semibold text-foreground">{t.footer.contactTitle}</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                {t.footer.contactWeChat}: 15398262339
              </p>
              <a href="mailto:1353296921cj@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {t.footer.contactEmail}: 1353296921cj@gmail.com
              </a>
              <a href="https://wa.me/8615398262339" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                {t.footer.contactWhatsApp}: +86 15398262339
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{t.footer.explore}</h4>
            <ul className="mt-4 space-y-3">
              {exploreKeys.map((k) => (
                <li key={k}>
                  <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {t.footer.links[k]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{t.footer.support}</h4>
            <ul className="mt-4 space-y-3">
              {supportKeys.map((k) => (
                <li key={k}>
                  <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {t.footer.links[k]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GoChina Guide. {t.footer.rights}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {t.footer.made} <Heart className="size-3 text-destructive" /> {t.footer.forTravelers}
          </p>
        </div>
      </div>
    </footer>
  );
}
