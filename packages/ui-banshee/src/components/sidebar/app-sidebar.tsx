'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '../base/sidebar';
// import './app-sidebar.css';

// Put the svgs in an index file to simplify imports.
// import { Home } from '../svg/home';
import { BansheeIcon } from '../svg/banshee-icon';

import { Home, Calendar, Star, MapPin, NotepadText, User } from 'lucide-react';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    //TODO THIS THING IS CROOKED!!! And not responding to hover effect either
    title: 'Banshee',
    url: '#',
    icon: BansheeIcon,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Events',
    url: '#',
    icon: Star,
  },
  {
    title: 'Site Information',
    url: '#',
    icon: MapPin,
  },
  {
    title: 'Template',
    url: '#',
    icon: NotepadText,
  },
  {
    title: 'Contact Us',
    url: '#',
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="ui-banshee-bg-main-white">
        <SidebarGroup>
          <div className="hover:ui-banshee-text-main-black ui-banshee-flex ui-banshee-items-center ui-banshee-gap-1">
            <SidebarTrigger />
            <SidebarGroupLabel>Company Name</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="ui-banshee-gap-4 ui-banshee-text-neutral-5 hover:ui-banshee-text-main-black group peer/menu-button"
                    >
                      <item.icon className="svg-icon transition-all group-hover:stroke-black  group-hover:fill-black" />
                      <span className="">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
