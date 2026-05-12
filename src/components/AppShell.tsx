import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import zodiacBg from "@/assets/zodiac-constellations.png";

interface Props {
  children: ReactNode;
  glyph?: string;
}

export function AppShell({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[color-mix(in_oklab,var(--peach)_30%,white)] text-ink">
        <AppSidebar />
        <div className="flex-1 relative overflow-x-hidden">
          {/* Constelações do zodíaco como fundo */}
          <div
            aria-hidden
            className="fixed inset-0 pointer-events-none bg-center bg-no-repeat bg-contain opacity-[0.08] animate-oo-glyph"
            style={{ backgroundImage: `url(${zodiacBg})` }}
          />

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