import { Hero } from "@/components/hero";
import { FeaturedFlavours as FeaturedFlavours } from "@/components/featured-flavours";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedFlavours />
    </main>
  );
}
