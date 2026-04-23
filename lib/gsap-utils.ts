import { gsap } from "gsap";

export function positionSelectionTo(target: HTMLElement, sel: HTMLElement, pad = 10) {
  if (!target || !sel) return;
  const t = target.getBoundingClientRect();
  const p = sel.parentElement?.getBoundingClientRect();
  if (!p) return;
  gsap.set(sel, {
    left: t.left - p.left - pad,
    top: t.top - p.top - pad,
    width: t.width + pad * 2,
    height: t.height + pad * 2,
  });
}

export function setSelectionMode(sel: HTMLElement, mode: "drag" | "snap") {
  const dragBorder = sel.querySelector("[data-drag-border]") as HTMLElement;
  const snapBorder = sel.querySelector("[data-snap-border]") as HTMLElement;
  const corners = sel.querySelectorAll("[data-corner]");
  const aligning = sel.querySelector("[data-aligning]") as HTMLElement;

  if (mode === "drag") {
    gsap.to(dragBorder, { opacity: 1, duration: 0.2 });
    gsap.to(snapBorder, { opacity: 0, duration: 0.2 });
    gsap.to(Array.from(corners), { opacity: 0, duration: 0.2 });
    gsap.to(aligning, { opacity: 0, duration: 0.2 });
  } else {
    gsap.to(dragBorder, { opacity: 0, duration: 0.15 });
    gsap.to(snapBorder, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(Array.from(corners), { opacity: 1, duration: 0.3, stagger: 0.04 });
    gsap.to(aligning, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)" });
  }
}
