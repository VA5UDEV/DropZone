"use client";

import * as React from "react";
import {
  Image,
  Command,
  Home,
  Folder,
  // Trash2,
  AudioWaveform,
  BlocksIcon,
  // Star,
} from "lucide-react";

import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: Home,
      isActive: false,
    },
    {
      title: "Folders",
      url: "/dashboard/folders",
      icon: Folder,
      isActive: false,
    },
    {
      title: "Images",
      url: "/dashboard/images",
      icon: Image,
      isActive: false,
    },
  ],
  navMain2: [
    {
      title: "All Files",
      url: "#",
      icon: BlocksIcon,
      isActive: true,
    },
    // {
    //   title: "Starred",
    //   url: "#",
    //   icon: Star,
    //   isActive: false,
    // },
    // {
    //   title: "Deleted Files",
    //   url: "#",
    //   icon: Trash2,
    //   isActive: false,
    // },
  ],
  navMain3: [
    {
      title: "All Files",
      url: "#",
      icon: BlocksIcon,
      isActive: true,
    },
    // {
    //   title: "Images",
    //   url: "/dashboard/images",
    //   icon: Image,
    //   isActive: false,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  // const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const pathname = usePathname();
  const [navItems, setNavItems] = useState(data.navMain2); // default
  const activeItem = data.navMain.find((item) => item.url === pathname);
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (pathname === "/dashboard/home") {
      setNavItems(data.navMain2);
    } else {
      setNavItems(data.navMain3);
    }
  }, [pathname]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="icon"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="mt-2 px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={{ children: item.title, hidden: false }}
                      isActive={pathname === item.url}
                      className="px-2.5 md:px-2"
                    >
                      <Link href={item.url} onClick={() => setOpen(true)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 p-4">
          <div className="flex w-auto items-center justify-between ml-14">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title ?? ""}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="ml-12 w-auto">
            <SidebarGroupContent>
              <NavMain items={navItems} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
