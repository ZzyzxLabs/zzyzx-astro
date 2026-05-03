import React, { useEffect, useRef, useState } from "react";
import MemberCards from "./MemberCards";
import { useInView } from "./useInView";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function MobileHeadline() {
  const [ref, visible] = useInView<HTMLDivElement>();
  const base: React.CSSProperties = {
    transition:
      "opacity 800ms ease-out, transform 800ms cubic-bezier(0.2, 0.7, 0.2, 1)",
  };
  return (
    <div ref={ref} className='max-w-md mx-auto text-center'>
      <span
        className='eyebrow mb-6 justify-center'
        style={{
          ...base,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transitionDelay: "0ms",
        }}
      >
        Section 03
      </span>
      <h2
        className='font-display font-semibold text-white tracking-tight leading-none mt-2'
        style={{
          ...base,
          fontSize: "clamp(3.5rem, 14vw, 6rem)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "120ms",
        }}
      >
        Members
      </h2>
      <p
        className='mt-6 text-base text-text-muted'
        style={{
          ...base,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transitionDelay: "240ms",
        }}
      >
        The minds shipping every line of code, every contract, every spec.
      </p>
    </div>
  );
}

export default function MembersSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        targetRef.current = 0;
        return;
      }
      targetRef.current = clamp01(-rect.top / total);
    };

    const loop = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      setProgress((prev) => {
        const k = 1 - Math.exp(-12 * dt);
        const next = prev + (targetRef.current - prev) * k;
        return Math.abs(targetRef.current - prev) < 0.001
          ? targetRef.current
          : next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const introOpacity = 1 - smoothstep(0.15, 0.55, progress);
  const introY = -smoothstep(0.15, 0.55, progress) * 40;
  const cardsT = smoothstep(0.25, 0.75, progress);

  return (
    <>
      {/* Mobile / narrow viewports — stacked layout with per-card fade-rise on scroll */}
      <section className='md:hidden w-full px-6 py-20'>
        <MobileHeadline />
        <div className='mt-12'>
          <MemberCards />
        </div>
      </section>

      {/* Desktop — sticky scroll-driven cinematic */}
      <section
        ref={containerRef}
        className='hidden md:block relative w-full h-[260vh]'
      >
        <div className='sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center'>
          {/* Intro headline */}
          <div
            className='absolute inset-0 flex flex-col items-center justify-center px-6 text-center'
            style={{
              opacity: introOpacity,
              transform: `translateY(${introY}px)`,
              pointerEvents: introOpacity < 0.05 ? "none" : "auto",
            }}
          >
            <span className='eyebrow mb-6 md:mb-8'>Section 03</span>
            <h2
              className='font-display font-semibold text-white tracking-tight leading-none'
              style={{ fontSize: "clamp(4rem, 14vw, 9rem)" }}
            >
              Members
            </h2>
            <p className='mt-6 md:mt-8 text-base sm:text-xl md:text-2xl text-text-muted max-w-xl px-2'>
              The minds shipping every line of code, every contract, every spec.
            </p>
          </div>

          {/* Cards */}
          <div
            className='absolute inset-0 flex items-center justify-center'
            style={{
              opacity: cardsT,
              transform: `translateY(${(1 - cardsT) * 40}px)`,
              pointerEvents: cardsT > 0.2 ? "auto" : "none",
            }}
          >
            <MemberCards />
          </div>
        </div>
      </section>
    </>
  );
}
