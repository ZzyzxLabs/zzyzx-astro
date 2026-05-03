import React from "react";

/**
 * Nereus diagram: LLM inside a Trusted Execution Environment box.
 * Input enters left, gets processed by LLM inside TEE, output emerges
 * on the right with a verification stamp.
 */
interface Props {
  progress: number;
}

const draw = (p: number, delay: number, duration: number) =>
  Math.max(0, Math.min(1, (p - delay) / duration));

export default function NereusDiagram({ progress }: Props) {
  // Pulsating LLM token emitting
  const pulse = 0.5 + Math.sin(progress * 18) * 0.5;

  return (
    <svg
      viewBox='0 0 600 360'
      className='w-full h-full max-w-3xl'
      style={{ overflow: "visible" }}
    >
      <defs>
        <pattern
          id='tee-grid'
          width='10'
          height='10'
          patternUnits='userSpaceOnUse'
        >
          <path
            d='M 10 0 L 0 0 0 10'
            fill='none'
            stroke='rgba(0, 229, 255, 0.06)'
            strokeWidth='1'
          />
        </pattern>
        <filter id='nereus-glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='2.5' />
        </filter>
      </defs>

      {/* Input prompt arrow */}
      <g style={{ opacity: draw(progress, 0.0, 0.2) }}>
        <text
          x={48}
          y={172}
          fill='rgb(140, 152, 174)'
          fontSize={11}
          letterSpacing='0.25em'
          fontFamily='"Space Grotesk", sans-serif'
        >
          PROMPT
        </text>
        <line
          x1={50}
          y1={185}
          x2={150}
          y2={185}
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
          strokeOpacity={0.7}
          strokeDasharray={100}
          strokeDashoffset={(1 - draw(progress, 0.05, 0.2)) * 100}
        />
        <polygon
          points='150,180 158,185 150,190'
          fill='rgb(0, 229, 255)'
          fillOpacity={draw(progress, 0.2, 0.1) * 0.85}
        />
      </g>

      {/* TEE outer box */}
      <g style={{ opacity: draw(progress, 0.18, 0.2) }}>
        <rect
          x={160}
          y={80}
          width={280}
          height={210}
          rx={10}
          fill='url(#tee-grid)'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
          strokeDasharray={'8 4'}
        />
        <text
          x={170}
          y={102}
          fill='rgb(0, 229, 255)'
          fontSize={10}
          letterSpacing='0.3em'
          fontFamily='"Space Grotesk", sans-serif'
        >
          TEE / TRUSTED EXECUTION
        </text>
        {/* Tiny corner brackets */}
        <path
          d='M 160 95 V 80 H 175'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={2}
        />
        <path
          d='M 425 80 H 440 V 95'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={2}
        />
        <path
          d='M 440 275 V 290 H 425'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={2}
        />
        <path
          d='M 175 290 H 160 V 275'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={2}
        />
      </g>

      {/* LLM inner box */}
      <g style={{ opacity: draw(progress, 0.35, 0.25) }}>
        <rect
          x={220}
          y={140}
          width={160}
          height={90}
          rx={8}
          fill='rgba(18, 24, 38, 0.95)'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.2}
        />
        <text
          x={300}
          y={178}
          textAnchor='middle'
          fill='rgb(232, 238, 248)'
          fontSize={20}
          fontFamily='"Space Grotesk", sans-serif'
          fontWeight={600}
          letterSpacing='0.05em'
        >
          LLM
        </text>
        <text
          x={300}
          y={202}
          textAnchor='middle'
          fill='rgb(140, 152, 174)'
          fontSize={9}
          fontFamily='"Inter", sans-serif'
          letterSpacing='0.25em'
        >
          INFERENCE
        </text>
        {/* Activity dot */}
        <circle
          cx={368}
          cy={150}
          r={3}
          fill='rgb(0, 229, 255)'
          opacity={pulse}
        />
      </g>

      {/* Verified output arrow */}
      <g style={{ opacity: draw(progress, 0.6, 0.2) }}>
        <line
          x1={440}
          y1={185}
          x2={540}
          y2={185}
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
          strokeOpacity={0.9}
          strokeDasharray={100}
          strokeDashoffset={(1 - draw(progress, 0.62, 0.18)) * 100}
        />
        <polygon
          points='540,180 548,185 540,190'
          fill='rgb(0, 229, 255)'
          fillOpacity={draw(progress, 0.78, 0.1) * 0.95}
        />
      </g>

      {/* Verification stamp */}
      <g
        style={{ opacity: draw(progress, 0.78, 0.22) }}
        filter='url(#nereus-glow)'
      >
        <circle
          cx={552}
          cy={150}
          r={14}
          fill='rgba(0, 229, 255, 0.12)'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
        />
        <path
          d='M 545 150 l 5 5 9 -9'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <text
        x={552}
        y={185}
        textAnchor='middle'
        fill='rgb(140, 152, 174)'
        fontSize={9}
        letterSpacing='0.25em'
        fontFamily='"Space Grotesk", sans-serif'
        style={{ opacity: draw(progress, 0.82, 0.18) }}
      >
        VERIFIED
      </text>

      {/* Floor metadata */}
      <text
        x={40}
        y={340}
        fill='rgb(140, 152, 174)'
        fontSize={10}
        letterSpacing='0.3em'
        fontFamily='"Inter", sans-serif'
        style={{ opacity: draw(progress, 0.05, 0.3) }}
      >
        PROMPT · INFER · ATTEST
      </text>
    </svg>
  );
}
