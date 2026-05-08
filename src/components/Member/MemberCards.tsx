import React, { useEffect, useRef, useState } from "react";
import MemberInfoRect from "./MemberInfoRect";
import { useInView } from "./useInView";

interface Member {
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
  infoAccent?: string;
  info?: React.ReactNode;
  /** When set, the card links to /{profileSlug} */
  profileSlug?: string;
}

const ZOU_SKILLS = ["Product Management", "Smart Contract", "Research", "BD"];

type Meteor = {
  x: number;
  y: number;
  radius: number;
  velocity: number;
  label: string;
  rotation: number;
  spin: number;
};

function ZouFlightGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const nextSpawnRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const planeRef = useRef({ x: 0, y: 0 });
  const meteorsRef = useRef<Meteor[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const hitFlashRef = useRef(0);
  const [status, setStatus] = useState<"playing" | "over">("playing");

  useEffect(() => {
    if (status !== "playing") {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      planeRef.current = { x: rect.width / 2, y: rect.height * 0.75 };
      pointerRef.current = { x: rect.width / 2, y: rect.height * 0.75 };
    };

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    meteorsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    hitFlashRef.current = 0;
    lastFrameRef.current = performance.now();
    nextSpawnRef.current = performance.now() + 600;

    const drawPlane = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(12, 8);
      ctx.lineTo(3, 6);
      ctx.lineTo(0, 14);
      ctx.lineTo(-3, 6);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fillStyle = "#7dd3fc";
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawMeteor = (meteor: Meteor) => {
      ctx.save();
      ctx.translate(meteor.x, meteor.y);
      ctx.rotate(meteor.rotation);
      const gradient = ctx.createRadialGradient(
        0,
        0,
        meteor.radius * 0.2,
        0,
        0,
        meteor.radius
      );
      gradient.addColorStop(0, "#fde047");
      gradient.addColorStop(0.6, "#fb923c");
      gradient.addColorStop(1, "#b45309");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, meteor.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.font = "11px ui-sans-serif, system-ui, -apple-system";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meteor.label, 0, 1);
      ctx.restore();
    };

    const loop = (time: number) => {
      const rect = container.getBoundingClientRect();
      const dt = Math.min(32, time - lastFrameRef.current);
      lastFrameRef.current = time;

      const target = pointerRef.current;
      const plane = planeRef.current;
      plane.x += (target.x - plane.x) * 0.12;
      plane.y += (target.y - plane.y) * 0.12;
      plane.x = Math.max(18, Math.min(rect.width - 18, plane.x));
      plane.y = Math.max(18, Math.min(rect.height - 18, plane.y));

      if (time > nextSpawnRef.current) {
        const radius = 18 + Math.random() * 10;
        meteorsRef.current.push({
          x: radius + Math.random() * (rect.width - radius * 2),
          y: -radius - 10,
          radius,
          velocity: 90 + Math.random() * 110,
          label: ZOU_SKILLS[Math.floor(Math.random() * ZOU_SKILLS.length)],
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.04,
        });
        nextSpawnRef.current = time + 500 + Math.random() * 600;
      }

      meteorsRef.current = meteorsRef.current.filter((meteor) => {
        meteor.y += (meteor.velocity * dt) / 1000;
        meteor.rotation += meteor.spin;
        if (meteor.y - meteor.radius > rect.height + 30) {
          return false;
        }

        const dx = meteor.x - plane.x;
        const dy = meteor.y - plane.y;
        const hit = Math.hypot(dx, dy) < meteor.radius + 14;
        if (hit) {
          livesRef.current -= 1;
          hitFlashRef.current = 1;
          return false;
        }

        return true;
      });

      scoreRef.current += dt * 0.02;

      ctx.clearRect(0, 0, rect.width, rect.height);
      const bg = ctx.createLinearGradient(0, 0, 0, rect.height);
      bg.addColorStop(0, "#0b1220");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(148, 163, 184, 0.15)";
      for (let i = 0; i < 14; i += 1) {
        const x = (i * 73 + time * 0.02) % rect.width;
        const y = (i * 41 + time * 0.04) % rect.height;
        ctx.fillRect(x, y, 2, 2);
      }

      meteorsRef.current.forEach(drawMeteor);
      drawPlane(plane.x, plane.y);

      ctx.fillStyle = "rgba(226, 232, 240, 0.75)";
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(`Score ${Math.floor(scoreRef.current)}`, 12, 20);
      ctx.fillText(`Lives ${livesRef.current}`, 12, 38);

      if (hitFlashRef.current > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${hitFlashRef.current * 0.25})`;
        ctx.fillRect(0, 0, rect.width, rect.height);
        hitFlashRef.current = Math.max(0, hitFlashRef.current - 0.06);
      }

      if (livesRef.current <= 0) {
        setStatus("over");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [status]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (status !== "playing") {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (status !== "playing") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className='relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 touch-none'
    >
      <canvas
        ref={canvasRef}
        className={status === "playing" ? "block" : "hidden"}
      />
    </div>
  );
}

function ZouInfo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSeed, setGameSeed] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    setGameSeed((prev) => prev + 1);
  };

  return (
    <div className='flex h-full flex-col gap-4'>
      <div>
        <div className='text-sm uppercase tracking-widest text-white/60'>
          Core Capabilities
        </div>
        <div className='mt-2 flex flex-wrap gap-2'>
          {ZOU_SKILLS.map((t) => (
            <span
              key={t}
              className='rounded-full bg-white/10 px-3 py-1 text-sm text-white/85'
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className='text-sm uppercase tracking-widest text-white/60'>
          Focus
        </div>
        <div className='mt-2 text-white/80'>
          Owns strategy, product direction, and business alignment.
        </div>
      </div>
      {isPlaying && (
        <div className='h-55'>
          <ZouFlightGame key={gameSeed} />
        </div>
      )}
      <div className='mt-auto flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={handlePlay}
          className='rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white/20'
        >
          Play
        </button>
        <a
          href='/zou'
          className='rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/80 hover:border-white/40 hover:text-white'
        >
          Profile
        </a>
      </div>
    </div>
  );
}

const members: Member[] = [
  {
    name: "Frederic",
    role: "Lead Architect",
    description:
      "Visionary behind the core systems, pushing the boundaries of what's possible.",
    image: "/member/frederic-nft.jpg",
    color: "from-red-500 to-orange-600",
    infoAccent: "from-red-500/40 to-orange-600/20",
    profileSlug: "frederic",
    info: (
      <div className='space-y-4'>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Focus
          </div>
          <div className='mt-2 flex flex-wrap gap-2'>
            {["System design", "Architecture", "APIs", "Scalability"].map(
              (t) => (
                <span
                  key={t}
                  className='rounded-full bg-white/10 px-3 py-1 text-sm text-white/85'
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Currently
          </div>
          <div className='mt-2 text-white/80'>
            Refining the core platform and defining long-term technical
            direction.
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Zou",
    role: "CSO",
    description:
      "Leads team direction and strategy, aligning product vision with market opportunities.",
    image: "/member/zou.png",
    color: "from-blue-500 to-cyan-600",
    infoAccent: "from-blue-500/35 to-cyan-600/20",
    profileSlug: "zou",
    info: <ZouInfo />,
  },
  {
    name: "KC",
    role: "CGO",
    description:
      "Driving marketing strategy and business development for growth.",
    image: "/member/KC.png",
    color: "from-emerald-500 to-lime-600",
    infoAccent: "from-emerald-500/35 to-lime-600/20",
    info: (
      <div className='space-y-4'>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Strengths
          </div>
          <ul className='mt-2 space-y-2 text-white/80'>
            <li>• Marketing</li>
            <li>• Business Develop</li>
          </ul>
        </div>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Notes
          </div>
          <div className='mt-2 text-white/80'>
            Connects product value to market opportunities.
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Lun",
    role: "Co-CTO",
    description:
      "Web Front End, Web3, Open Source and Cyber Security.",
    image: "/member/lun.png",
    color: "from-purple-500 to-pink-600",
    infoAccent: "from-purple-500/35 to-pink-600/20",
    profileSlug: "Lun",
    info: (
      <div className='space-y-4'>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Focus
          </div>
          <div className='mt-2 text-white/80'>
            Pushing Information Literacy. Writes dynamic front end and creates dApps on Sui.
          </div>
        </div>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Strengths
          </div>
          <div className='mt-2 flex flex-wrap gap-2'>
            {["Web Front End", "Web3", "Open Source", "Cyber Security"].map((t) => (
              <span
                key={t}
                className='rounded-full bg-white/10 px-3 py-1 text-sm text-white/85'
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Malingshu",
    role: "Co-CTO",
    description:
      "Leading cryptography and blockchain architecture for secure products.",
    image: "/member/malingshu.jpg",
    color: "from-yellow-500 to-amber-600",
    infoAccent: "from-yellow-500/35 to-amber-600/20",
    info: (
      <div className='space-y-4'>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Strengths
          </div>
          <div className='mt-2 grid grid-cols-2 gap-2'>
            {["Cryptography", "Blockchain"].map((t) => (
              <div
                key={t}
                className='rounded-2xl bg-white/10 px-4 py-3 text-white/85'
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Goal
          </div>
          <div className='mt-2 text-white/80'>
            Build secure foundations that scale with the product.
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Charlie",
    role: "Head of Content",
    description:
      "Shapes the studio's voice — content strategy, writing, and editorial direction.",
    image: "/member/charlie.png",
    color: "from-rose-500 to-red-700",
    infoAccent: "from-rose-500/35 to-red-700/20",
    info: (
      <div className='space-y-4'>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Focus
          </div>
          <div className='mt-2 flex flex-wrap gap-2'>
            {["Content Strategy", "Editorial", "Storytelling", "Brand Voice"].map(
              (t) => (
                <span
                  key={t}
                  className='rounded-full bg-white/10 px-3 py-1 text-sm text-white/85'
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>
        <div>
          <div className='text-sm uppercase tracking-widest text-white/60'>
            Currently
          </div>
          <div className='mt-2 text-white/80'>
            Translating hard problems into stories worth reading.
          </div>
        </div>
      </div>
    ),
  },
];

interface MemberCardEntryProps {
  member: Member;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

function MemberCardEntry({
  member,
  index,
  isActive,
  isDimmed,
  onActivate,
  onDeactivate,
}: MemberCardEntryProps) {
  const [ref, visible] = useInView<HTMLAnchorElement | HTMLDivElement>();
  const Wrapper: any = member.profileSlug ? "a" : "div";
  const wrapperProps: any = member.profileSlug ? { href: `/${member.profileSlug}` } : {};

  // Per-card entrance: fade-rise once scrolled into view, with a small per-index stagger.
  const entranceStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 700ms ease-out, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
    transitionDelay: `${index * 70}ms`,
  };

  return (
    <Wrapper
      ref={ref}
      {...wrapperProps}
      style={entranceStyle}
      className={`
        relative flex h-64 md:h-full rounded-3xl overflow-hidden cursor-pointer no-underline text-inherit
        ${isActive ? "md:flex-10" : "md:flex-1"}
        ${isDimmed ? "md:opacity-50" : ""}
      `}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <div className='relative h-full w-full flex'>
        {/* Image side — full width on mobile, shrinks to 55% on hover (desktop) */}
        <div
          className={`relative h-full w-full md:transition-[width] md:duration-700 md:ease-out ${
            isActive ? "md:w-[55%]" : "md:w-full"
          }`}
        >
          <div
            className={`absolute inset-0 bg-linear-to-br ${member.color} opacity-50`}
          />

          <img
            src={member.image}
            alt={member.name}
            className='absolute inset-0 w-full h-full object-cover'
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isActive ? "md:bg-black/30 bg-black/40" : "bg-black/10"
            }`}
          />

          {/* Collapsed/mobile label */}
          <div
            className={`absolute inset-x-6 bottom-6 transition-opacity duration-500 ${
              isActive ? "md:opacity-0 opacity-100" : "opacity-100"
            }`}
          >
            <div className='text-2xl font-bold text-white drop-shadow-md'>
              {member.name}
            </div>
            <div className='text-sm text-white/85 mt-1'>{member.role}</div>
          </div>
        </div>

        {/* Info rect — hidden on mobile, slides in on hover (desktop) */}
        <div
          className={`hidden md:flex relative h-full flex-none overflow-hidden transition-all duration-700 ease-out ${
            isActive
              ? "basis-[45%] opacity-100 translate-x-0"
              : "basis-0 opacity-0 translate-x-8"
          }`}
        >
          <div className='h-full w-full'>
            <MemberInfoRect
              name={member.name}
              role={member.role}
              description={member.description}
              accentClassName={
                member.infoAccent ?? "from-zinc-800 to-zinc-950"
              }
            >
              {member.info}
            </MemberInfoRect>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function MemberCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className='flex flex-col md:flex-row w-full max-w-[1400px] mx-auto md:h-[min(72vh,640px)] gap-3 px-6 md:px-10 items-stretch md:items-center justify-center md:overflow-hidden'>
      {members.map((member, index) => (
        <MemberCardEntry
          key={member.name}
          member={member}
          index={index}
          isActive={activeIndex === index}
          isDimmed={activeIndex !== null && activeIndex !== index}
          onActivate={() => setActiveIndex(index)}
          onDeactivate={() => setActiveIndex(null)}
        />
      ))}
    </div>
  );
}
