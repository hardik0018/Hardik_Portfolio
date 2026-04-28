import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { positionSelectionTo, setSelectionMode } from "@/lib/gsap-utils";
import { CommentBubbleHandle } from "@/components/CommentBubble";

const RETURN_COMMENT_TEXT = [
  "Let's keep this centered, please",
  "bruhhhh .. stop my breaking layout",
  "Again? We just fixed this.",
  "I'm Locking this layer(just kidding)",
];

// Must exactly match the duration of the cursorEnter tween so syncMove
// fires precisely when the cursor has landed on the dropped element.
const CURSOR_ENTER_DURATION = 0.2;

/**
 * Walk up from `el` to find the canvas container — the element that holds
 * cursorOther, commentEl, and data-global-drag-line as direct children.
 *
 * WHY: cursorOther/commentEl are positioned absolute inside canvasRef.
 * The word elements live inside contentRef > flex-col > HeroWords, which
 * is a different ancestor. Using el.parentElement for coordinate math puts
 * everything in the wrong coordinate space, causing the cursor and comment
 * to appear at completely wrong positions.
 */
function getCanvasEl(el: HTMLElement): HTMLElement {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node.querySelector(":scope > [data-global-drag-line]")) return node;
    node = node.parentElement;
  }
  return document.body;
}

export function useHeroDraggable(
  wordTopRef: RefObject<HTMLDivElement | null>,
  wordBottomRef: RefObject<HTMLDivElement | null>,
  selectionRef: RefObject<HTMLDivElement | null>,
  selectionOtherRef: RefObject<HTMLDivElement | null>,
  hoverBoxTopRef: RefObject<HTMLDivElement | null>,
  hoverBoxBottomRef: RefObject<HTMLDivElement | null>,
  cursorOther: RefObject<HTMLDivElement | null>,
  commentRef: RefObject<CommentBubbleHandle | null>,
  commentEl: RefObject<HTMLDivElement | null>,
  isEnabled: boolean,
) {
  const returnTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isEnabled || !wordTopRef.current || !wordBottomRef.current) return;

    gsap.registerPlugin(Draggable);

    const elements = [
      {
        el: wordTopRef.current,
        sel: selectionRef.current,
        hover: hoverBoxTopRef.current,
      },
      {
        el: wordBottomRef.current,
        sel: selectionOtherRef.current,
        hover: hoverBoxBottomRef.current,
      },
    ];

    const draggables: Draggable[] = [];
    const cleanupFns: Array<() => void> = [];

    elements.forEach(({ el, sel, hover }) => {
      if (!sel) return;

      const dragLine = sel.querySelector(
        "[data-drag-line]",
      ) as HTMLElement | null;
      const coords = sel.querySelector("[data-coords]") as HTMLElement | null;
      let startX = 0;
      let startY = 0;

      const d = Draggable.create(el, {
        cursor: "none",
        activeCursor: "none",

        onPress() {
          // Kill any in-flight return animation so a re-drag starts clean
          if (returnTlRef.current) {
            returnTlRef.current.kill();
            returnTlRef.current = null;
            if (cursorOther.current)
              gsap.set(cursorOther.current, { opacity: 0 });
            if (commentEl.current) gsap.set(commentEl.current, { opacity: 0 });
          }

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
          // ── Coordinate system: use canvas as the shared root ─────────────────
          //
          // canvasRef is the sticky viewport div. Both cursorOther and commentEl
          // are positioned absolute inside it. We find it via getCanvasEl so all
          // coordinates (cursor, comment, globalLine) are in the same space.

          const canvas = getCanvasEl(el);
          const globalLine = canvas.querySelector(
            "[data-global-drag-line]",
          ) as HTMLElement | null;

          const canvasBounds = canvas.getBoundingClientRect();
          const droppedBounds = el.getBoundingClientRect();

          const originalX = startX;
          const originalY = startY;

          // Center of el at its DROPPED position, relative to canvas
          const droppedCenterX =
            droppedBounds.left - canvasBounds.left + droppedBounds.width / 2;
          const droppedCenterY =
            droppedBounds.top - canvasBounds.top + droppedBounds.height / 2;

          // Center of el at its ORIGINAL position.
          // Draggable x/y are offsets from the element's natural (un-dragged) position.
          // delta = how far it was dragged.
          const deltaX = this.x - originalX;
          const deltaY = this.y - originalY;
          const originCenterX = droppedCenterX - deltaX;
          const originCenterY = droppedCenterY - deltaY;

          // Cursor appears slightly offset from dropped-text center on enter
          const cursorStartX = droppedCenterX + 28;
          const cursorStartY = droppedCenterY - 10;

          // Comment anchors near original position
          const commentX = originCenterX + 22;
          const commentY = originCenterY + 34;

          // ── Typing math ──────────────────────────────────────────────────────
          const commentText =
            RETURN_COMMENT_TEXT[
              Math.floor(Math.random() * RETURN_COMMENT_TEXT.length)
            ];
          const typingDuration = Math.max(commentText.length * 0.04, 0.3);

          // ── Kill stale tweens before building timeline ───────────────────────
          gsap.killTweensOf(
            [
              el,
              sel,
              dragLine,
              globalLine,
              cursorOther.current,
              commentEl.current,
            ].filter(Boolean),
          );

          // ── Timeline ─────────────────────────────────────────────────────────
          //
          // Label map (absolute from tl start):
          //   "start"       t=0                        fade coords, expand globalLine
          //   "cursorEnter" t=0                        cursor travels to dropped center
          //   "syncMove"    t=CURSOR_ENTER_DURATION    cursor landed → ALL return together
          //   "comment"     t=CURSOR_ENTER_DUR + 1.7   elastic settled → comment phase

          // ── Timeline ─────────────────────────────────────────────────────────
          const tl = gsap.timeline({
            onComplete: () => {
              commentRef.current?.clear();
              returnTlRef.current = null;
            },
          });
          returnTlRef.current = tl;

          const RETURN_DURATION = 1;
          const RETURN_EASE = "elastic.out(1.1, 0.45)";

          tl.addLabel("start")
            .addLabel("cursorEnter", "start")
            .addLabel("syncMove", `cursorEnter+=${CURSOR_ENTER_DURATION}`)
            .addLabel("afterMove"); // Will be updated to follow syncMove

          // ── Step 1: Initialize State ──────────────────────────────────────────
          if (coords) {
            tl.to(coords, { opacity: 0, duration: 0.3 }, "start");
          }

          tl.add(() => {
            setSelectionMode(sel, "snap");
            commentRef.current?.clear();
          }, "start");

          // ── Step 2: Global Line and Cursor Enter ─────────────────────────────
          if (globalLine) {
            gsap.set(globalLine, {
              width: 0,
              opacity: 0,
              transformOrigin: "center center",
            });
            tl.to(
              globalLine,
              { opacity: 1, width: "85vw", duration: 0.6, ease: "expo.out" },
              "start",
            );
          }

          if (cursorOther.current) {
            gsap.set(cursorOther.current, {
              x: cursorStartX,
              y: cursorStartY,
              opacity: 0,
              scale: 0.8,
            });

            tl.to(
              cursorOther.current,
              {
                x: droppedCenterX,
                y: droppedCenterY,
                opacity: 1,
                scale: 1,
                duration: CURSOR_ENTER_DURATION,
                ease: "power2.out",
              },
              "cursorEnter",
            );
          }

          // ── Step 3: Synchronized Group Movement (Core Fix) ────────────────────
          // Text element returns to origin. Selection box follows via onUpdate
          // to ensure they stay perfectly synced regardless of coordinate system.
          tl.to(
            el,
            {
              x: originalX,
              y: originalY,
              duration: RETURN_DURATION,
              ease: RETURN_EASE,
              onUpdate: () => {
                positionSelectionTo(el, sel);
              },
            },
            "syncMove",
          );

          if (cursorOther.current) {
            tl.to(
              cursorOther.current,
              {
                x: originCenterX,
                y: originCenterY,
                duration: RETURN_DURATION,
                ease: RETURN_EASE,
              },
              "syncMove",
            );
          }

          if (dragLine) {
            tl.to(
              dragLine,
              {
                width: 0,
                x: 0,
                y: 0,
                duration: RETURN_DURATION,
                ease: RETURN_EASE,
              },
              "syncMove",
            );
          }

          // ── Step 4: Sequence After Movement (Proper End Trigger) ─────────────
          // This label ensures the following animations start ONLY after syncMove is DONE.
          tl.addLabel("comment", `syncMove+=${RETURN_DURATION}`);

          // Hide border and collapse global line
          if (dragLine) {
            tl.to(dragLine, { opacity: 0, duration: 0.2 }, "comment");
          }
          if (globalLine) {
            tl.to(
              globalLine,
              { width: 0, opacity: 0, duration: 0.3, ease: "power2.in" },
              "comment",
            );
          }

          // Show comment bubble
          if (commentEl.current) {
            tl.set(
              commentEl.current,
              { x: commentX, y: commentY, opacity: 0, scale: 0.85 },
              "comment",
            );
            tl.to(
              commentEl.current,
              { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" },
              "comment",
            );
          }

          // Typing effect
          const typingProxy = { chars: 0 };
          tl.to(
            typingProxy,
            {
              chars: commentText.length,
              duration: typingDuration,
              ease: "none",
              onUpdate: () => {
                commentRef.current?.setText(
                  commentText.slice(0, Math.round(typingProxy.chars)),
                );
              },
            },
            "comment+=0.2", // Small delay after bubble appears
          );

          // ── Step 5: Final Cleanup ────────────────────────────────────────────
          const typingEnd = 0.4 + typingDuration;

          tl.to(
            commentEl.current || [],
            { opacity: 0, y: commentY + 16, duration: 0.35, ease: "power2.in" },
            `comment+=${typingEnd + 1.2}`, // Wait 1.2s after typing before hiding
          );

          tl.to(
            cursorOther.current || [],
            { opacity: 0, scale: 0.7, duration: 0.35, ease: "power2.in" },
            `comment+=${typingEnd + 1.3}`,
          );

          tl.to(
            sel,
            { opacity: 0, duration: 0.3, ease: "power2.out" },
            `comment+=${typingEnd + 1.4}`,
          );
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

      cleanupFns.push(() => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
        d.kill();
      });
    });

    return () => {
      if (returnTlRef.current) {
        returnTlRef.current.kill();
        returnTlRef.current = null;
      }
      cleanupFns.forEach((fn) => fn());
      draggables.forEach((d) => d.kill());
    };
  }, [
    isEnabled,
    wordTopRef,
    wordBottomRef,
    selectionRef,
    selectionOtherRef,
    hoverBoxTopRef,
    hoverBoxBottomRef,
    cursorOther,
    commentRef,
    commentEl,
  ]);
}
