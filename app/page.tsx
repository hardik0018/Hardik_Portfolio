import FeaturedWork from "@/components/sections/FeaturedWork";
import Hero from "@/components/sections/Hero";
import Statements from "@/components/sections/Statements";

export default function Page() {
  return (
    <main id="main" className="bg-background">
      <Hero />
      <Statements />
      <FeaturedWork />
    </main>
  );
}
