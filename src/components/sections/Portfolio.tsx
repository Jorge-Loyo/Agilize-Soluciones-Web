"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "agilize-gestion",
    title: "Agilize Gestión",
    category: "Sistema ERP",
    description:
      "Panel administrativo integral para gestión de proyectos, clientes y servicios. Control total de la operación desde un único dashboard.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Tailwind CSS"],
    color: "#d4af37",
    image: "/images/agilize-mockup.webp",
  },
  {
    id: "casa-dulce-oriente",
    title: "Casa Dulce Oriente",
    category: "E-commerce",
    description:
      "Tienda online completa con catálogo dinámico, carrito inteligente y sistema de gestión de pedidos integrado con logística.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    color: "#f5a623",
    image: "/images/casa-dulce-mockup.webp",
  },
  {
    id: "next-project",
    title: "Tu Proyecto",
    category: "¿El siguiente?",
    description:
      "Cada negocio es único. Contanos tu desafío y diseñamos la solución tecnológica perfecta para tu operación.",
    tech: ["A medida", "Escalable", "Premium", "Tu stack"],
    color: "#d4af37",
    image: null,
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useSafeAnimation(
    () => {
      // Title reveal
      gsap.fromTo(
        ".portfolio-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      const track = trackRef.current;
      if (!track) return;

      // Use matchMedia for responsive animation strategies
      const mm = gsap.matchMedia();

      // Desktop: horizontal pinned scroll + parallax
      mm.add("(min-width: 768px)", () => {
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Parallax on mockup images
        const mockups = track.querySelectorAll(".portfolio-mockup");
        mockups.forEach((mockup) => {
          gsap.fromTo(
            mockup,
            { x: 60 },
            {
              x: -60,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollAmount()}`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Cards fade-in as they scroll in
        const cards = track.querySelectorAll(".portfolio-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0.3, scale: 0.9, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: () => `top+=${i * (getScrollAmount() / cards.length)} top`,
                end: () => `top+=${(i + 0.5) * (getScrollAmount() / cards.length)} top`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      // Mobile: simple vertical scroll with stagger reveals (no pin)
      mm.add("(max-width: 767px)", () => {
        const cards = track.querySelectorAll(".portfolio-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
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
    <section
      ref={sectionRef}
      id="portafolio"
      className="relative overflow-hidden"
    >
      {/* Title area */}
      <div className="portfolio-title pt-32 pb-16 px-6 max-w-7xl mx-auto opacity-0">
        <span className="text-accent text-sm font-semibold uppercase tracking-widest">
          Portafolio
        </span>
        <h2 className="font-[family-name:var(--font-clash-display)] text-4xl md:text-6xl font-bold mt-4">
          Proyectos que{" "}
          <span className="text-foreground-muted">hablan por sí solos.</span>
        </h2>
      </div>

      {/* Horizontal track (desktop) / Vertical stack (mobile) */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row gap-8 px-6 md:pl-6 md:pr-[40vw] py-10 will-change-transform"
      >
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="portfolio-card flex-shrink-0 w-full md:w-[60vw] lg:w-[45vw] group"
            data-cursor="action"
            data-cursor-text="Ver"
          >
            <div className="h-full rounded-3xl border border-white/5 bg-surface/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5">
              {/* Image area with parallax */}
              <div className="relative h-[50%] min-h-[280px] bg-gradient-to-br from-surface-light to-surface overflow-hidden">
                {project.image ? (
                  <div className="portfolio-mockup absolute inset-0 flex items-center justify-center p-8 will-change-transform">
                    <div className="w-full h-full rounded-xl bg-surface border border-white/5 flex items-center justify-center text-foreground-muted text-sm overflow-hidden">
                      {/* Placeholder — replace with next/image when mockups are ready */}
                      <div className="relative w-[80%] h-[80%] rounded-lg bg-background/50 border border-white/5 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl block mb-2 opacity-40">📱</span>
                          <span className="text-xs text-foreground-muted/50">{project.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">🚀</span>
                      <p className="text-foreground-muted text-sm">Tu idea aquí</p>
                    </div>
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: `${project.color}15`,
                      borderColor: `${project.color}30`,
                      color: project.color,
                    }}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-background/50 border border-white/5 text-xs text-foreground-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
