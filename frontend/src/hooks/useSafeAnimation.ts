"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * useSafeAnimation
 *
 * Wrapper seguro para animaciones GSAP en React/Next.js.
 * Aísla todas las animaciones dentro de un gsap.context() que se limpia
 * automáticamente cuando el componente se desmonta.
 *
 * Esto previene:
 * - Instancias duplicadas de ScrollTrigger en React StrictMode
 * - Fugas de memoria por triggers zombies al navegar
 * - Parpadeos visuales (glitches) por animaciones huérfanas
 *
 * @param animationFn - Función que contiene la lógica de animación GSAP
 * @param scopeRef - Ref del elemento contenedor (scope del contexto)
 * @param dependencies - Array de dependencias para re-ejecutar la animación
 *
 * @example
 * ```tsx
 * const sectionRef = useRef<HTMLElement>(null);
 *
 * useSafeAnimation((ctx) => {
 *   gsap.fromTo(".title", { opacity: 0 }, { opacity: 1 });
 *   // ScrollTrigger también se limpia automáticamente
 * }, sectionRef, []);
 * ```
 */
export function useSafeAnimation(
  animationFn: (ctx: gsap.Context) => void,
  scopeRef: React.RefObject<HTMLElement | null>,
  dependencies: React.DependencyList = []
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    // Limpiar contexto previo si existe (por StrictMode re-mount)
    if (ctxRef.current) {
      ctxRef.current.revert();
    }

    const ctx = gsap.context((self) => {
      animationFn(self);
    }, scopeRef);

    ctxRef.current = ctx;

    return () => {
      ctx.revert(); // Limpia todos los triggers, tweens y timelines del scope
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
