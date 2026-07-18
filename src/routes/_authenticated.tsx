import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { PlanetsLoader } from "@/components/PlanetsLoader";
import { useTheme } from "@/lib/bg-preference";
import { HiddenPlayer } from "@/components/HiddenPlayer";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useTheme();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <PlanetsLoader />;
  }

  return (
    <>
      <HiddenPlayer />
      <Outlet />
    </>
  );
}