"use client";

import { usePathname } from "next/navigation";
import { CampusSidebar } from "@/components/campus-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SidebarConditional({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebar = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (noSidebar) {
    return <>{children}</>;
  }
  return (
    <SidebarProvider>
      <CampusSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
