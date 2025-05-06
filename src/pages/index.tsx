import { FeaturedFlavours } from "@/components/featured-flavours";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedFlavours />
    </main>
  );
}
