import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'glass';
}

export const Card = ({
  className,
  variant = 'white',
  children,
  ...props
}: CardProps) => {
  const variants = {
    white: 'bg-white shadow-lg border border-slate-100',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 transition-all hover:shadow-xl',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 pb-6', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'text-2xl font-bold leading-none tracking-tight text-slate-900',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);
