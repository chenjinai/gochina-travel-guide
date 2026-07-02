import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, CreditCard, Apple, Loader2 } from "lucide-react";
import type { ItineraryDay } from "@/lib/planner";
import { CITY_LABELS } from "@/lib/attractions-meta";
import {
  getCityMapImage,
  INTENSITY_LABELS,
  CATEGORY_EMOJI,
} from "@/lib/pdf-utils";
import type { CityKey } from "@/lib/china-geo";
import { ATTRACTION_META } from "@/lib/attractions-meta";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  days: ItineraryDay[];
};

// ---------- brand colors (RGB for jsPDF) ----------
const BRAND  = [180, 83, 9]  as const;   // warm amber
const INK    = [30, 30, 30]  as const;
const MUTED  = [130, 130, 130] as const;
const CREAM  = [255, 251, 245] as const;
const CARD_BG = [252, 250, 247] as const;
const LINE   = [220, 215, 205] as const;
const GREEN  = [22, 163, 74]  as const;
const AMBER  = [217, 119, 6]  as const;
const RED    = [220, 38, 38]  as const;

const PAGE_W = 595.28;  // A4 width in pt
const PAGE_H = 841.89;
const MARGIN = 44;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- helper: wrap text with font reset ----------
function textBlock(
  doc: any,
  text: string,
  x: number,
  y: number,
  maxW: number,
  font: string,
  style: string,
  size: number,
  color: readonly number[],
  lineH: number,
): number {
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

// ---------- draw a rounded card background ----------
function cardBg(doc: any, x: number, y: number, w: number, h: number) {
  doc.setFillColor(...CARD_BG);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 6, 6, "FD");
}

// ---------- draw intensity badge ----------
function intensityBadge(doc: any, x: number, y: number, intensity: string) {
  const info = INTENSITY_LABELS[intensity] || INTENSITY_LABELS.Medium;
  const label = info.label;
  const color = info.color;
  const tw = doc.getTextWidth(label) + 16;
  doc.setFillColor(...color);
  doc.roundedRect(x, y, tw, 16, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(label, x + 8, y + 11);
  return tw;
}

// ---------- draw a day number circle ----------
function dayCircle(doc: any, x: number, y: number, day: number) {
  doc.setFillColor(...BRAND);
  doc.circle(x + 14, y + 14, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  const dStr = `D${day}`;
  const tw = doc.getTextWidth(dStr);
  doc.text(dStr, x + 14 - tw / 2, y + 18.5);
}

// ---------- MAIN EXPORT ----------
async function exportPdf(days: ItineraryDay[]) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ==================== STEP 1: Preload city map images ====================
  const citiesUsed = [...new Set(days.map((d) => d.city))];
  const cityMaps: Record<string, string | null> = {};

  for (const city of citiesUsed) {
    cityMaps[city] = await getCityMapImage(city, days);
  }

  // ==================== STEP 2: COVER PAGE ====================
  // Background
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Decorative top bar
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, PAGE_W, 6, "F");

  // Brand top line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND);
  doc.text("GOCHINA GUIDE", MARGIN, 42);

  const coverCenterX = PAGE_W / 2;
  let cy = 180;

  // Decorative line above title
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(2);
  doc.line(coverCenterX - 100, cy, coverCenterX + 100, cy);
  cy += 28;

  // Main title
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.setTextColor(...INK);
  const titleW = doc.getTextWidth("Your China Adventure");
  doc.text("Your China Adventure", coverCenterX - titleW / 2, cy);
  cy += 52;

  // Decorative line below title
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(1);
  doc.line(coverCenterX - 60, cy, coverCenterX + 60, cy);
  cy += 32;

  // City route
  const routeStr = citiesUsed.map((c) => CITY_LABELS[c]).join("  →  ");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...MUTED);
  const routeW = doc.getTextWidth(routeStr);
  doc.text(routeStr, coverCenterX - routeW / 2, cy);
  cy += 28;

  // Trip stats
  const totalAttractions = days.reduce((s, d) => s + d.items.length, 0);
  const statsStr = `${days.length} Days  ·  ${totalAttractions} Attractions  ·  ${citiesUsed.length} Cities`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  const statsW = doc.getTextWidth(statsStr);
  doc.text(statsStr, coverCenterX - statsW / 2, cy);
  cy += 60;

  // Bottom brand card
  const cardW = 300;
  const cardX = coverCenterX - cardW / 2;
  cardBg(doc, cardX, cy, cardW, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  const crafted = "Crafted by GoChina Guide";
  const craftedW = doc.getTextWidth(crafted);
  doc.text(crafted, coverCenterX - craftedW / 2, cy + 20);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const sub = "Your personal AI-powered travel companion";
  const subW = doc.getTextWidth(sub);
  doc.text(sub, coverCenterX - subW / 2, cy + 36);

  // Bottom decorative bar
  doc.setFillColor(...BRAND);
  doc.rect(0, PAGE_H - 6, PAGE_W, 6, "F");

  // ==================== STEP 3: CITY SECTIONS ====================
  for (const city of citiesUsed) {
    doc.addPage();
    let y = MARGIN;

    // City header
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(2.5);
    doc.line(MARGIN, y, MARGIN + 50, y);
    y += 18;

    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...INK);
    const cityName = CITY_LABELS[city];
    doc.text(cityName, MARGIN, y);
    y += 36;

    // City days summary
    const cityDays = days.filter((d) => d.city === city);
    const cityAttractionCount = cityDays.reduce((s, d) => s + d.items.length, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...MUTED);
    doc.text(
      `Day${cityDays.length > 1 ? "s" : ""} ${cityDays.map((d) => d.day).join(", ")}  ·  ${cityAttractionCount} attraction${cityAttractionCount > 1 ? "s" : ""}`,
      MARGIN,
      y,
    );
    y += 24;

    // ---- MAP IMAGE ----
    const mapImg = cityMaps[city];
    if (mapImg) {
      const mapW = CONTENT_W;
      const mapH = Math.round(mapW * 0.6); // 3:5 ratio
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.5);
      doc.roundedRect(MARGIN, y, mapW, mapH, 6, 6, "D");
      try {
        doc.addImage(mapImg, "PNG", MARGIN + 1, y + 1, mapW - 2, mapH - 2);
      } catch {
        // fallback if image fails
      }
      y += mapH + 6;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text("📍 Attraction Distribution Map — spatial reference for your day planning", MARGIN, y);
      y += 20;
    } else {
      // Text-based spatial note when map unavailable
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.5);
      doc.roundedRect(MARGIN, y, CONTENT_W, 36, 6, 6, "D");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text("📍 Map unavailable — use the GoChina Guide app for interactive maps", MARGIN + 12, y + 23);
      y += 50;
    }

    // ---- DAY CARDS ----
    for (const day of cityDays) {
      // Check if we need a new page
      const estimatedDayHeight = 60 + day.items.length * 44 + 30;
      if (y + estimatedDayHeight > PAGE_H - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }

      const cardStartY = y;
      const cardH = 50 + day.items.length * 44 + 30;

      // Card background
      cardBg(doc, MARGIN, y, CONTENT_W, cardH);
      y += 10;

      // Day circle + header
      dayCircle(doc, MARGIN + 10, y, day.day);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...INK);
      doc.text(`Day ${day.day}`, MARGIN + 42, y + 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(CITY_LABELS[day.city], MARGIN + 42, y + 28);
      y += 6;

      // Stamina + hours on the right
      const badgeW = intensityBadge(doc, PAGE_W - MARGIN - 80, y + 4, day.stamina);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      const hoursStr = `~${day.totalHours}h total`;
      const hoursW = doc.getTextWidth(hoursStr);
      doc.text(hoursStr, PAGE_W - MARGIN - 80 - hoursW - 8, y + 14);
      y += 24;

      // Separator line
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.5);
      doc.line(MARGIN + 14, y, PAGE_W - MARGIN - 14, y);
      y += 10;

      // Attractions
      for (let i = 0; i < day.items.length; i++) {
        const item = day.items[i];
        const meta = ATTRACTION_META[city]?.[item.index];

        // Time dot
        doc.setFillColor(...BRAND);
        doc.circle(MARGIN + 27, y + 6, 3.5, "F");

        // Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...INK);
        doc.text(item.name, MARGIN + 38, y + 9.5);

        // Duration + intensity + category
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        let infoStr = `${item.duration}h`;
        if (meta) {
          const emoji = CATEGORY_EMOJI[meta.category] || "";
          infoStr += `  ·  ${emoji}  ${item.intensity} intensity`;
        }
        doc.text(infoStr, MARGIN + 38, y + 22);
        y += 34;
      }

      y += 8;

      // Travel tip for each day
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND);
      const tips: Record<string, string> = {
        beijing: "💡 Start early! Most Beijing attractions get crowded by 10 AM.",
        shanghai: "💡 The Bund is best at dusk — go for both daytime & night views.",
        xian: "💡 Terracotta Warriors is 1h from downtown — plan half-day accordingly.",
        nanjing: "💡 Confucius Temple area comes alive at night with lantern-lit boat rides.",
        suzhou: "💡 Gardens open at 7:30 AM — early birds get serene, crowd-free photos.",
        zhangjiajie: "💡 Wear comfortable shoes — mountain trails involve many stairs.",
        hangzhou: "💡 Rent a bike to circle West Lake — the full loop is ~15km of beauty.",
        guangzhou: "💡 Dim sum is best before 11 AM — locals call it 'morning tea'.",
        chengdu: "💡 Pandas are most active 8-10 AM — arrive early for feeding time!",
        jiuzhaigou: "💡 Autumn (Oct) is peak season — book tickets & hotels 2 weeks ahead.",
        wuhan: "💡 Try hot-dry noodles (热干面) for breakfast — Wuhan's signature dish.",
        changsha: "💡 Orange Isle light show starts at 8 PM — don't miss the spectacle.",
      };
      const tip = tips[city] || "💡 Check opening hours before you go — some attractions close on Mondays.";
      const tipWrapped = doc.splitTextToSize(tip, CONTENT_W - 30);
      doc.text(tipWrapped, MARGIN + 14, y);
      y += tipWrapped.length * 12 + 16;

      // Update card height
      const actualCardH = y - cardStartY;
      // Redraw card bg with correct height
      // (jsPDF roundedRect draws over, so we just extend the bottom)
      cardBg(doc, MARGIN, cardStartY, CONTENT_W, actualCardH);
    }
  }

  // ==================== STEP 4: FOOTER PAGE ====================
  doc.addPage();
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, PAGE_W, 6, "F");
  doc.rect(0, PAGE_H - 6, PAGE_W, 6, "F");

  let fy = 260;
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...INK);
  const thanks = "Ready for Adventure?";
  const thanksW = doc.getTextWidth(thanks);
  doc.text(thanks, coverCenterX - thanksW / 2, fy);
  fy += 50;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...MUTED);
  const footerLines = [
    "Your itinerary is ready! Use it offline, anywhere in China.",
    "",
    "Travel Tips:",
    "• Download offline maps before you go (Google Maps blocked in China)",
    "• Keep your passport handy — required for hotel check-in and train tickets",
    "• Get a local SIM or eSIM for hassle-free internet access",
    "• Most attractions accept WeChat Pay / Alipay — cash is rarely needed",
    "",
    `Generated by GoChina Guide  ·  ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
  ];
  for (const line of footerLines) {
    const lw = doc.getTextWidth(line);
    doc.text(line, coverCenterX - lw / 2, fy);
    fy += line === "" ? 14 : 20;
  }

  // ==================== SAVE ====================
  doc.save("my-china-itinerary.pdf");
}

export function PaywallModal({ open, onOpenChange, days }: Props) {
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const reset = () => {
    setCard(""); setName(""); setExp(""); setCvc("");
    setProcessing(false); setSuccess(false); setPreparing(false);
  };

  const handleUnlock = () => {
    if (card.replace(/\s/g, "").length < 12) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      // Start PDF generation (async, includes map loading)
      setPreparing(true);
      exportPdf(days).then(() => {
        setTimeout(() => { onOpenChange(false); reset(); }, 500);
      }).catch(() => {
        setPreparing(false);
      });
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-5" />
          </div>
          <DialogTitle className="text-center">
            {success ? "Payment Successful!" : "Unlock Your Custom Itinerary"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success ? (
              preparing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Generating your itinerary with maps…
                </span>
              ) : (
                "Your PDF is downloading — enjoy your journey!"
              )
            ) : (
              <>One-time <span className="font-semibold text-foreground">$4.99</span> — download as PDF, keep it forever, use offline anywhere in China.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-6">
            {preparing ? (
              <>
                <div className="relative">
                  <div className="size-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Loading attraction maps & crafting your beautiful itinerary…
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-12 text-green-500" />
                <p className="mt-3 text-base font-semibold text-foreground">All Done!</p>
                <p className="mt-1 text-sm text-muted-foreground">Your PDF is downloading…</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90">
                <Apple className="size-4" /> Pay
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#003087] px-3 py-2 text-sm font-medium text-white hover:opacity-90">
                Pay<span className="italic">Pal</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or pay with card
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <Input placeholder="Cardholder name" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} />
                <Input placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
              </div>
            </div>

            <Button onClick={handleUnlock} disabled={processing} className="w-full">
              {processing ? "Processing…" : "Unlock Now — $4.99"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              🔒 Demo checkout — no real payment is processed.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
