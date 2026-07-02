import { createFileRoute } from "@tanstack/react-router";
import { TripPlanner } from "@/components/planner/TripPlanner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "定制你的中国之旅 — GoChina Guide" },
      { name: "description", content: "通过简单的6步问答，为你量身定制专属的中国旅行计划。" },
    ],
  }),
  component: TripPlannerPage,
});

function TripPlannerPage() {
  return <TripPlanner />;
}
