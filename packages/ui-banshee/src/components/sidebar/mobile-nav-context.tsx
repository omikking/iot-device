'use client';

import * as React from 'react';

/**
 * Shares the mobile/tablet sidebar-drawer open state between the top navbar
 * (which owns the hamburger toggle) and the SidebarProvider (which renders the
 * off-canvas drawer). These two live in separate layout subtrees, so a plain
 * `useSidebar()` call from the navbar isn't possible — this lightweight context
 * bridges them without duplicating the sidebar implementation.
 */
type MobileNavContextValue = {
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobile: () => void;
};

const MobileNavContext = React.createContext<MobileNavContextValue | null>(
  null,
);

export function MobileNavProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleMobile = React.useCallback(() => {
    setOpenMobile((open) => !open);
  }, []);

  const value = React.useMemo<MobileNavContextValue>(
    () => ({ openMobile, setOpenMobile, toggleMobile }),
    [openMobile, toggleMobile],
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

/**
 * Returns the shared mobile-nav state, or `null` when rendered outside a
 * `MobileNavProvider`. Callers must handle the `null` case so the sidebar keeps
 * working with its own internal state when the provider isn't mounted.
 */
export function useMobileNav() {
  return React.useContext(MobileNavContext);
}
