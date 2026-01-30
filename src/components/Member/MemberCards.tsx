import React, { useState } from 'react';
import MemberInfoRect from './MemberInfoRect';

interface Member {
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
  infoAccent?: string;
  info?: React.ReactNode;
}

const members: Member[] = [
  {
    name: "Frederic",
    role: "Lead Architect",
    description: "Visionary behind the core systems, pushing the boundaries of what's possible.",
    image: "/member/frederic.jpg",
    color: "from-red-500 to-orange-600",
    infoAccent: "from-red-500/40 to-orange-600/20",
    info: (
      <div className="space-y-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Focus</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['System design', 'Architecture', 'APIs', 'Scalability'].map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/85">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Currently</div>
          <div className="mt-2 text-white/80">Refining the core platform and defining long-term technical direction.</div>
        </div>
      </div>
    ),
  },
  {
    name: "Zou",
    role: "Frontend Wizard",
    description: "Crafting beautiful and intuitive interfaces that users love to interact with.",
    image: "/member/zou.png", 
    color: "from-blue-500 to-cyan-600",
    infoAccent: "from-blue-500/35 to-cyan-600/20",
    info: (
      <div className="space-y-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Toolbox</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {['React', 'Astro', 'Tailwind', 'Motion'].map((t) => (
              <div key={t} className="rounded-2xl bg-white/10 px-4 py-3 text-white/85">
                {t}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Style</div>
          <div className="mt-2 text-white/80">Clean UI, fast interactions, and obsessive micro-details.</div>
        </div>
      </div>
    ),
  },
  {
    name: "KC",
    role: "Backend Engineer",
    description: "Ensuring the stability and performance of our infrastructure at scale.",
    image: "/member/KC.png",
    color: "from-emerald-500 to-lime-600",
    infoAccent: "from-emerald-500/35 to-lime-600/20",
    info: (
      <div className="space-y-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Strengths</div>
          <ul className="mt-2 space-y-2 text-white/80">
            <li>• Performance tuning & observability</li>
            <li>• Stable deployments and guardrails</li>
            <li>• Data pipelines and services</li>
          </ul>
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Notes</div>
          <div className="mt-2 text-white/80">Keeps systems calm under pressure.</div>
        </div>
      </div>
    ),
  },
  {
    name: "Lun",
    role: "Creative Director",
    description: "Bringing artistic flair and consistent design language to every project.",
    image: "/member/lun.png",
    color: "from-purple-500 to-pink-600",
    infoAccent: "from-purple-500/35 to-pink-600/20",
    info: (
      <div className="space-y-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Design</div>
          <div className="mt-2 text-white/80">Owns visual language, mood, and cohesion across the whole product.</div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Delivers</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Brand', 'Typography', 'Layout', 'Art direction'].map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/85">
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
    role: "AI Specialist",
    description: "Integrating cutting-edge AI solutions to smarten up our workflows.",
    image: "/member/malingshu.jpg",
    color: "from-yellow-500 to-amber-600",
    infoAccent: "from-yellow-500/35 to-amber-600/20",
    info: (
      <div className="space-y-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Areas</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {['LLM apps', 'Agents', 'RAG', 'Automation'].map((t) => (
              <div key={t} className="rounded-2xl bg-white/10 px-4 py-3 text-white/85">
                {t}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/60">Goal</div>
          <div className="mt-2 text-white/80">Make workflows smarter without making them fragile.</div>
        </div>
      </div>
    ),
  }
];

export default function MemberCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full h-[600px] gap-4 px-10 py-20 items-center justify-center bg-black overflow-hidden">
      {members.map((member, index) => (
        <div
          key={member.name}
          className={`
            relative flex h-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out
            ${activeIndex === index ? 'flex-[10]' : 'flex-[1]'}
            ${activeIndex !== null && activeIndex !== index ? 'opacity-50' : 'opacity-100'}
          `}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="relative h-full w-full flex">
            {/* Left: Image */}
            <div
              className={`relative h-full transition-[width] duration-700 ease-out ${
                activeIndex === index ? 'w-[55%]' : 'w-full'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-50`} />

              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? 'bg-black/30' : 'bg-black/10'
                }`}
              />

              {/* Collapsed label */}
              <div
                className={`absolute inset-x-6 bottom-6 transition-opacity duration-500 ${
                  activeIndex === index ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="text-2xl font-bold text-white drop-shadow">{member.name}</div>
                <div className="text-sm text-white/80 mt-1">{member.role}</div>
              </div>
            </div>

            {/* Right: Info rectangle (only visible on hover) */}
            <div
              className={`relative h-full flex-none overflow-hidden transition-all duration-700 ease-out ${
                activeIndex === index ? 'basis-[45%] opacity-100 translate-x-0' : 'basis-0 opacity-0 translate-x-8'
              }`}
            >
              <div className="h-full w-full">
                <div className="h-full rounded-none">
                  <MemberInfoRect
                    name={member.name}
                    role={member.role}
                    description={member.description}
                    accentClassName={member.infoAccent ?? 'from-zinc-800 to-zinc-950'}
                  >
                    {member.info}
                  </MemberInfoRect>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
