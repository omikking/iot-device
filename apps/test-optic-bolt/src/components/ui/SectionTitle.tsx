import { type ReactNode } from 'react';

export interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children,...props }: SectionTitleProps) {
  return (
    <span className="text-[13px] font-bold tracking-[0.02em] text-text font-sans block mb-[14px]" {...props}>
      {children}
    </span>
  );
}
