"use client";

import { useRef } from "react";
import Image from "next/image";
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
    images: {
      desktop: "/images/portfolio/agilize-dark-1920w.webp",
      desktopAlt: "/images/portfolio/agilize-light-1920w.webp",
    },
  },
  {
    id: "casa-dulce-oriente",
    title: "Casa Dulce Oriente",
    category: "E-commerce",
    description:
      "Tienda online completa con catálogo dinámico, carrito inteligente y sistema de gestión de pedidos integrado con logística.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    color: "#f5a623",
    images: {
      desktop: "/images/portfolio/casa-dulce-home-1920w.webp",
      mobile: "/images/portfolio/casa-dulce-home-mobile.webp",
    },
  },
  {
    id: "infodets",
    title: "Infodets",
    category: "IA · RAG",
    description:
      "Plataforma web con IA (RAG) que responde consultas ciudadanas basándose en documentación oficial, con motor de mejora continua que detecta vacíos de información.",
    tech: ["Next.js", "FastAPI", "Python", "Docker"],
    color: "#ffffff",
    images: {
      desktop: "/images/portfolio/infodets-home-1920w.webp",
      desktopAlt: "/images/portfolio/infodets-consulta-1920w.webp",
    },
  },
  {
    id: "next-project",
    title: "Tu Proyecto",
    category: "¿El siguiente?",
    description:
      "Cada negocio es único. Contanos tu desafío y diseñamos la solución tecnológica perfecta para tu operación.",
    tech: ["A medida", "Escalable", "Premium", "Tu stack"],
    color: "#d4af37",
    images: null,
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useSafeAnimation(
    () => {
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

      const mm = gsap.matchMedia();

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

      mm.add("(max-width: 767px)", () => {
        const cards = track.querySelectorAll(".portfolio-card");
        cards.forEach((card) => {
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
      <div className="portfolio-title pt-32 pb-16 px-6 max-w-7xl mx-auto opacity-0">
        <span className="text-accent text-sm font-semibold uppercase tracking-widest">
          Portafolio
        </span>
        <h2 className="font-[family-name:var(--font-clash-display)] text-4xl md:text-6xl font-bold mt-4">
          Proyectos que{" "}
          <span className="text-foreground-muted">hablan por sí solos.</span>
        </h2>
      </div>

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
              {/* Mockup area */}
              <div className="relative h-[50%] min-h-[280px] bg-gradient-to-br from-surface-light to-surface overflow-hidden">
                {project.images ? (
                  <div className="portfolio-mockup absolute inset-0 flex items-center justify-center p-6 will-change-transform">
                    <MockupDisplay project={project} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">🚀</span>
                      <p className="text-foreground-muted text-sm">Tu idea aquí</p>
                    </div>
                  </div>
                )}

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

/* Device frame mockup component */
function MockupDisplay({ project }: { project: (typeof PROJECTS)[number] }) {
  const { images } = project;
  if (!images) return null;

  const hasMobile = "mobile" in images && images.mobile;
  const hasAlt = "desktopAlt" in images && images.desktopAlt;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Desktop frame */}
      <div className={`relative ${hasMobile ? "w-[75%]" : "w-[85%]"} max-w-[600px]`}>
        <div className="rounded-lg border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2a2a] border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex-1 h-4 rounded bg-white/5" />
          </div>
          {/* Screenshot */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={images.desktop}
              alt={`${project.title} - vista desktop`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>
        </div>

        {/* Alt screenshot (smaller, overlapping) for dual-mode projects */}
        {hasAlt && (
          <div className="absolute -bottom-4 -right-6 w-[55%] rounded-lg border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-[#2a2a2a] border-b border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={images.desktopAlt!}
                alt={`${project.title} - vista alternativa`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile frame (for projects with mobile screenshot) */}
      {hasMobile && (
        <div className="absolute bottom-2 right-4 w-[22%] max-w-[120px]">
          <div className="rounded-2xl border-2 border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="flex justify-center py-1.5 bg-[#1a1a1a]">
              <span className="w-12 h-1.5 rounded-full bg-white/10" />
            </div>
            {/* Screen */}
            <div className="relative aspect-[9/19] overflow-hidden">
              <Image
                src={images.mobile}
                alt={`${project.title} - vista mobile`}
                fill
                className="object-cover object-top"
                sizes="120px"
              />
            </div>
            {/* Home indicator */}
            <div className="flex justify-center py-1.5 bg-[#1a1a1a]">
              <span className="w-8 h-1 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
