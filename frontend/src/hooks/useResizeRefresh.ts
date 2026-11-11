"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * useResizeRefresh
 *
 * Escucha eventos de resize y orientationchange con debounce
 * y ejecuta ScrollTrigger.refresh() para recalcular posiciones.
 *
 * Esto previene que las secciones pinned se desencajen al rotar
 * el dispositivo o redimensionar la ventana del navegador.
 *
 * Se debe usar UNA VEZ en un componente de alto nivel (layout/page).
 */
export function useResizeRefresh(debounceMs: number = 300) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, debounceMs);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, {
      passive: true,
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [debounceMs]);
}
