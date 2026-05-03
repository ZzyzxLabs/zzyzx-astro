import React from "react";

/**
 * BermuDAO diagram: a community network. Nodes pop in, edges draw between
 * them, then a few nodes flare to highlight active connections.
 */
interface Props {
  progress: number;
}

const draw = (p: number, delay: number, duration: number) =>
  Math.max(0, Math.min(1, (p - delay) / duration));

const NODES: { x: number; y: number; size: number; label?: string }[] = [
  { x: 120, y: 80, size: 5 },
  { x: 200, y: 140, size: 6, label: "DEV" },
  { x: 90, y: 200, size: 4 },
  { x: 180, y: 260, size: 5 },
  { x: 300, y: 90, size: 5 },
  { x: 300, y: 200, size: 9, label: "DAO" },
  { x: 300, y: 310, size: 4 },
  { x: 420, y: 140, size: 6, label: "DESIGN" },
  { x: 480, y: 240, size: 5 },
  { x: 540, y: 130, size: 4 },
  { x: 540, y: 280, size: 5 },
  { x: 410, y: 60, size: 4 },
];

// Edges: indices into NODES (kept short, ~14 edges)
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 5],
  [4, 5],
  [4, 11],
  [5, 6],
  [5, 7],
  [3, 5],
  [7, 8],
  [7, 9],
  [8, 10],
  [9, 7],
  [11, 4],
  [10, 5],
];

export default function BermuDAODiagram({ progress }: Props) {
  return (
    <svg
      viewBox='0 0 600 360'
      className='w-full h-full max-w-3xl'
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id='bd-glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='rgba(0, 229, 255, 0.5)' />
          <stop offset='100%' stopColor='rgba(0, 229, 255, 0)' />
        </radialGradient>
        <filter id='bd-blur'>
          <feGaussianBlur stdDeviation='3' />
        </filter>
      </defs>

      {/* Edges, stagger draw */}
      {EDGES.map(([a, b], i) => {
        const A = NODES[a];
        const B = NODES[b];
        const len = Math.hypot(B.x - A.x, B.y - A.y);
        const off = (1 - draw(progress, 0.15 + (i % 8) * 0.04, 0.25)) * len;
        return (
          <line
            key={`e-${i}`}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke='rgb(0, 229, 255)'
            strokeWidth={0.8}
            strokeOpacity={0.45}
            strokeDasharray={len}
            strokeDashoffset={off}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const opacity = draw(progress, 0.0 + i * 0.025, 0.2);
        const isHub = (n.size ?? 0) >= 6;
        const flare = isHub ? 0.6 + Math.sin(progress * 14 + i) * 0.4 : 0.7;
        return (
          <g key={`n-${i}`} style={{ opacity }}>
            {isHub && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.size * 3}
                fill='url(#bd-glow)'
                opacity={flare * 0.7}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.size}
              fill={isHub ? "rgb(0, 229, 255)" : "rgba(0, 229, 255, 0.18)"}
              stroke='rgb(0, 229, 255)'
              strokeWidth={1}
            />
            {n.label && (
              <text
                x={n.x}
                y={n.y - n.size - 8}
                textAnchor='middle'
                fill='rgb(232, 238, 248)'
                fontSize={9}
                letterSpacing='0.25em'
                fontFamily='"Space Grotesk", sans-serif'
                style={{ opacity: draw(progress, 0.55, 0.2) }}
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Outer ring shimmer once mostly drawn */}
      <circle
        cx={300}
        cy={200}
        r={195}
        fill='none'
        stroke='rgba(0, 229, 255, 0.15)'
        strokeWidth={0.8}
        strokeDasharray='3 6'
        style={{
          opacity: draw(progress, 0.78, 0.22),
          transformOrigin: "300px 200px",
          transform: `rotate(${progress * 60}deg)`,
        }}
      />

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
        LEARN · CONNECT · BUILD
      </text>
    </svg>
  );
}
