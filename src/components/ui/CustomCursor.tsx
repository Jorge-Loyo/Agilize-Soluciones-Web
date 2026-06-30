"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "hover" | "action" | "hidden";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device — disable custom cursor
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Hide native cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    // Mouse position tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    // Lerp animation loop
    const lerpFactor = 0.12;
    let rafId: number;

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerpFactor;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerpFactor;

      // Main dot (faster, less lerp)
      cursor.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0) translate(-50%, -50%)`;

      // Follower ring (with lerp for weight)
      follower.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // State management via data attributes and event delegation
    const setCursorState = (state: CursorState, text?: string) => {
      if (!cursor || !follower) return;

      switch (state) {
        case "hover":
          gsap.to(follower, {
            width: 60,
            height: 60,
            borderColor: "rgba(212, 175, 55, 0.4)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(cursor, {
            scale: 0.5,
            opacity: 0.5,
            duration: 0.3,
          });
          break;

        case "action":
          gsap.to(follower, {
            width: 80,
            height: 80,
            backgroundColor: "rgba(212, 175, 55, 0.08)",
            borderColor: "rgba(212, 175, 55, 0.6)",
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(cursor, {
            scale: 0,
            duration: 0.3,
          });
          if (textRef.current) {
            textRef.current.textContent = text || "Ver";
            gsap.to(textRef.current, { opacity: 1, scale: 1, duration: 0.3 });
          }
          break;

        case "hidden":
          gsap.to(follower, { scale: 0, duration: 0.3 });
          gsap.to(cursor, { scale: 0, duration: 0.3 });
          break;

        default:
          gsap.to(follower, {
            width: 40,
            height: 40,
            backgroundColor: "transparent",
            borderColor: "rgba(255, 255, 255, 0.15)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(cursor, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
          });
          if (textRef.current) {
            gsap.to(textRef.current, { opacity: 0, scale: 0.8, duration: 0.2 });
          }
          break;
      }
    };

    // Event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closest = target.closest("[data-cursor]") as HTMLElement | null;

      if (closest) {
        const state = closest.dataset.cursor as CursorState;
        const text = closest.dataset.cursorText;
        setCursorState(state, text);
      } else if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      ) {
        setCursorState("hover");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;

      if (target.closest("[data-cursor]") && !related?.closest("[data-cursor]")) {
        setCursorState("default");
      } else if (
        (target.closest("a") || target.closest("button")) &&
        !(related?.closest("a") || related?.closest("button"))
      ) {
        setCursorState("default");
      }
    };

    // Hide on mouse leave window
    const handleMouseLeave = () => setCursorState("hidden");
    const handleMouseEnter = () => setCursorState("default");

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Main dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>

      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform flex items-center justify-center"
      >
        <div
          className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-none"
          style={{ width: "inherit", height: "inherit", borderColor: "inherit", backgroundColor: "inherit" }}
        />
        <span
          ref={textRef}
          className="absolute text-accent text-xs font-semibold opacity-0 scale-[0.8]"
        />
      </div>
    </>
  );
}
