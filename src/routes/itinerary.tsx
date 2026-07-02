import { createFileRoute } from "@tanstack/react-router";
import { SmartItineraryResult } from "@/components/itinerary/SmartItineraryResult";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [
      { title: "你的专属行程 — GoChina Guide" },
      { name: "description", content: "为你量身定制的中国旅行行程单。" },
    ],
  }),
  component: ItineraryPage,
});

function ItineraryPage() {
  return <SmartItineraryResult />;
}
