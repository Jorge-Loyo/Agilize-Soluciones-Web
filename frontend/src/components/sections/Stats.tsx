"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 100, suffix: "%", label: "Proyectos entregados a tiempo" },
  { value: 50, suffix: "%+", label: "Reducción de tareas manuales" },
  { value: 24, suffix: "/7", label: "Soporte post-entrega" },
  { value: 3, suffix: "x", label: "ROI promedio del cliente" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useSafeAnimation(
    () => {
      // Clip-path reveal for the whole section
      gsap.fromTo(
        sectionRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Counter animation for each stat
      const counters = document.querySelectorAll(".stat-value");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-value") || "0", 10);

        gsap.fromTo(
          counter,
          { innerText: "0" },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 80%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Labels fade in stagger
      gsap.fromTo(
        ".stat-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-20 border-y border-white/5 bg-surface/30"
      style={{ clipPath: "inset(100% 0% 0% 0%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-baseline justify-center">
                <span
                  className="stat-value text-4xl md:text-5xl font-bold text-accent font-[family-name:var(--font-clash-display)]"
                  data-value={stat.value}
                >
                  0
                </span>
                <span className="text-2xl md:text-3xl font-bold text-accent/70 ml-0.5">
                  {stat.suffix}
                </span>
              </div>
              <p className="stat-label mt-3 text-sm text-foreground-muted opacity-0">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
