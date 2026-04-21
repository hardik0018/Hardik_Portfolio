'use client';

import Link from 'next/link';
import { usePageTransition } from './TransitionContext';
import { ComponentProps } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { triggerTransition } = usePageTransition();
  const hrefString = typeof href === 'string' ? href : href.pathname ?? '';

  const isExternal =
    hrefString.startsWith('http') ||
    hrefString.startsWith('mailto:') ||
    hrefString.startsWith('tel:') ||
    hrefString === '#';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    // Let external links, target="_blank", and modifier keys behave normally
    if (
      isExternal ||
      props.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    triggerTransition(hrefString);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
