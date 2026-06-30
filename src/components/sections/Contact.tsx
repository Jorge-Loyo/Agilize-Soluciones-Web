"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSafeAnimation } from "@/hooks/useSafeAnimation";
import { savePendingLead } from "@/lib/leadRetry";
import { trackEvent } from "@/components/ui/Analytics";

gsap.registerPlugin(ScrollTrigger);

type FormData = {
  name: string;
  email: string;
  company: string;
  businessType: "ecommerce" | "erp" | "custom" | "";
  painPoint: string;
};

const BUSINESS_TYPES = [
  { value: "ecommerce", label: "Tienda Online", icon: "🛒", desc: "Vender productos o servicios" },
  { value: "erp", label: "Sistema de Gestión", icon: "⚙️", desc: "Controlar mi operación" },
  { value: "custom", label: "Otro proyecto", icon: "🚀", desc: "Tengo una idea diferente" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    businessType: "",
    painPoint: "",
  });

  useSafeAnimation(
    () => {
      gsap.fromTo(
        ".contact-title",
        { opacity: 0, y: 50, clipPath: "inset(100% 0% 0% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );
    },
    sectionRef,
    []
  );

  // Animate step transitions
  useEffect(() => {
    const stepEl = document.querySelector(`.step-${step}`);
    if (stepEl) {
      gsap.fromTo(
        stepEl,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [step]);

  const handleSubmit = async () => {
    // Honeypot check — bots fill hidden fields
    if (honeypot) return;

    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSent(true);
        trackEvent("lead_submitted", { type: formData.businessType });
      } else if (res.status === 429) {
        // Rate limited — save for retry, show success
        savePendingLead(formData);
        setSent(true);
      } else {
        // Other error — save for retry, show success anyway
        savePendingLead(formData);
        setSent(true);
      }
    } catch {
      // Network error — save locally for retry
      savePendingLead(formData);
      setSent(true); // User always sees success
    } finally {
      setSending(false);
    }
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
      trackEvent("form_step_completed", { step: step + 1 });
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.name.trim() !== "" && formData.email.trim() !== "";
      case 1:
        return formData.businessType !== "";
      case 2:
        return formData.painPoint.trim() !== "";
      default:
        return false;
    }
  };

  if (sent) {
    return (
      <section ref={sectionRef} id="contacto" className="relative py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="font-[family-name:var(--font-clash-display)] text-4xl font-bold text-foreground mb-4">
            ¡Solicitud recibida!
          </h2>
          <p className="text-foreground-muted text-lg mb-2">
            Analizaremos tu caso y te contactaremos en menos de 24 horas.
          </p>
          <p className="text-foreground-muted/60 text-sm">
            Revisá tu bandeja de entrada — te enviamos un resumen de lo conversado.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contacto" className="relative py-20 md:py-32 px-4 md:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Title */}
        <div className="contact-title text-center mb-16 opacity-0">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Sin compromiso
          </span>
          <h2 className="font-[family-name:var(--font-clash-display)] text-4xl md:text-6xl font-bold mt-4">
            Auditoría{" "}
            <span className="text-gradient">gratuita</span> de tu negocio.
          </h2>
          <p className="mt-6 text-foreground-muted text-lg max-w-xl mx-auto">
            En 3 pasos simples recibís un análisis técnico personalizado con
            oportunidades concretas de mejora. Sin letra chica.
          </p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            nextStep();
          }}
          className="relative rounded-3xl border border-white/5 bg-surface/30 backdrop-blur-sm p-6 md:p-12 opacity-0"
          aria-label="Formulario de auditoría gratuita"
        >
          {/* Honeypot — invisible to users, bots fill it */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Progress bar */}
          <div className="flex gap-2 mb-8 md:mb-10" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3} aria-label={`Paso ${step + 1} de 3`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-accent" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Step 0: Info */}
          {step === 0 && (
            <div className="step-0 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Primero, presentémonos
                </h3>
                <p className="text-sm text-foreground-muted">
                  Necesitamos saber cómo contactarte con la propuesta.
                </p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 md:px-5 py-4 rounded-xl bg-background/50 border border-white/10 text-foreground text-base placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  autoComplete="name"
                  aria-label="Nombre completo"
                  aria-required="true"
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 md:px-5 py-4 rounded-xl bg-background/50 border border-white/10 text-foreground text-base placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  autoComplete="email"
                  aria-label="Email de contacto"
                  aria-required="true"
                />
                <input
                  type="text"
                  placeholder="Nombre de tu empresa (opcional)"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 md:px-5 py-4 rounded-xl bg-background/50 border border-white/10 text-foreground text-base placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  autoComplete="organization"
                  aria-label="Nombre de empresa"
                />
              </div>
            </div>
          )}

          {/* Step 1: Type */}
          {step === 1 && (
            <div className="step-1 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  ¿Qué necesitás construir?
                </h3>
                <p className="text-sm text-foreground-muted">
                  Elegí la opción que mejor represente tu objetivo principal.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        businessType: type.value as FormData["businessType"],
                      })
                    }
                    className={`p-6 rounded-2xl border text-center transition-all duration-300 ${
                      formData.businessType === type.value
                        ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                        : "border-white/10 bg-background/30 hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl block mb-3">{type.icon}</span>
                    <span className="text-sm font-semibold text-foreground block">
                      {type.label}
                    </span>
                    <span className="text-xs text-foreground-muted mt-1 block">
                      {type.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pain point */}
          {step === 2 && (
            <div className="step-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Último paso: tu desafío
                </h3>
                <p className="text-sm text-foreground-muted">
                  Cuanto más detalle nos des, más precisa será nuestra propuesta.
                </p>
              </div>
              <textarea
                placeholder="Ej: Necesito una tienda online que maneje mi inventario automáticamente y me muestre métricas de ventas en tiempo real..."
                value={formData.painPoint}
                onChange={(e) =>
                  setFormData({ ...formData, painPoint: e.target.value })
                }
                rows={5}
                className="w-full px-4 md:px-5 py-4 rounded-xl bg-background/50 border border-white/10 text-foreground text-base placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                aria-label="Describí tu desafío principal"
                aria-required="true"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 md:mt-10">
            <button
              type="button"
              onClick={prevStep}
              className={`text-sm text-foreground-muted hover:text-foreground transition-colors ${
                step === 0 ? "invisible" : ""
              }`}
            >
              ← Anterior
            </button>

            <button
              type="submit"
              disabled={!canProceed() || sending}
              className="px-6 md:px-8 py-3.5 rounded-full bg-accent text-background font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {sending
                ? "Enviando..."
                : step === 2
                ? "Solicitar auditoría gratuita"
                : "Continuar →"}
            </button>
          </div>

          {/* Trust indicator */}
          <p className="text-center text-xs text-foreground-muted/40 mt-6">
            🔒 Tus datos están seguros. No compartimos información con terceros.
          </p>
        </form>
      </div>
    </section>
  );
}
