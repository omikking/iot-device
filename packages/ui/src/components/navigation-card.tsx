'use client';

import React from 'react';

interface NavigationCardProps {
  children: React.ReactNode;
}

export const NavigationCard = ({ children }: NavigationCardProps) => {
  return (
    <div className="ui-flex ui-flex-col ui-items-center ui-gap-4 ui-px-16 ui-py-8 ui-border ui-border-gold-3 hover:ui-border-gold-primary hover:ui-bg-gold-3 ui-transition-all ease-in-out duration-200">
      {children}
    </div>
  );
};
