"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "@/lib/menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get current page title from menu
  const getPageTitle = () => {
    for (const group of Menu.navMain) {
      const item = group.items.find((item) => item.url === pathname);
      if (item) {
        return item.title;
      }
    }
    return "Paotere";
  };

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar isCollapsed={false} onToggle={toggleMobileMenu} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          "md:pl-64",
          isSidebarCollapsed && "md:pl-16"
        )}
      >
        <Navbar onMenuClick={toggleMobileMenu} title={getPageTitle()} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}