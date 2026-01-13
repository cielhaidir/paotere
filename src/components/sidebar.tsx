"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu as MenuIcon } from "lucide-react";
import { Menu } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setExpandedGroup((prev) => (prev === title ? null : title));
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MenuIcon className="h-5 w-5" />
            </div>
            <span className="font-semibold">Paotere</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MenuIcon className="h-5 w-5" />
            </div>
          </Link>
        )}
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                !isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-2 py-4">
            {Menu.navMain.map((group) => {
              const isExpanded = expandedGroup === group.title;
              const hasMultipleItems = group.items.length > 1;

              return (
                <div key={group.title} className="space-y-1">
                  {hasMultipleItems ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredGroup(group.title)}
                      onMouseLeave={() => setHoveredGroup(null)}
                    >
                      {/* Left indicator */}
                      <div
                        className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all",
                          (isExpanded || hoveredGroup === group.title) ? "bg-primary" : "bg-transparent"
                        )}
                      />
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          isCollapsed && "justify-center px-2",
                          (isExpanded || hoveredGroup === group.title) && "text-primary"
                        )}
                        onClick={() => !isCollapsed && toggleGroup(group.title)}
                      >
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {group.title}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className={cn(
                                "h-4 w-4",
                                (isExpanded || hoveredGroup === group.title) && "text-primary"
                              )} />
                            ) : (
                              <ChevronRight className={cn(
                                "h-4 w-4",
                                hoveredGroup === group.title && "text-primary"
                              )} />
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  ) : null}

                  {(isExpanded || !hasMultipleItems) &&
                    group.items.map((item) => {
                      const isActive = pathname === item.url;
                      const Icon = item.icon;

                      return (
                        <Link key={item.url} href={item.url}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              isCollapsed && "justify-center px-2",
                              !hasMultipleItems && "font-medium",
                              hasMultipleItems && !isCollapsed && "pl-10"
                            )}
                            title={isCollapsed ? item.title : undefined}
                          >
                            {Icon && (
                              <Icon
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  !isCollapsed && "mr-2"
                                )}
                              />
                            )}
                            {!isCollapsed && (
                              <span className="flex-1 text-left">
                                {item.title}
                              </span>
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}