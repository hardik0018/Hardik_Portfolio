import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/SectionSkeleton";
import Hero from "@/components/sections/Hero";

const Statements = dynamic(() => import("@/components/sections/Statements"), {
  loading: () => <SectionSkeleton className="min-h-[90svh]" />,
});

const FeaturedWork = dynamic(() => import("@/components/sections/FeaturedWork"), {
  loading: () => <SectionSkeleton className="min-h-[120svh]" />,
});

const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => <SectionSkeleton className="min-h-[55svh]" />,
});

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  loading: () => <SectionSkeleton className="min-h-[30svh]" />,
});

export default function Page() {
  return (
    <main id="main" className="bg-background">
      <Hero />
      <Statements />
      <FeaturedWork />
      <About />
      <Footer />
    </main>
  );
}
