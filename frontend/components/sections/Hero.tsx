import { Card } from "@/components/ui/Card";
import { RevealImage } from "@/components/ui/RevealImage";
import { urlFor } from '@/lib/sanity.image';

export interface HeroData {
  name: string;
  portraitImage: Parameters<typeof urlFor>[0];
  backgroundImage: Parameters<typeof urlFor>[0];
  copyrightText: string;
}

const MarqueeItem = ({ text, isPrimary }: { text: string; isPrimary?: boolean }) => (
  <div className="flex shrink-0 items-center font-bold">
    {isPrimary ? (
      <h1 className="text-foreground px-8 text-[200px] md:text-[350px] font-hero leading-[0.8] tracking-[0.08em]">
        {text}
      </h1>
    ) : (
      <div aria-hidden="true" className="text-foreground px-8 text-[200px] md:text-[350px] font-hero leading-[0.8] tracking-[0.08em]">
        {text}
      </div>
    )}
  </div>
);

const HeroSection = ({ initialData }: { initialData?: HeroData }) => {
  const name = initialData?.name || "Hardik Vatukiya";
  const portraitUrl = initialData?.portraitImage ? urlFor(initialData.portraitImage).url() : "/hero-portrait.webp";
  const backgroundUrl = initialData?.backgroundImage ? urlFor(initialData.backgroundImage).url() : "./hero_bg.svg";
  const copyright = initialData?.copyrightText || "©2026";

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
      style={{ backgroundImage: `url(${backgroundUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
        <div className="flex whitespace-nowrap will-change-transform animate-marquee">
          <MarqueeItem text={name} isPrimary />
          <MarqueeItem text={name} />
        </div>
      </div>

      <div className="relative z-10 w-full h-[80vh] md:h-auto md:aspect-video flex justify-center items-end">
        <RevealImage
          src={portraitUrl}
          alt={`${name} — Full Stack Developer`}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          transition="bottom-up"
          trigger="load"
          delay={0}
          duration={0.8}
          wrapperClassName="relative w-full md:w-[58%] h-full"
          className="object-contain object-bottom select-none"
          priority
          quality={100}
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent pointer-events-none"></div>

      <div
        className="absolute bottom-4 left-4 flex items-center gap-2 z-40 sm:bottom-space-4 sm:left-space-4"
        aria-label="Scroll to About section"
      >
        <div className="w-8 h-8 border border-foreground flex items-center justify-center rounded-xs">
          <div className="w-1 h-1 bg-foreground rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs font-bold uppercase tracking-tighter text-text-muted">Scroll Down</span>
      </div>

      <div className="absolute bottom-4 right-4 z-40 sm:bottom-space-4 sm:right-space-4">
        <Card variant="outline" className="px-2 py-1">
          <span className="text-xs font-bold">{copyright}</span>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
