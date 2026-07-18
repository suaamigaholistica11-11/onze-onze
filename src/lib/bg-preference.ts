import { useEffect, useState } from "react";

const KEY = "oo:bg-disabled";
const THEME_KEY = "oo:theme";
const EVENT = "oo:bg-preference-change";
const THEME_EVENT = "oo:theme-change";

export type Theme = "light" | "dark";

export function getBgDisabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setBgDisabled(disabled: boolean): void {
  try {
    window.localStorage.setItem(KEY, disabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function useBgDisabled(): boolean {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(getBgDisabled());
    const sync = () => setDisabled(getBgDisabled());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return disabled;
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT));
  } catch {}
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme(): Theme {
  const [theme, setState] = useState<Theme>("light");
  useEffect(() => {
    const current = getTheme();
    setState(current);
    applyTheme(current);
    const sync = () => {
      const t = getTheme();
      setState(t);
      applyTheme(t);
    };
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return theme;
}
