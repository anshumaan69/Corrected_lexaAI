"use client"

import * as React from "react"
import Link from "next/link"
import { Scale } from "lucide-react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShield,
  IconGlobe,
  IconBrain,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Legal Professional",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Document Analysis",
      url: "/analysis",
      icon: IconFileAi,
    },
    {
      title: "Risk Assessment",
      url: "/risk",
      icon: IconShield,
    },
    {
      title: "Compliance Check",
      url: "/compliance",
      icon: IconListDetails,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "AI Analysis",
      icon: IconBrain,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Plain Language Summaries",
          url: "#",
        },
        {
          title: "Risk Assessment",
          url: "#",
        },
        {
          title: "Fraud Detection",
          url: "#",
        },
      ],
    },
    {
      title: "Legal Documents",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Contracts",
          url: "#",
        },
        {
          title: "Agreements",
          url: "#",
        },
        {
          title: "Legal Notices",
          url: "#",
        },
      ],
    },
    {
      title: "Constitutional",
      icon: IconGlobe,
      url: "#",
      items: [
        {
          title: "Compliance Checks",
          url: "#",
        },
        {
          title: "Indian Law Database",
          url: "#",
        },
        {
          title: "Legal Precedents",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search Legal DB",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Legal Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Analysis Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Document Templates",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="bg-gray-50" {...props}>
      <SidebarHeader className="bg-white border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-gray-50"
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-xl text-gray-900">LegalAI Demystifier</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-white border-t border-gray-200">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
