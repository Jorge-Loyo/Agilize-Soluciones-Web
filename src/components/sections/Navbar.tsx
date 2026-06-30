"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

const NAV_LINKS = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

function MagneticCTA() {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.3, radius: 40 });
  return (
    <a
      ref={ref}
      href="#contacto"
      className="inline-flex items-center px-5 py-2.5 rounded-full bg-accent text-background text-sm font-semibold hover:bg-accent-hover transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
    >
      Agenda tu consulta
    </a>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (mobileOpen) {
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      // Stagger links
      gsap.fromTo(
        menu.querySelectorAll(".mobile-link"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, delay: 0.1, ease: "power2.out" }
      );
    } else {
      gsap.to(menu, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Skip to content — a11y */}
      <a
        href="#soluciones"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg px-1"
            aria-label="Agilize Soluciones - Inicio"
          >
            <span className="text-xl md:text-2xl font-bold text-accent transition-all group-hover:text-accent-hover">
              Agilize
            </span>
            <span className="text-xl md:text-2xl font-light text-foreground/80">
              Soluciones
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:text-accent focus:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <div className="hidden md:block">
            <MagneticCTA />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground/70 hover:text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          style={{ height: 0, opacity: 0 }}
          role="menu"
          aria-hidden={!mobileOpen}
        >
          <div className="px-6 py-6 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="mobile-link text-base text-foreground/70 hover:text-accent transition-colors py-3 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:text-accent"
                role="menuitem"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="mobile-link mt-4 inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-accent text-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface"
              role="menuitem"
            >
              Agenda tu consulta
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
