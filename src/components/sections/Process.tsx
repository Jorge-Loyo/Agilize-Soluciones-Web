"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Descubrimiento",
    description:
      "Analizamos tu operación actual, identificamos puntos de fricción y definimos objetivos medibles.",
    detail: "Auditoría gratuita de tu proceso actual",
  },
  {
    number: "02",
    title: "Arquitectura",
    description:
      "Diseñamos la solución técnica ideal: estructura de datos, flujos de usuario y stack tecnológico.",
    detail: "Prototipo funcional en 5 días",
  },
  {
    number: "03",
    title: "Desarrollo",
    description:
      "Construimos en sprints cortos con entregas semanales visibles. Feedback constante, sin sorpresas.",
    detail: "Entregas incrementales cada semana",
  },
  {
    number: "04",
    title: "Lanzamiento",
    description:
      "Deploy en producción, migración de datos y capacitación de tu equipo. Soporte continuo post-lanzamiento.",
    detail: "Soporte 24/7 post-entrega",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useSafeAnimation(
    () => {
      // Title
      gsap.fromTo(
        ".process-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Animated line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 40%",
              end: "bottom 60%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Steps — matchMedia for responsive animations
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const steps = document.querySelectorAll(".process-step");
        steps.forEach((step, i) => {
          gsap.fromTo(
            step,
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        const steps = document.querySelectorAll(".process-step");
        steps.forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });
    },
    sectionRef,
    []
  );

  return (
    <section ref={sectionRef} id="proceso" className="relative py-32 px-6">
      {/* Connecting line from previous section */}
      <div className="absolute left-[28px] md:left-1/2 top-0 h-32 w-px bg-gradient-to-b from-transparent to-white/5 -translate-x-1/2" />

      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="process-title text-center mb-24 opacity-0">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Proceso
          </span>
          <h2 className="font-[family-name:var(--font-clash-display)] text-4xl md:text-6xl font-bold mt-4">
            De idea a{" "}
            <span className="text-foreground-muted">producción.</span>
          </h2>
          <p className="mt-6 text-foreground-muted text-lg max-w-xl mx-auto">
            Un proceso claro, iterativo y transparente. Siempre sabrás en qué
            etapa estamos.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-accent to-accent/30 origin-top"
            />
          </div>

          {/* Steps */}
          <div className="space-y-20">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`process-step relative flex items-start gap-8 md:gap-16 opacity-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background z-10 shadow-lg shadow-accent/30" />

                {/* Content */}
                <div
                  className={`ml-16 md:ml-0 md:w-[45%] ${
                    index % 2 === 0 ? "md:text-right md:pr-16" : "md:text-left md:pl-16"
                  }`}
                >
                  <span className="text-accent/50 text-sm font-mono font-bold">
                    {step.number}
                  </span>
                  <h3 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-foreground mt-1 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                    {step.detail}
                  </span>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
