import { RefObject } from "react";
import { CommentBubbleHandle } from "../../CommentBubble";
import { TypewriterHandle } from "../../Typewriter";

export interface HeroRefs {
  root: RefObject<HTMLDivElement>;
  canvas: RefObject<HTMLDivElement>;
  content: RefObject<HTMLDivElement>;
  loader: RefObject<HTMLDivElement>;
  eyebrow: RefObject<HTMLParagraphElement>;
  wordTop: RefObject<HTMLDivElement>;
  wordBottom: RefObject<HTMLDivElement>;
  tagline: RefObject<HTMLParagraphElement>;
  cta: RefObject<HTMLAnchorElement>;
  cursorOther: RefObject<HTMLDivElement>;
  selection: RefObject<HTMLDivElement>;
  selectionOther: RefObject<HTMLDivElement>;
  comment: RefObject<CommentBubbleHandle>;
  commentEl: RefObject<HTMLDivElement>;
  typewriter: RefObject<TypewriterHandle>;
  hoverBoxTop: RefObject<HTMLDivElement>;
  hoverBoxBottom: RefObject<HTMLDivElement>;
}

export type SelectionMode = "drag" | "snap";
