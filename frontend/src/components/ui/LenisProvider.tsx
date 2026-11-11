"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { globalRAF } from "@/lib/globalRAF";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch device or small screen → disable Lenis
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;

    if (isTouch && isSmallScreen) {
      setIsMobile(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Register in global RAF loop (shared with Three.js)
    globalRAF.add("lenis", (time: number) => {
      lenis.raf(time);
    });

    return () => {
      globalRAF.remove("lenis");
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
