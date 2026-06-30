"use client";

import { useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";
import SplitText from "@/components/ui/SplitText";

const ParticleBackground = dynamic(
  () => import("@/components/three/ParticleBackground"),
  { ssr: false }
);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useSafeAnimation(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      // Split text animation — each char reveals from below
      tl.fromTo(
        ".hero-heading .split-char",
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.6,
          stagger: 0.02,
          ease: "power3.out",
        }
      );

      // Gradient word special emphasis
      tl.fromTo(
        ".hero-gradient-word",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
        "-=0.3"
      );

      // Subtitle
      tl.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      // CTA buttons stagger
      tl.fromTo(
        ".hero-cta-btn",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.5)",
        },
        "-=0.3"
      );

      // Scroll indicator
      tl.fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.1"
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden bg-background"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--color-background)_70%)] z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <h1 className="hero-heading font-[family-name:var(--font-clash-display)] text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight overflow-hidden">
          <SplitText>Creamos tecnología que</SplitText>
          <br />
          <span className="hero-gradient-word text-gradient inline-block opacity-0">
            transforma
          </span>{" "}
          <SplitText>negocios</SplitText>
        </h1>

        <p className="hero-subtitle mt-8 text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed opacity-0">
          E-commerce inteligente y sistemas ERP a medida. Automatizamos,
          integramos y escalamos tu operación con tecnología de vanguardia.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contacto"
            className="hero-cta-btn inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-background font-semibold text-base hover:bg-accent-hover transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.02] opacity-0"
          >
            Solicita tu auditoría gratuita
          </a>
          <a
            href="#portafolio"
            data-cursor="action"
            data-cursor-text="Ver"
            className="hero-cta-btn inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/10 text-foreground font-medium text-base hover:border-accent/40 hover:text-accent transition-all duration-300 opacity-0"
          >
            Ver proyectos
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll mt-24 opacity-0">
          <div className="w-5 h-9 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5 mx-auto animate-bounce">
            <div className="w-1 h-2.5 rounded-full bg-accent/60 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
