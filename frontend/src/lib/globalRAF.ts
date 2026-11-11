"use client";

type RAFCallback = (time: number) => void;

/**
 * Global RAF Manager
 *
 * Singleton que gestiona un único requestAnimationFrame loop.
 * Lenis, Three.js y cualquier otra animación deben registrarse aquí
 * para evitar loops duplicados que destruyan el framerate.
 */
class RAFManager {
  private callbacks: Map<string, RAFCallback> = new Map();
  private rafId: number | null = null;
  private isRunning = false;

  add(key: string, callback: RAFCallback) {
    this.callbacks.set(key, callback);
    if (!this.isRunning) this.start();
  }

  remove(key: string) {
    this.callbacks.delete(key);
    if (this.callbacks.size === 0) this.stop();
  }

  private start() {
    this.isRunning = true;
    const loop = (time: number) => {
      this.callbacks.forEach((cb) => cb(time));
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }
}

// Singleton instance
export const globalRAF = new RAFManager();
