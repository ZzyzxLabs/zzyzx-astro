import React, { useEffect, useRef, useState } from "react";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export type Scene =
  | { kind: "image"; step: string; caption: string; imageSrc: string }
  | { kind: "diagram"; step: string; caption: string; render: (p: number) => React.ReactNode };

export interface ProjectTheaterProps {
  index: string;
  name: React.ReactNode;
  blurb: string;
  ctaLabel: string;
  ctaHref: string;
  ctaPrimary?: boolean;
  scenes: [Scene, Scene, Scene];
}

export default function ProjectTheater({
  index,
  name,
  blurb,
  ctaLabel,
  ctaHref,
  ctaPrimary = false,
  scenes,
}: ProjectTheaterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
        // Slower follow: k=8 (was 15) so the scene doesn't snap past on a fast scroll.
        const k = 1 - Math.exp(-8 * dt);
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

  // Scene timing — scene 2 (the diagram) gets a much longer visible window.
  // Crossfade at 0.18-0.28 (in) and 0.72-0.82 (out). Scene 2 fully visible 0.28-0.72 = 44%.
  const enter1 = smoothstep(0.0, 0.05, progress);
  const exit1 = smoothstep(0.18, 0.28, progress);
  const enter2 = smoothstep(0.18, 0.28, progress);
  const exit2 = smoothstep(0.72, 0.82, progress);
  const enter3 = smoothstep(0.72, 0.82, progress);

  const w1 = enter1 * (1 - exit1);
  const w2 = enter2 * (1 - exit2);
  const w3 = enter3;

  const activeScene = progress < 0.4 ? 0 : progress < 0.75 ? 1 : 2;

  const imageScale = 1.02 + progress * 0.05;

  // Diagram draw spans 0.28-0.5 (early in scene 2 window), then dwells fully drawn until 0.72.
  const diagramP = smoothstep(0.28, 0.5, progress);

  return (
    <section
      ref={containerRef}
      className='relative h-[360vh]'
      style={{ backgroundColor: "#070b14" }}
    >
      <div className='sticky top-0 h-screen w-full flex flex-col-reverse lg:flex-row overflow-hidden'>
        {/* Text panel — explicit solid bg blocks fixed hero video */}
        <div
          className='relative w-full lg:w-2/5 h-1/2 lg:h-full flex flex-col justify-center px-8 lg:px-12 border-t lg:border-t-0 lg:border-r border-white/10'
          style={{ backgroundColor: "#070b14" }}
        >
          <div className='text-text-faint text-xs uppercase tracking-[0.3em] mb-4'>
            Project {index}
          </div>
          <h2 className='font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-white tracking-tight leading-[1.05]'>
            {name}
          </h2>
          <p className='mt-6 text-base text-text-muted leading-relaxed max-w-sm'>
            {blurb}
          </p>
          <a
            href={ctaHref}
            target='_blank'
            rel='noopener noreferrer'
            className={
              ctaPrimary
                ? "mt-10 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-bg-base text-xs font-semibold uppercase tracking-[0.18em] hover:-translate-y-px transition-transform"
                : "mt-10 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.18em] hover:border-primary hover:text-primary transition-colors"
            }
          >
            {ctaLabel}
            <span aria-hidden='true'>→</span>
          </a>

          {/* Scene progress dots */}
          <div className='absolute bottom-8 left-8 lg:left-12 flex gap-1.5'>
            {scenes.map((s, i) => (
              <span
                key={i}
                className={`block h-px transition-all duration-500 ${
                  i === activeScene ? "w-12 bg-primary" : "w-6 bg-white/20"
                }`}
                aria-label={`Scene ${s.step}`}
              />
            ))}
          </div>
        </div>

        {/* Stage */}
        <div
          className='relative w-full lg:w-3/5 h-1/2 lg:h-full overflow-hidden'
          style={{ backgroundColor: "#0e1420" }}
        >
          {scenes.map((scene, i) => {
            const w = i === 0 ? w1 : i === 1 ? w2 : w3;
            return (
              <div
                key={i}
                className='absolute inset-0'
                style={{ opacity: w }}
              >
                {scene.kind === "image" ? (
                  <>
                    <img
                      src={scene.imageSrc}
                      alt=''
                      className='absolute inset-0 w-full h-full object-cover'
                      style={{
                        transform: `scale(${imageScale})`,
                        transformOrigin: "center center",
                        opacity: 0.92,
                      }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-bg-elev/80 via-transparent to-bg-elev/30 pointer-events-none' />
                  </>
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center p-8 lg:p-12'>
                    {scene.render(diagramP)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Caption */}
          <div className='absolute top-6 right-6 lg:top-10 lg:right-10 flex items-baseline gap-3 pointer-events-none'>
            <div className='font-display text-primary text-xl tabular-nums'>
              {scenes[activeScene].step}
            </div>
            <div className='text-text-faint text-[10px] uppercase tracking-[0.3em]'>
              {scenes[activeScene].caption}
            </div>
          </div>

          <div className='absolute bottom-6 right-6 lg:bottom-10 lg:right-10 text-text-faint text-[10px] uppercase tracking-[0.3em] pointer-events-none'>
            Scene {activeScene + 1} / {scenes.length}
          </div>
        </div>
      </div>
    </section>
  );
}
