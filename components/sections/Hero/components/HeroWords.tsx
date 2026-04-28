import { HERO_COPY } from "../constants";
import SelectionBox from "@/components/SelectionBox";
import HoverBox from "./HoverBox";

interface HeroWordsProps {
  wordTopRef: React.RefObject<HTMLDivElement | null>;
  wordBottomRef: React.RefObject<HTMLDivElement | null>;
  selectionRef: React.RefObject<HTMLDivElement | null>;
  selectionOtherRef: React.RefObject<HTMLDivElement | null>;
  hoverBoxTopRef: React.RefObject<HTMLDivElement | null>;
  hoverBoxBottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroWords({
  wordTopRef,
  wordBottomRef,
  selectionRef,
  selectionOtherRef,
  hoverBoxTopRef,
  hoverBoxBottomRef,
}: HeroWordsProps) {
  return (
    <div className="relative mt-10 inline-flex max-w-full flex-col items-center px-2 select-none sm:mt-12 md:mt-14">
      <div
        ref={wordTopRef}
        className="hero-word"
        style={{ transformOrigin: "center bottom" }}
      >
        {HERO_COPY.wordTop}
      </div>
      <div
        ref={wordBottomRef}
        className="hero-word -mt-2 text-stroke sm:-mt-3 md:-mt-2"
      >
        {HERO_COPY.wordBottom}
      </div>

      <SelectionBox ref={selectionRef} handle="h1 / Element" />
      <SelectionBox ref={selectionOtherRef} handle="h1 / Boundary" />
      <HoverBox ref={hoverBoxTopRef} />
      <HoverBox ref={hoverBoxBottomRef} />
    </div>
  );
}
