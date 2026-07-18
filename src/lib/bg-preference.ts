import { useEffect, useState } from "react";

const KEY = "oo:bg-disabled";
const THEME_KEY = "oo:theme";
const SOUND_KEY = "oo:sound-enabled";
const EVENT = "oo:bg-preference-change";
const THEME_EVENT = "oo:theme-change";
const SOUND_EVENT = "oo:sound-preference-change";

export type Theme = "light" | "dark" | "system";

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

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light" || stored === "system")
      return stored;
    return "system";
  } catch {
    return "system";
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
  const resolved = resolveTheme(theme);
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme(): Theme {
  const [theme, setState] = useState<Theme>("system");
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
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getTheme() === "system") applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener("storage", sync);
      media.removeEventListener("change", onChange);
    };
  }, []);
  return theme;
}

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(SOUND_KEY);
    return stored === null ? true : stored === "1";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent(SOUND_EVENT));
  } catch {}
}

export function useSoundEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    setEnabled(getSoundEnabled());
    const sync = () => setEnabled(getSoundEnabled());
    window.addEventListener(SOUND_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SOUND_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return enabled;
}
