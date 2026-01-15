import React, { useState } from 'react';

interface Member {
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
}

const members: Member[] = [
  {
    name: "Frederic",
    role: "Lead Architect",
    description: "Visionary behind the core systems, pushing the boundaries of what's possible.",
    image: "/member/frederic.jpg",
    color: "from-red-500 to-orange-600"
  },
  {
    name: "Zou",
    role: "Frontend Wizard",
    description: "Crafting beautiful and intuitive interfaces that users love to interact with.",
    image: "/member/zou.png", 
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "KC",
    role: "Backend Engineer",
    description: "Ensuring the stability and performance of our infrastructure at scale.",
    image: "/member/kc.jpg",
    color: "from-emerald-500 to-lime-600"
  },
  {
    name: "Lun",
    role: "Creative Director",
    description: "Bringing artistic flair and consistent design language to every project.",
    image: "/member/lun.png",
    color: "from-purple-500 to-pink-600"
  },
  {
    name: "Malingshu",
    role: "AI Specialist",
    description: "Integrating cutting-edge AI solutions to smarten up our workflows.",
    image: "/member/malingshu.jpg",
    color: "from-yellow-500 to-amber-600"
  }
];

export default function MemberCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // When hovering, we want the hovered item to expand.
  // The user mentioned "Move to far left". 
  // Strictly moving to the left suggests reordering or a specific visual effect.
  // However, "Squeeze others" implies an accordion.
  // A commonly requested effect is the "Apple-style" or "Accordion" gallery.
  // We will implement a high-quality accordion.

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
          {/* Background Gradient (behind the image, does not tint it) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-70`} />
          
          {/* Image Layer */}
          <img 
            src={member.image} 
            alt={member.name} 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
          />

           {/* Placeholder/Overlay Layer */}
           <div className={`absolute inset-0 transition-opacity duration-500 ${activeIndex === index ? 'bg-black/35' : 'bg-black/15'}`} />

          {/* Content Container */}
          <div className={`absolute inset-0 flex flex-col justify-end p-8 transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`transition-[opacity,filter] duration-500 ${activeIndex === index ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
              <h3 className="text-6xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-2xl text-white/90 font-medium mb-4">{member.role}</p>
              <p className="text-lg text-white/70 max-w-lg leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
