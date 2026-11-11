"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MagneticOptions {
  strength?: number; // 0-1, default 0.3
  radius?: number; // px, default 50
  ease?: string;
}

/**
 * useMagnetic
 *
 * Agrega efecto de magnetismo a un elemento: cuando el cursor se acerca
 * dentro del radio, el elemento se desplaza sutilmente hacia el puntero.
 * Al salir del radio, retorna con un efecto elástico.
 *
 * Solo se activa en desktop (no touch devices).
 *
 * @example
 * ```tsx
 * const buttonRef = useMagnetic<HTMLAnchorElement>({ strength: 0.3, radius: 50 });
 * return <a ref={buttonRef} href="#contacto">CTA</a>;
 * ```
 */
export function useMagnetic<T extends HTMLElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.3, radius = 50, ease = "power3.out" } = options;
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Skip on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Check if cursor is within magnetic radius
      const magneticRadius = Math.max(rect.width, rect.height) / 2 + radius;

      if (distance < magneticRadius) {
        const pull = (1 - distance / magneticRadius) * strength;
        gsap.to(el, {
          x: distX * pull,
          y: distY * pull,
          duration: 0.3,
          ease,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    // Listen on parent area (wider than the element itself)
    const parent = el.parentElement || document;
    parent.addEventListener("mousemove", handleMouseMove as EventListener, {
      passive: true,
    });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius, ease]);

  return elementRef;
}
