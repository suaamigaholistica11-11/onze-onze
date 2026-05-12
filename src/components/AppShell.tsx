import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface Props {
  children: ReactNode;
  glyph?: string;
}

export function AppShell({ children, glyph = "♌︎" }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[color-mix(in_oklab,var(--peach)_30%,white)] text-ink">
        <AppSidebar />
        <div className="flex-1 relative overflow-x-hidden">
          {/* Glifo gigante de fundo */}
          <div
            aria-hidden
            className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <span className="font-display text-[80vh] opacity-[0.06] leading-none select-none animate-oo-glyph">
              {glyph}
            </span>
          </div>

          <header className="sticky top-0 z-30 h-12 flex items-center px-3 bg-white/40 backdrop-blur-md border-b border-black/5">
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