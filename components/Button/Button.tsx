'use client';

import { TransitionLink } from '@/components/PageTransition';

type buttonProps = {
  text: string;
  href?: string;
  className?: string;
  theme?: 'outline' | 'white';
  onClick?: () => void;
  icon?: React.ReactNode;
};

const themeClasses: Record<NonNullable<buttonProps['theme']>, string> = {
  outline: 'bg-transperant text-black hover:text-white border-black',
  white: 'white-outline bg-transperant text-white hover:text-white border-white',
};

export default function Button({ text, href = '#', className, theme = 'outline', onClick, icon }: buttonProps) {
  return (
    <TransitionLink href={href} onClick={onClick} className={`btn group ${themeClasses[theme]} ${className ?? ''} `}>
      <span className="relative z-2 text-sm leading-[normal] font-medium uppercase">{text}</span>
      {icon}
    </TransitionLink>
  );
}
