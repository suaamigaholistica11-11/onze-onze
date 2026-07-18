import { useEffect, useRef } from "react";
import { useSoundEnabled } from "@/lib/bg-preference";

const PLAYLIST_URI = "spotify:playlist:4RIra0o3FVZgbXktW2yNHR";
const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v3";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    SpotifyIframeApi?: SpotifyIframeApi;
  }
}

interface SpotifyController {
  play: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: unknown) => void) => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; height?: number; width?: number },
    cb: (controller: SpotifyController) => void,
  ) => void;
}

/**
 * Hidden Spotify player. Loads a curated playlist and plays a random-ish
 * track from it as soon as the user interacts with the app. The iframe is
 * visually hidden so the user never knows which track is playing. Toggle
 * via Configurações > Som.
 */
export function HiddenPlayer() {
  const soundOn = useSoundEnabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.SpotifyIframeApi) {
          resolve();
          return;
        }
        const existing = document.querySelector<HTMLScriptElement>(
          `script[src="${SCRIPT_SRC}"]`,
        );
        const prev = window.onSpotifyIframeApiReady;
        window.onSpotifyIframeApiReady = (api) => {
          window.SpotifyIframeApi = api;
          if (prev) prev(api);
          resolve();
        };
        if (!existing) {
          const s = document.createElement("script");
          s.src = SCRIPT_SRC;
          s.async = true;
          document.body.appendChild(s);
        }
      });

    const boot = async () => {
      await ensureScript();
      if (cancelled || !containerRef.current || controllerRef.current) return;
      const api = window.SpotifyIframeApi;
      if (!api) return;
      api.createController(
        containerRef.current,
        { uri: PLAYLIST_URI, height: 80, width: 300 },
        (controller) => {
          if (cancelled) {
            controller.destroy();
            return;
          }
          controllerRef.current = controller;
          tryStart();
        },
      );
    };

    const tryStart = () => {
      const c = controllerRef.current;
      if (!c || startedRef.current) return;
      try {
        c.play();
        startedRef.current = true;
      } catch {
        /* autoplay blocked, waits for interaction */
      }
    };

    const onInteract = () => {
      if (startedRef.current || !getSoundPref()) return;
      tryStart();
    };

    const getSoundPref = () => {
      try {
        const v = window.localStorage.getItem("oo:sound-enabled");
        return v === null ? true : v === "1";
      } catch {
        return true;
      }
    };

    if (getSoundPref()) {
      boot();
    }

    window.addEventListener("pointerdown", onInteract, { once: false });
    window.addEventListener("keydown", onInteract, { once: false });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      const c = controllerRef.current;
      if (c) {
        try {
          c.destroy();
        } catch {}
      }
      controllerRef.current = null;
      startedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to preference toggle
  useEffect(() => {
    const c = controllerRef.current;
    if (!c) {
      if (soundOn && !controllerRef.current) {
        // trigger boot by re-running init effect via a re-render is unnecessary;
        // instead attempt to start on next interaction
      }
      return;
    }
    try {
      if (soundOn) {
        c.resume();
        startedRef.current = true;
      } else {
        c.pause();
      }
    } catch {}
  }, [soundOn]);

  return (
    <div
      aria-hidden
      ref={containerRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}