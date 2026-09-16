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
} from '../base/sidebar';
// import './app-sidebar.css';

// Put the svgs in an index file to simplify imports.
// import { Home } from '../svg/home';
import { BansheeIcon } from '../svg/banshee-icon';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, Star, MapPin, NotepadText, User } from 'lucide-react';

// Menu items.
const items = [
  {
    title: 'Home',
    url: 'overview',
    icon: Home,
  },
  {
    title: 'Banshee',
    url: 'banshee',
    icon: BansheeIcon,
  },
  {
    title: 'Scheduler',
    url: 'scheduler',
    icon: Calendar,
  },
  {
    title: 'Events',
    url: 'events',
    icon: Star,
  },
  {
    title: 'Site information',
    url: 'siteInformation',
    icon: MapPin,
  },
  {
    title: 'Template',
    url: 'template',
    icon: NotepadText,
  },
  {
    title: 'Contact us',
    url: 'contactUs',
    icon: User,
  },
];

export function AppSidebar({ header }: { header?: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const companyId = params.companyId as string;
  const { isCompact, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {/* The drawer overlays the navbar on mobile/tablet, so it carries its own
          brand header. Not shown on desktop, where the navbar stays visible. */}
      {header && isCompact && (
        <SidebarHeader
          onClick={() => {
            setOpenMobile(false);
          }}
          className="ui-banshee-bg-main-white ui-banshee-flex-row ui-banshee-items-center ui-banshee-border-b ui-banshee-border-gold-3 ui-banshee-px-4 ui-banshee-py-5"
        >
          {header}
        </SidebarHeader>
      )}
      <SidebarContent className="ui-banshee-bg-main-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const href = `/${companyId}/${item.url}`;
                const isActive: boolean = pathname.includes(`/${item.url}`);
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
                        className={`ui-banshee-gap-4 ui-banshee-flex ui-banshee-items-center group
                        ${
                          isActive
                            ? 'ui-banshee-text-main-black ui-banshee-font-normal'
                            : 'ui-banshee-text-neutral-5 hover:ui-banshee-text-main-black'
                        }`}
                      >
                        <item.icon
                          className={`svg-icon transition-all
                          ${
                            isActive
                              ? 'stroke-black fill-black'
                              : 'group-hover:stroke-black group-hover:fill-black'
                          }`}
                        />
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
