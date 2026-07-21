import { type ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '',...props }: CardProps) {
  return (
    <div className={`rounded-xl px-6 py-5 bg-surface border border-border shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}
