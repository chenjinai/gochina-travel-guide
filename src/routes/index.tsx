import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Destinations } from "@/components/sections/Destinations";
import { SurvivalKit } from "@/components/sections/SurvivalKit";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoChina Guide — Travel China Like a Pro" },
      { name: "description", content: "Curated travel guides, survival tips, and insider knowledge for first-time foreign visitors to China." },
      { property: "og:title", content: "GoChina Guide — Travel China Like a Pro" },
      { property: "og:description", content: "Curated travel guides, survival tips, and insider knowledge for first-time foreign visitors to China." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Destinations />
      <SurvivalKit />
      <Footer />
    </div>
  );
}
