"use client";
import { PanelLeftOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Shortcut from "../shortcut/shortcut";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

interface ICustomSidebarTrigger {
  className?: string;
}

export function CustomSideBarTrigger({ className }: ICustomSidebarTrigger) {
  const { toggleSidebar, isMobile, openMobile, open } = useSidebar();

  const closedState = () => {
    if (isMobile) return !openMobile;
    return !open;
  };

  return (
    <Button
      variant={"outline"}
      onClick={() => toggleSidebar()}
      aria-label="Toggle Sidebar"
      className={cn(
        "fixed top-28 left-4 z-500 hidden bg-background p-4 opacity-0 md:top-18 dark:bg-background hover:dark:bg-background cursor-pointer",
        {
          "inline-flex animate-fade-in opacity-100": closedState(),
          "top-20": isMobile,
        },
        className,
      )}
    >
      <PanelLeftOpenIcon className="size-5 transition-all" />
      <span className="sr-only">Toggle Sidebar</span>
      {!isMobile && (
        <Shortcut shortcuts={["Ctrl", "B"]} size="sm" variant="ghost" />
      )}
    </Button>
  );
}
