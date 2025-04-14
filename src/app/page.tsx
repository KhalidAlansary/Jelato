import { Hero } from "@/components/hero";
import { FeaturedPrompts } from "@/components/featured-prompts";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedPrompts />
    </main>
  );
}
