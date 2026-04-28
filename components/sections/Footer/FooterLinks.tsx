"use client"

import React from "react";
import { Shuffle } from "../../TextAnimation";
import { FooterLink } from "./footer.data";

interface FooterLinksProps {
  links: FooterLink[];
}

/**
 * Pure presentational component for rendering footer links.
 * Each link is a semantic anchor tag with keyboard and screen reader support.
 */
export default function FooterLinks({ links }: FooterLinksProps) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          className="transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          <Shuffle
            segments={[{ text: link.label }]}
            shuffleDirection="up"
          />
        </a>
      ))}
    </div>
  );
}
