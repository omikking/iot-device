'use client';

import React from 'react';

interface NavigationCardProps {
  children: React.ReactNode;
}

export const NavigationCard = ({ children }: NavigationCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4 px-16 py-8 border border-gold-3 hover:border-gold-primary hover:bg-gold-3 transition-all ease-in-out duration-200">
      {children}
    </div>
  );
};
