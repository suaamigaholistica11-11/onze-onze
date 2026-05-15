import { useEffect, useState } from "react";

const KEY = "oo:bg-disabled";
const EVENT = "oo:bg-preference-change";

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
