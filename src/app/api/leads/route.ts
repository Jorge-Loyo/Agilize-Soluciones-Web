import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ── Zod Schema ──────────────────────────────────────
const LeadSchema = z.object({
  name: z
    .string()
    .min(2, "Nombre demasiado corto")
    .max(100, "Nombre demasiado largo")
    .transform((v) => sanitize(v)),
  email: z
    .string()
    .email("Email inválido")
    .max(254)
    .transform((v) => v.toLowerCase().trim()),
  company: z
    .string()
    .max(100)
    .optional()
    .default("")
    .transform((v) => sanitize(v)),
  businessType: z.enum(["ecommerce", "erp", "custom"], {
    message: "Tipo de negocio inválido",
  }),
  painPoint: z
    .string()
    .min(10, "Describí tu desafío con al menos 10 caracteres")
    .max(2000, "Descripción demasiado larga")
    .transform((v) => sanitize(v)),
});

// ── Sanitization ────────────────────────────────────
function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

// ── Rate Limiting (in-memory, per-IP) ───────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Cleanup stale entries every 5 minutes
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
}

// ── Business type labels ────────────────────────────
const BUSINESS_TYPE_LABELS: Record<string, string> = {
  ecommerce: "E-commerce Inteligente",
  erp: "Sistema ERP",
  custom: "Proyecto Personalizado",
};

// ── Main Handler ────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intentá de nuevo en un minuto." },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = LeadSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, email, company, businessType, painPoint } = result.data;
    const typeLabel = BUSINESS_TYPE_LABELS[businessType] || businessType;

    // Send notification email to owner
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFICATION_EMAIL =
      process.env.NOTIFICATION_EMAIL || "contacto@agilizesoluciones.uk";

    if (RESEND_API_KEY) {
      // Notification to you
      const notifResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Agilize Web <leads@agilizesoluciones.uk>",
          to: [NOTIFICATION_EMAIL],
          subject: `🟡 Nuevo Lead: ${name} - ${typeLabel}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f8f9fa; padding: 32px; border-radius: 16px;">
              <h2 style="color: #d4af37; margin-top: 0;">Nuevo Lead desde Agilize Web</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333; font-weight: bold; color: #a1a1aa; width: 120px;">Nombre</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333; font-weight: bold; color: #a1a1aa;">Email</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333;"><a href="mailto:${email}" style="color: #d4af37;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333; font-weight: bold; color: #a1a1aa;">Empresa</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333;">${company || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333; font-weight: bold; color: #a1a1aa;">Tipo</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #333;">${typeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; font-weight: bold; color: #a1a1aa; vertical-align: top;">Desafío</td>
                  <td style="padding: 12px 8px;">${painPoint}</td>
                </tr>
              </table>
              <p style="color: #666; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
                IP: ${ip} · ${new Date().toISOString()}
              </p>
            </div>
          `,
        }),
      });

      if (!notifResponse.ok) {
        console.error(
          "Resend notification failed:",
          await notifResponse.text()
        );
      }

      // Confirmation to prospect
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Agilize Soluciones <hola@agilizesoluciones.uk>",
          to: [email],
          subject: "¡Recibimos tu solicitud! - Agilize Soluciones",
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d4af37;">¡Hola ${name}!</h2>
              <p>Recibimos tu solicitud de auditoría gratuita. Nuestro equipo analizará tu caso y te contactará en <strong>menos de 24 horas</strong> con una propuesta personalizada.</p>
              <p><strong>Lo que analizaremos:</strong></p>
              <ul>
                <li>Oportunidades de automatización en tu operación</li>
                <li>Stack tecnológico recomendado para tu caso</li>
                <li>Roadmap estimado de implementación</li>
                <li>Presupuesto orientativo sin compromiso</li>
              </ul>
              <p>Mientras tanto, podés ver nuestro <a href="https://agilizesoluciones.uk/#portafolio" style="color: #d4af37;">portafolio</a> para conocer más sobre nuestro trabajo.</p>
              <br>
              <p style="color: #666;">— Jorge Loyo<br>Agilize Soluciones</p>
            </div>
          `,
        }),
      });
    }

    // Log the lead (stdout for PM2 logs)
    console.log(
      `[LEAD] ${new Date().toISOString()} | ${name} | ${email} | ${typeLabel} | IP: ${ip}`
    );

    return NextResponse.json(
      { success: true, message: "Lead registrado correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[LEAD ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
