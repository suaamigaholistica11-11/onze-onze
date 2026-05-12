import { Link, useLocation } from "@tanstack/react-router";
import { Home, Moon, Triangle, User } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/lua-nova", label: "Lua Nova", Icon: Moon },
  { to: "/piramide", label: "Pirâmide", Icon: Triangle },
  { to: "/perfil", label: "Perfil", Icon: User },
] as const;

interface Props {
  children: ReactNode;
  glyph?: string;
}

export function AppShell({ children, glyph = "♌︎" }: Props) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[color-mix(in_oklab,var(--peach)_30%,white)] text-ink relative overflow-x-hidden">
      {/* Glifo gigante de fundo */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <span className="font-display text-[80vh] opacity-[0.08] leading-none select-none animate-oo-glyph">
          {glyph}
        </span>
      </div>

      <main className="relative mx-auto max-w-[420px] bg-white/40 backdrop-blur-3xl min-h-screen shadow-[0_30px_120px_-30px_rgba(45,38,51,0.25)] pb-32">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[340px] max-w-[calc(100vw-2rem)] h-16 bg-ink/90 backdrop-blur-md rounded-full flex items-center justify-around px-4 shadow-2xl z-50 ring-1 ring-white/10"
        aria-label="Navegação principal"
      >
        {TABS.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`size-11 rounded-full flex items-center justify-center transition-all ${
                active
                  ? "bg-white text-ink scale-110 shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}