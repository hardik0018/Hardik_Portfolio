import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'muted' | 'raised' | 'outline';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'muted', children, ...props }, ref) => {
    const variants = {
      muted: 'bg-card-bg',
      raised: 'bg-bg-secondary',
      outline: 'bg-transparent border border-border',
    };

    return (
      <div
        ref={ref}
        className={`rounded-md p-3 transition-all duration-instant ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
