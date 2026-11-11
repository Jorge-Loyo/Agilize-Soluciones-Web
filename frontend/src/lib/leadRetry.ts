"use client";

/**
 * Lead Retry System
 *
 * Si el envío del formulario falla (red caída, API de Resend down, etc.),
 * los datos se guardan en localStorage y se reintentan automáticamente
 * en background cuando el usuario vuelve a visitar la página.
 *
 * El usuario SIEMPRE ve "¡Éxito!" — nunca sabe que hubo un fallo.
 */

interface PendingLead {
  name: string;
  email: string;
  company: string;
  businessType: string;
  painPoint: string;
  timestamp: number;
  attempts: number;
}

const STORAGE_KEY = "agilize_pending_leads";
const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 5000; // 5s, 10s, 20s (exponential)

// Simple obfuscation (not real encryption, just prevents casual reading)
function obfuscate(data: string): string {
  return btoa(encodeURIComponent(data));
}

function deobfuscate(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

/**
 * Save a failed lead to localStorage for later retry
 */
export function savePendingLead(lead: Omit<PendingLead, "timestamp" | "attempts">) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const pending: PendingLead[] = stored
      ? JSON.parse(deobfuscate(stored))
      : [];

    pending.push({
      ...lead,
      timestamp: Date.now(),
      attempts: 0,
    });

    localStorage.setItem(STORAGE_KEY, obfuscate(JSON.stringify(pending)));
  } catch {
    // localStorage unavailable or full — silently fail
  }
}

/**
 * Retry all pending leads with exponential backoff
 * Call this on page load (useEffect in layout or page)
 */
export async function retryPendingLeads() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const pending: PendingLead[] = JSON.parse(deobfuscate(stored));
    if (pending.length === 0) return;

    const remaining: PendingLead[] = [];

    for (const lead of pending) {
      if (lead.attempts >= MAX_ATTEMPTS) {
        // Max attempts reached — discard (could send to a fallback endpoint)
        console.warn("[LeadRetry] Max attempts reached, discarding:", lead.email);
        continue;
      }

      // Exponential backoff: only retry if enough time has passed
      const delay = BASE_DELAY_MS * Math.pow(2, lead.attempts);
      const timeSinceLastAttempt = Date.now() - lead.timestamp;

      if (timeSinceLastAttempt < delay) {
        remaining.push(lead);
        continue;
      }

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: lead.name,
            email: lead.email,
            company: lead.company,
            businessType: lead.businessType,
            painPoint: lead.painPoint,
          }),
        });

        if (res.ok) {
          console.log("[LeadRetry] Successfully retried lead:", lead.email);
          // Success — don't add to remaining
        } else if (res.status === 429) {
          // Rate limited — try again later
          remaining.push({ ...lead, attempts: lead.attempts + 1, timestamp: Date.now() });
        } else {
          remaining.push({ ...lead, attempts: lead.attempts + 1, timestamp: Date.now() });
        }
      } catch {
        // Network still down
        remaining.push({ ...lead, attempts: lead.attempts + 1, timestamp: Date.now() });
      }
    }

    if (remaining.length > 0) {
      localStorage.setItem(STORAGE_KEY, obfuscate(JSON.stringify(remaining)));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Parsing error — clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
}
