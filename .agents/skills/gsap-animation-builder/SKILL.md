---
name: gsap-animation-builder
description: Use this skill when creating, improving, debugging, or optimizing GSAP animations in a frontend project. Trigger this for page transitions, scroll animations, hero animations, section reveals, timeline animations, interactive motion, and performance-safe UI animations.
---

# GSAP Animation Builder

## Purpose

Create clean, smooth, production-ready GSAP animations.

This skill helps build motion that improves the interface without making it messy, slow, distracting, or hard to maintain.

## When to use

Use this skill when you need:

- Page load animations
- Hero section animations
- ScrollTrigger animations
- Section reveal animations
- Text reveal animations
- Card or image entrance animations
- Navbar or menu animations
- Button hover or interaction animations
- Smooth timeline-based animations
- Route/page transition motion
- Animation cleanup in React or Next.js
- GSAP performance optimization
- Existing animation refactoring

## Process

1. Understand the existing layout first.
   - Check component structure.
   - Check CSS and Tailwind classes.
   - Check responsive behavior.
   - Check if elements already animate.

2. Define animation purpose.
   - Reveal content.
   - Guide attention.
   - Improve flow.
   - Support brand feel.
   - Avoid random motion.

3. Choose the correct GSAP pattern.
   - Use `gsap.timeline()` for controlled sequences.
   - Use `ScrollTrigger` for scroll-based motion.
   - Use `gsap.context()` in React components.
   - Use cleanup with `ctx.revert()`.
   - Use refs instead of direct global selectors when possible.

4. Build animation safely.
   - Animate `transform` and `opacity`.
   - Avoid layout-changing properties.
   - Avoid animating width, height, top, left, margin.
   - Prevent layout shifts.
   - Respect responsive design.
   - Respect reduced-motion users.

5. Optimize for production.
   - Keep timelines readable.
   - Avoid over-animation.
   - Avoid heavy blur and filter effects.
   - Avoid too many ScrollTriggers.
   - Kill or cleanup animations on unmount.
   - Test desktop and mobile behavior.

6. Return final implementation.
   - Explain only important decisions.
   - Give clean code.
   - Mention required imports.
   - Mention where to place code.
   - Mention any cleanup or dependency notes.

## Rules

- Do not create messy motion.
- Do not animate every element.
- Do not use random effects without purpose.
- Do not break existing layout.
- Do not create animation that causes CLS.
- Do not use global selectors if scoped refs are better.
- Do not use GSAP inside Server Components.
- Use `"use client"` only where animation is required.
- Use `useLayoutEffect` or an isomorphic layout effect safely.
- Always cleanup GSAP animations in React.
- Use `gsap.context()` for scoped cleanup.
- Use `ScrollTrigger.refresh()` only when needed.
- Prefer `autoAlpha` over only `opacity` when hiding elements.
- Prefer `x`, `y`, `scale`, `rotation`, and `autoAlpha`.
- Avoid heavy `filter`, `box-shadow`, and `backdrop-filter` animations.
- Avoid scroll-jacking unless specifically required.
- Keep animation duration short and controlled.
- Use stagger only when it improves readability.
- Keep mobile animations lighter than desktop.
- Respect `prefers-reduced-motion`.

## Checklist

Before coding:

- [ ] Existing layout is understood.
- [ ] Animation goal is clear.
- [ ] Elements to animate are identified.
- [ ] Animation does not harm readability.
- [ ] Mobile behavior is considered.
- [ ] Reduced motion is considered.

During coding:

- [ ] Uses Client Component if in Next.js.
- [ ] Uses refs or scoped selectors.
- [ ] Uses `gsap.context()`.
- [ ] Uses proper cleanup.
- [ ] Uses transform and opacity.
- [ ] Avoids layout-shifting properties.
- [ ] Avoids excessive ScrollTriggers.
- [ ] Keeps timeline readable.

After coding:

- [ ] Animation runs once when expected.
- [ ] Scroll animation starts at correct point.
- [ ] No flicker on first render.
- [ ] No hydration issue.
- [ ] No console error.
- [ ] No memory leak.
- [ ] No broken mobile layout.
- [ ] No performance-heavy effects.
- [ ] Code is easy to adjust later.

## Output format

Return output in this format:

```txt
Animation Goal:
- What the animation improves.

Implementation:
- Files/components changed.
- Required imports.
- Final code.

GSAP Logic:
- Timeline or ScrollTrigger explanation.
- Trigger points if used.
- Cleanup method.

Performance Notes:
- What was avoided.
- Mobile/reduced-motion handling.

Testing Checklist:
- What to verify after implementation.
````

## Common mistakes to prevent

* Using GSAP inside Server Components.
* Forgetting `"use client"` in Next.js components.
* Not cleaning animations on unmount.
* Creating duplicate animations on route changes.
* Using global selectors that affect other sections.
* Animating layout properties.
* Creating layout shift during page load.
* Making animation too slow.
* Adding too many effects.
* Using heavy blur or filter animations.
* Breaking mobile layout.
* Ignoring reduced-motion users.
* Creating ScrollTrigger without cleanup.
* Using ScrollTrigger where simple reveal is enough.
* Making content hidden if JS fails.
* Writing animation code that is hard to maintain.

## Quality bar

A good GSAP animation must be:

* Smooth
* Purposeful
* Lightweight
* Responsive
* Easy to maintain
* Safe in React/Next.js
* Cleanly scoped
* Properly cleaned up
* Free from layout shift
* Not over-designed
* Production-ready

The final result should feel premium, controlled, and useful.
Not flashy, random, or childish.
