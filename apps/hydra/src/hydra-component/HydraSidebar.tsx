'use client';

import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@gsp/ui-core';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';

const items = [
  {
    title: 'Hydra Data Logger',
    url: 'data-logger',
  },
  {
    title: 'Professor',
    url: 'professor',
  },
];

export function HydraSidebar({ header }: { header?: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const companyId = params.companyId as string;
  const { isCompact, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {header && isCompact && (
        <SidebarHeader
          onClick={() => {
            setOpenMobile(false);
          }}
          className="bg-main-white flex-row items-center border-b border-gold-3 py-5"
        >
          {header}
        </SidebarHeader>
      )}
      <SidebarContent className="bg-main-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const href = `/${companyId}/${item.url}`;
                const isActive = pathname.includes(`/${item.url}`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={href}
                        onClick={() => {
                          if (isCompact) {
                            setOpenMobile(false);
                          }
                        }}
                        className={`gap-4 flex items-center group
                        ${
                          isActive
                            ? 'text-main-black font-normal'
                            : 'text-neutral-5 hover:text-main-black'
                        }`}
                      >
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
