import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  glyph?: string;
  className?: string;
}

export function AppShell({ children, className }: Props) {
  return (
    <SidebarProvider>
      <div className={cn(
        "flex min-h-screen w-full bg-background text-foreground",
        className
      )}>
        <AppSidebar />
        <div className="flex-1 relative overflow-x-hidden">
          <header className="sticky top-0 z-30 h-12 flex items-center px-3 bg-card/40 backdrop-blur-md border-b border-border">
            <SidebarTrigger />
          </header>

          <main className="relative mx-auto max-w-[480px] min-h-[calc(100vh-3rem)] pb-12">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}