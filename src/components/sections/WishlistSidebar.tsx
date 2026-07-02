import { useState } from "react";
import { Heart, Sparkles, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePlanner } from "@/lib/planner";
import { CITY_LABELS } from "@/lib/attractions-meta";
import { ItineraryModal } from "./ItineraryModal";
import type { ItineraryDay } from "@/lib/planner";

export function WishlistSidebar() {
  const { wishlist, toggle, clear, generate } = usePlanner();
  const [open, setOpen] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);

  const handleGenerate = () => {
    setItinerary(generate());
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-transform hover:scale-105"
            aria-label="Open wishlist"
          >
            <Heart className="size-4 fill-current" />
            <span>My Wishlist</span>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-bold">
              {wishlist.length}
            </span>
          </button>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="size-5 text-rose-500" /> My Wishlist
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {wishlist.length} saved {wishlist.length === 1 ? "attraction" : "attractions"} · we'll auto-plan your days.
            </p>
          </SheetHeader>

          <div className="-mx-6 flex-1 overflow-y-auto px-6 py-4">
            {wishlist.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Heart className="mb-3 size-8 opacity-30" />
                Tap the heart on any attraction to save it here.
              </div>
            ) : (
              <ul className="space-y-2">
                {wishlist.map((w) => (
                  <li key={w.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{w.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {CITY_LABELS[w.city]} · {w.duration}h · {w.intensity}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle({ id: w.id, city: w.city, index: w.index, name: w.name })}
                      className="text-muted-foreground hover:text-rose-500"
                      aria-label="Remove"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <Button onClick={handleGenerate} disabled={wishlist.length === 0} className="w-full">
              <Sparkles className="size-4" /> Generate My Itinerary
            </Button>
            {wishlist.length > 0 && (
              <button onClick={clear} className="inline-flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Trash2 className="size-3" /> Clear all
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ItineraryModal
        open={itinerary !== null}
        onOpenChange={(v) => { if (!v) setItinerary(null); }}
        days={itinerary ?? []}
      />
    </>
  );
}
