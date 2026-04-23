import { forwardRef } from "react";
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

const HeroWords = ({
  wordTopRef,
  wordBottomRef,
  selectionRef,
  selectionOtherRef,
  hoverBoxTopRef,
  hoverBoxBottomRef,
}: HeroWordsProps) => {
  return (
    <div className="relative mt-14 inline-flex flex-col items-center select-none">
      <div
        ref={wordTopRef}
        className="word"
        style={{ transformOrigin: "center bottom" }}
      >
        {HERO_COPY.wordTop}
      </div>
      <div
        ref={wordBottomRef}
        className="word word--outline -mt-3 md:-mt-2"
      >
        {HERO_COPY.wordBottom}
      </div>

      <SelectionBox ref={selectionRef} handle="h1 / Element" />
      <SelectionBox ref={selectionOtherRef} handle="h1 / Boundary" />
      <HoverBox ref={hoverBoxTopRef} />
      <HoverBox ref={hoverBoxBottomRef} />
    </div>
  );
};

export default HeroWords;
