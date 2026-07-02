import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Clock, Activity, MapPin } from "lucide-react";
import type { ItineraryDay } from "@/lib/planner";
import { CITY_LABELS } from "@/lib/attractions-meta";
import { PaywallModal } from "./PaywallModal";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  days: ItineraryDay[];
};

const staminaStyle: Record<ItineraryDay["stamina"], string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  Active: "bg-rose-100 text-rose-700",
};

export function ItineraryModal({ open, onOpenChange, days }: Props) {
  const [paywallOpen, setPaywallOpen] = useState(false);
  const totalHours = days.reduce((s, d) => s + d.totalHours, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Smart Itinerary</DialogTitle>
            <DialogDescription>
              {days.length} day{days.length === 1 ? "" : "s"} · ~{totalHours} hours of exploration · balanced for stamina.
            </DialogDescription>
          </DialogHeader>

          {days.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Add some attractions to your wishlist first.
            </p>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-3">
              <div className="relative space-y-5 pl-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {days.map((d) => (
                  <div key={d.day} className="relative">
                    <span className="absolute -left-[22px] top-2 inline-block h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-foreground">Day {d.day}</h4>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" /> {CITY_LABELS[d.city]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-foreground">
                            <Clock className="size-3" /> ~{d.totalHours}h
                          </span>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", staminaStyle[d.stamina])}>
                            <Activity className="size-3" /> {d.stamina}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {d.items.map((it) => (
                          <li key={it.id} className="flex items-start justify-between gap-3 border-l-2 border-primary/40 pl-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{it.name}</p>
                              <p className="text-xs text-muted-foreground">{it.intensity} intensity</p>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">{it.duration}h</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {days.length > 0 && (
            <Button onClick={() => setPaywallOpen(true)} className="w-full">
              <Download className="size-4" /> Export PDF Itinerary
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} days={days} />
    </>
  );
}
