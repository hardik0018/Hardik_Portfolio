"use client";

import { useCallback } from "react";
import { StatementSegment } from "@/types/statements";

/**
 * Hook that returns a function to write segments to the DOM.
 * Uses replaceChildren for efficient, batched DOM updates.
 */
export function useTypewriter() {
  return useCallback(
    (
      container: HTMLElement,
      segments: StatementSegment[],
      plain: string,
      tLen: number,
      showCursor: boolean,
    ) => {
      const nodes: Node[] = [];

      for (let k = 0; k < segments.length; k++) {
        const seg = segments[k];
        if (tLen <= seg.start) break;

        const visible = Math.min(seg.text.length, tLen - seg.start);
        const slice = seg.text.slice(0, visible);

        if (seg.italic) {
          const em = document.createElement("em");
          em.className =
            "italic text-[#E4FE9A] not-italic font-medium drop-shadow-[0_0_24px_rgba(228,254,154,0.35)]";
          em.textContent = slice;
          nodes.push(em);
        } else {
          nodes.push(document.createTextNode(slice));
        }

        if (visible < seg.text.length) break;
      }

      if (showCursor && tLen < plain.length) {
        const cursor = document.createElement("span");
        cursor.className =
          "inline-block w-[3px] h-[0.85em] ml-1.5 bg-primary align-middle animate-pulse";
        nodes.push(cursor);
      }

      // Batch DOM write
      container.replaceChildren(...nodes);
    },
    [],
  );
}
