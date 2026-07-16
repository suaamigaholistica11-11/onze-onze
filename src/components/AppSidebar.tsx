import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Sparkles,
  Triangle,
  Star,
  LogOut,
  Moon,
  BookOpen,
  ShoppingBag,
  Share2,
  Settings,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type MenuItem = {
  to: string;
  label: string;
  icon: typeof Home;
  soon?: boolean;
  external?: boolean;
};

const ITEMS: readonly MenuItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/mapa-astral", label: "Mapa Astral", icon: Star },
  { to: "/ceu-hoje", label: "O Céu Hoje", icon: Sparkles },
  { to: "/piramide", label: "Pirâmide Evolutiva", icon: Triangle },
  { to: "/plano-de-fundo", label: "Plano de fundo", icon: ImageIcon },
  { to: "/ritualzinho", label: "Ritualzinho", icon: Moon },
  { to: "/baralho-cigano", label: "Baralho Cigano", icon: Layers },
  {
    to: "https://collshp.com/lojinjaonzeonze?view=storefront",
    label: "Lojinha 11:11",
    icon: ShoppingBag,
    external: true,
  },
  { to: "/blog", label: "Blog", icon: BookOpen, soon: true },
  { to: "/redes", label: "Nossas Redes", icon: Share2, soon: true },
  { to: "/configuracoes", label: "Configurações", icon: Settings, soon: true },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut, user, profile } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null));
  }, [user]);

  const initial = (profile?.display_name ?? user?.email ?? "?")
    .charAt(0)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-3 py-3">
          <span className="font-display text-xl font-bold tracking-tight">
            onze<span className="text-lilac">·</span>onze
          </span>
          {user && (
            <div className="flex items-center gap-3 mt-3">
              <div className="size-10 rounded-full bg-peach overflow-hidden flex items-center justify-center text-sm font-semibold shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {profile?.display_name ?? "Olá ✨"}
                </p>
                <p className="text-[11px] text-ink/50 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                if (item.soon) {
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton disabled className="opacity-60">
                        <Icon className="size-4" />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-[9px] uppercase tracking-wider bg-lilac/30 px-1.5 py-0.5 rounded-full">
                          em breve
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                if (item.external) {
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild>
                        <a href={item.to} target="_blank" rel="noreferrer">
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.to}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="size-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}