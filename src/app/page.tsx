"use client";

import { useEffect, lazy, Suspense } from "react";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import { useResizeRefresh } from "@/hooks/useResizeRefresh";
import { retryPendingLeads } from "@/lib/leadRetry";

const Solutions = lazy(() => import("@/components/sections/Solutions"));
const Portfolio = lazy(() => import("@/components/sections/Portfolio"));
const Process = lazy(() => import("@/components/sections/Process"));
const Contact = lazy(() => import("@/components/sections/Contact"));

export default function HomePage() {
  useResizeRefresh(300);

  useEffect(() => {
    const timer = setTimeout(() => {
      retryPendingLeads();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <Suspense fallback={null}>
        <Solutions />
      </Suspense>
      <Suspense fallback={null}>
        <Portfolio />
      </Suspense>
      <Suspense fallback={null}>
        <Process />
      </Suspense>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </>
  );
}
