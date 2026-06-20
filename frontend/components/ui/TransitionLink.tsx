"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useTransition } from "../TransitionProvider";

interface TransitionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export default function TransitionLink({ children, href, className, onClick, ...props }: TransitionLinkProps) {
  const { triggerTransition } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // If it's a modifier click (cmd+click, ctrl+click, etc), let browser handle it (open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    // Only intercept if we're not opening in a new window/tab
    if (props.target === "_blank") {
      return;
    }

    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    triggerTransition(href);
  };

  return (
    <Link {...props} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
