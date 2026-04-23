import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { HERO_ANIMATION_CONFIG } from "../constants";
import { positionSelectionTo, setSelectionMode } from "@/lib/gsap-utils";

export function useHeroDraggable(
  wordTopRef: RefObject<HTMLDivElement | null>,
  wordBottomRef: RefObject<HTMLDivElement | null>,
  selectionRef: RefObject<HTMLDivElement | null>,
  selectionOtherRef: RefObject<HTMLDivElement | null>,
  hoverBoxTopRef: RefObject<HTMLDivElement | null>,
  hoverBoxBottomRef: RefObject<HTMLDivElement | null>,
  isEnabled: boolean
) {
  useEffect(() => {
    if (!isEnabled || !wordTopRef.current || !wordBottomRef.current) return;

    gsap.registerPlugin(Draggable);

    const elements = [
      { el: wordTopRef.current, sel: selectionRef.current, hover: hoverBoxTopRef.current },
      { el: wordBottomRef.current, sel: selectionOtherRef.current, hover: hoverBoxBottomRef.current }
    ];

    const draggables: Draggable[] = [];

    elements.forEach(({ el, sel, hover }, index) => {
      if (!sel) return;

      const dragLine = sel.querySelector("[data-drag-line]") as HTMLElement;
      const coords = sel.querySelector("[data-coords]") as HTMLElement;
      let startX = 0;
      let startY = 0;

      const d = Draggable.create(el, {
        cursor: "none",
        activeCursor: "none",
        onPress() {
          startX = this.x;
          startY = this.y;
          if (hover) gsap.to(hover, { opacity: 0, duration: 0.1 });
          
          gsap.killTweensOf([sel, el]);
          positionSelectionTo(el, sel);
          setSelectionMode(sel, "drag");
          gsap.to(sel, { opacity: 1, duration: 0.2 });
          
          if (coords) {
            coords.textContent = "dx: 0, dy: 0";
            gsap.to(coords, { opacity: 1, duration: 0.2 });
          }
          if (dragLine) gsap.set(dragLine, { opacity: 1, width: 0 });
        },
        onDrag() {
          positionSelectionTo(el, sel);
          const dx = Math.round(this.x - startX);
          const dy = Math.round(this.y - startY);
          if (coords) coords.textContent = `dx: ${dx}, dy: ${dy}`;
          
          if (dragLine && (dx !== 0 || dy !== 0)) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            gsap.set(dragLine, {
              width: dist,
              rotation: angle,
              transformOrigin: "left center",
              x: -dx,
              y: -dy,
            });
          }
        },
        onDragEnd() {
          gsap.to([dragLine, coords].filter(Boolean) as HTMLElement[], { opacity: 0, duration: 0.3 });
          setSelectionMode(sel, "snap");
          gsap.to(el, { x: 0, y: 0, duration: 1.8, ease: "elastic.out(1.1, 0.45)" });
          gsap.to(sel, { x: 0, y: 0, duration: 1.8, ease: "elastic.out(1.1, 0.45)" });
          gsap.delayedCall(4, () => gsap.to(sel, { opacity: 0, duration: 0.8 }));
        },
      })[0];

      draggables.push(d);

      const onMouseEnter = () => {
        if (d.isDragging) return;
        if (hover) {
          positionSelectionTo(el, hover);
          gsap.to(hover, { opacity: 1, duration: 0.2 });
        }
      };

      const onMouseLeave = () => {
        if (hover) gsap.to(hover, { opacity: 0, duration: 0.2 });
      };

      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);

      return () => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
        d.kill();
      };
    });

    return () => {
      draggables.forEach(d => d.kill());
    };
  }, [isEnabled, wordTopRef, wordBottomRef, selectionRef, selectionOtherRef, hoverBoxTopRef, hoverBoxBottomRef]);
}
