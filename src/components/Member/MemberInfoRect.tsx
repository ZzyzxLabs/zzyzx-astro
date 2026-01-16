import React from 'react';

type MemberInfoRectProps = {
  name: string;
  role: string;
  description: string;
  accentClassName?: string;
  children?: React.ReactNode;
};

export default function MemberInfoRect({
  name,
  role,
  description,
  accentClassName = 'from-zinc-800 to-zinc-950',
  children,
}: MemberInfoRectProps) {
  return (
    <div className="relative h-full w-full">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClassName} opacity-60`} />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative h-full w-full p-8 flex flex-col">
        <div className="mb-6">
          <h3 className="text-4xl font-bold text-white leading-tight">{name}</h3>
          <p className="text-xl text-white/90 font-medium mt-2">{role}</p>
          <p className="text-base text-white/70 mt-4 leading-relaxed max-w-2xl">{description}</p>
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-auto pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
