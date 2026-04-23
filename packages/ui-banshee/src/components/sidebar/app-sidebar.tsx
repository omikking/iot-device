'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    title: 'Site Information',
    url: 'siteInformation',
    icon: MapPin,
  },
  {
    title: 'Template',
    url: 'template',
    icon: NotepadText,
  },
  {
    title: 'Contact Us',
    url: 'contactUs',
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const companyId = params.companyId as string;

  return (
    <Sidebar collapsible="icon">
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
