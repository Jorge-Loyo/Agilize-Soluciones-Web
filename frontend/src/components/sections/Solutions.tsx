"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";

gsap.registerPlugin(ScrollTrigger);

const SOLUTIONS = [
  {
    id: "ecommerce",
    title: "E-commerce Inteligente",
    description:
      "Tiendas online que venden solas. Sistemas de inventario inteligente, pasarelas de pago integradas y analítica de comportamiento de compra en tiempo real.",
    features: [
      "Catálogos dinámicos con IA",
      "Gestión de inventario automatizada",
      "Pasarelas de pago múltiples",
      "Dashboard de métricas en vivo",
    ],
    icon: "🛒",
    gradient: "from-amber-500/10 to-yellow-600/5",
  },
  {
    id: "erp",
    title: "Sistemas de Control ERP",
    description:
      "El cerebro operativo de tu empresa. Centraliza ventas, inventario, finanzas y recursos humanos en una sola plataforma desarrollada 100% a tu medida.",
    features: [
      "Módulos personalizados por área",
      "Reportes gerenciales automáticos",
      "Integración con facturación electrónica",
      "Control de acceso por roles",
    ],
    icon: "⚙️",
    gradient: "from-accent/10 to-amber-700/5",
  },
];

export default function Solutions() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useSafeAnimation(
    () => {
      // Section title clip-path reveal (wipe from bottom)
      gsap.fromTo(
        ".solutions-title",
        { opacity: 0, y: 60, clipPath: "inset(100% 0% 0% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".solutions-title",
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Cards stagger animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotateX: 5 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 60%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
            delay: i * 0.15,
          }
        );
      });

      // Tech pills stagger + subtle float on scroll
      gsap.fromTo(
        ".tech-pill",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".tech-pills-container",
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      // Parallax float effect on pills when scrolling past
      gsap.to(".tech-pills-container", {
        y: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".tech-pills-container",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    sectionRef,
    []
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt on touch/mobile devices
    if (window.innerWidth < 1024) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;

    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="soluciones"
      className="relative py-20 md:py-32 px-4 md:px-6"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Title */}
        <div className="solutions-title text-center mb-20 opacity-0">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Nuestras Soluciones
          </span>
          <h2 className="font-[family-name:var(--font-clash-display)] text-4xl md:text-6xl font-bold mt-4">
            Dos verticales.{" "}
            <span className="text-foreground-muted">Infinitas posibilidades.</span>
          </h2>
          <p className="mt-6 text-foreground-muted text-lg max-w-2xl mx-auto">
            Empaquetamos años de experiencia en soluciones concretas orientadas
            a resultados medibles para tu negocio.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SOLUTIONS.map((solution, index) => (
            <div
              key={solution.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              data-cursor="action"
              data-cursor-text="Explorar"
              className={`group relative rounded-3xl border border-white/5 bg-gradient-to-br ${solution.gradient} backdrop-blur-sm p-6 md:p-10 transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:border-accent/20 will-change-transform`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),_var(--color-accent-glow),_transparent_40%)] pointer-events-none" />

              <div className="relative" style={{ transform: "translateZ(20px)" }}>
                <span className="text-5xl mb-6 block">{solution.icon}</span>
                <h3 className="font-[family-name:var(--font-clash-display)] text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {solution.title}
                </h3>
                <p className="text-foreground-muted leading-relaxed mb-8">
                  {solution.description}
                </p>

                <ul className="space-y-3">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <a
                    href="#contacto"
                    className="inline-flex items-center text-accent text-sm font-semibold group/link"
                  >
                    Explorar solución
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-services */}
        <div className="tech-pills-container mt-16 text-center">
          <p className="text-foreground-muted text-sm mb-6">
            Tecnologías que potencian ambas verticales:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Automatización", "APIs REST", "Infraestructura Cloud", "Testing & QA", "Analítica Avanzada", "Integraciones"].map(
              (tech, i) => (
                <span
                  key={tech}
                  className="tech-pill px-4 py-2 rounded-full bg-surface border border-white/5 text-foreground-muted text-xs font-medium hover:border-accent/30 hover:text-accent transition-all duration-200 opacity-0"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
