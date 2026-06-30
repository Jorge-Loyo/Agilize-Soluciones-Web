"use client";

import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Solutions from "@/components/sections/Solutions";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import { useResizeRefresh } from "@/hooks/useResizeRefresh";
import { retryPendingLeads } from "@/lib/leadRetry";

export default function HomePage() {
  // Recalcular ScrollTrigger positions on resize/orientation change
  useResizeRefresh(300);

  // Retry any pending leads from previous failed submissions
  useEffect(() => {
    // Small delay to not block initial render
    const timer = setTimeout(() => {
      retryPendingLeads();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <Solutions />
      <Portfolio />
      <Process />
      <Contact />
    </>
  );
}
