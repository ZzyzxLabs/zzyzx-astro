import React, { useEffect, useMemo, useRef, useState } from "react";
import MemberCards from "./MemberCards";

type Style = React.CSSProperties;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export default function MembersSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [bracketScaleProgress, setBracketScaleProgress] = useState(0);
  const targetProgressRef = useRef(0);

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const lastTsRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Main scroll damping (text fade / general progress)
  const FOLLOW_SPEED = 1000;
  // Bracket scale damping (kept slower / more cinematic)
  const BRACKET_SCALE_FOLLOW_SPEED = 40;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX((e.clientX / window.innerWidth) * 100);
    setMouseY((e.clientY / window.innerHeight) * 100);
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const totalScroll = rect.height - windowHeight;
    if (totalScroll <= 0) {
      targetProgressRef.current = 0;
      return;
    }

    const currentScroll = -rect.top;
    const p = currentScroll / totalScroll;

    targetProgressRef.current = clamp01(p);
  };

  useEffect(() => {
    const loop = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000); // cap 50ms
      lastTsRef.current = ts;

      const target = targetProgressRef.current;

      setScrollProgress((prev) => {
        const diff = target - prev;
        const k = 1 - Math.exp(-FOLLOW_SPEED * dt);
        const next = prev + diff * k;
        return Math.abs(diff) < 0.0005 ? target : next;
      });

      setBracketScaleProgress((prev) => {
        const diffScale = target - prev;
        const kScale = 1 - Math.exp(-BRACKET_SCALE_FOLLOW_SPEED * dt);
        const next = prev + diffScale * kScale;
        return Math.abs(diffScale) < 0.0005 ? target : next;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bracketStyle: Style = useMemo(() => {
    const p = scrollProgress;
    const pScale = bracketScaleProgress;

    const eased = smoothstep(0, 1, pScale);
    const scale = 1 + eased * 80;

    const fadeT = smoothstep(0.65, 1.0, p);
    const opacity = 1 - fadeT;

    const blur = fadeT * 6;

    return {
      transform: `scale(${scale}) translate(${mouseX * -0.05}%, ${mouseY * -0.05}%)`,
      opacity,
      filter: `blur(${blur}px)`,
    };
  }, [scrollProgress, bracketScaleProgress, mouseX, mouseY]);

  const textStyle: Style = useMemo(() => {
    return {
      transform: `translate(${mouseX * -0.03}%, ${mouseY * -0.03}%)`,
    };
  }, [mouseX, mouseY]);

  const cardsStyle: Style = useMemo(() => {
    const p = scrollProgress;

    const fadeT = smoothstep(0.4, 0.85, p);
    const opacity = fadeT;

    const scale = 0.92 + fadeT * 0.08;
    const translateY = (1 - fadeT) * 60;

    return {
      opacity,
      transform: `scale(${scale}) translateY(${translateY}px)`,
      pointerEvents: fadeT > 0.1 ? "auto" : "none",
    };
  }, [scrollProgress]);

  const centerOpacity = Math.max(0, 1 - scrollProgress * 2);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* The expanding bracket container */}
        <div
          className="text-white absolute w-11/12 h-5/6 text-7xl flex flex-col justify-between pointer-events-none origin-center will-change-transform z-20"
          style={bracketStyle}
        >
          {/* Top row */}
          <div className="top-0 left-0 w-full flex flex-row justify-between">
            <p>「</p>

            <div className="text-xl flex flex-col items-end text-right">
              <span>Zzyzx Labs</span>
              <span>2026</span>
              <span>The end of ALLs</span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="w-full flex items-end relative">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
              V V V
            </span>
            <span className="ml-auto text-right">」</span>
          </div>
        </div>

        {/* Central Text Content */}
        <div
          className="flex flex-col z-10 gap-y-8 transition-opacity duration-300 items-center justify-center relative"
          style={{ opacity: centerOpacity, ...textStyle }}
        >
          <h2 className="text-white font-bold text-8xl text-center relative z-20 mix-blend-difference">
            Members
          </h2>
          <p className="text-white text-3xl text-center relative z-20">
            Meets the most ambitious minds.
          </p>

          {/* Glitch/layered effects */}
          <h2
            className="text-cyan-400/30 font-bold text-8xl text-center absolute top-0 left-0 w-full z-10 pointer-events-none select-none blur-[1px]"
            style={{
              transform: `translate(${mouseX * -0.02}%, ${mouseY * -0.02}%)`,
            }}
          >
            Members
          </h2>

          <h2
            className="text-pink-500/30 font-bold text-8xl text-center absolute top-0 left-0 w-full z-10 pointer-events-none select-none blur-[1px]"
            style={{
              transform: `translate(${mouseX * 0.02}%, ${mouseY * 0.02}%)`,
            }}
          >
            Members
          </h2>
        </div>

        {/* MemberCards with fade-in effect */}
        <div
          className="absolute inset-0 flex items-center justify-center z-30 will-change-transform"
          style={cardsStyle}
        >
          <MemberCards />
        </div>
      </div>
    </div>
  );
}
