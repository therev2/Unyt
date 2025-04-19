"use client"
import {
  Award,
  BrainCircuit,
  Calendar,
  Globe,
  LogOut,
  MessageSquare,
  School,
  Settings,
  Sparkles,
  Trophy,
  type LucideIcon,
  User,
} from "lucide-react"
import { usePathname } from "next/navigation"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

import { useUserProfile } from "@/components/useUserProfile";

// Main navigation items
const mainNavItems: NavItem[] = [
  {
    title: "College Home",
    href: "/college",
    icon: School,
  },
  {
    title: "Global Feed",
    href: "/feed",
    icon: Globe,
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Competitions",
    href: "/competitions",
    icon: Trophy,
  },
]

// Features navigation items
const featureNavItems: NavItem[] = [
  {
    title: "Quizzes & Battles",
    href: "/quizzes",
    icon: BrainCircuit,
  },
  {
    title: "Discussion Forums",
    href: "/forums",
    icon: MessageSquare,
  },
  {
    title: "Leaderboards",
    href: "/leaderboards",
    icon: Award,
  },
  {
    title: "Ask Buddy",
    href: "/chatbot",
    icon: Sparkles,
  },
]

export function CampusSidebar() {
  const { userData, loading, error } = useUserProfile();
  const pathname = usePathname()

  // Set active state based on current path
  const getNavItemsWithActiveState = (items: NavItem[]) => {
    return items.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }))
  }

  const activeMainNavItems = getNavItemsWithActiveState(mainNavItems)
  const activeFeatureNavItems = getNavItemsWithActiveState(featureNavItems)

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Logo" />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <div className="font-semibold text-lg">Unyt</div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeMainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeFeatureNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile */}
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                  <a href="/profile">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <a href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <Avatar className="h-8 w-8">
                <AvatarImage src={"/placeholder.svg"} alt="Loading" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium bg-muted rounded w-20 h-4" />
                <span className="text-xs text-muted-foreground bg-muted rounded w-28 h-3 mt-1" />
              </div>
            </div>
          ) : error ? (
            <div className="text-xs text-red-500">Failed to load profile</div>
          ) : userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name || "User"} />
                      <AvatarFallback>{(userData.name || "?").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{userData.name || userData.username || "User"}</span>
                      <span className="text-xs text-muted-foreground">{userData.college || "-"}</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <div className="text-xs font-medium">{userData.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {(userData.year || "")} {userData.year && userData.branch ? "•" : null} {userData.branch || ""}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
