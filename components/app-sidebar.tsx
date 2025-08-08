"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarCheck2, FileWarning, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Bookings", url: "/bookings", icon: CalendarCheck2 },
  { title: "Exceptions", url: "/exceptions", icon: FileWarning },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3">
        <div className="text-base font-semibold">Festive Coverage</div>
        <div className="text-xs text-muted-foreground">Admin Dashboard</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground px-3">
        <div>v1.0</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
