import { ShuffleSegment } from "../../TextAnimation/Shuffle";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const FOOTER_LINKS: FooterLink[] = [
  { label: "hardikvatukiya0014@gmail.com", href: "mailto:hardikvatukiya0014@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/hardik-vatukiya", external: true },
  { label: "Instagram", href: "https://instagram.com/hardik_vatukiya_07", external: true },
  { label: "GitHub", href: "https://github.com/hardik0018", external: true },
];

export const FOOTER_HEADING_SEGMENTS: ShuffleSegment[] = [
  { text: "LET'S " },
  { text: "TALK", className: "text-stroke" },
];
