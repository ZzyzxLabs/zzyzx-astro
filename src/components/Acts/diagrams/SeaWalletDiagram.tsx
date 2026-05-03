import React from "react";

/**
 * SeaWallet diagram: 3 input asset boxes → smart contract → vault.
 * `progress` (0..1) drives stagger of nodes appearing and lines drawing.
 */
interface Props {
  progress: number;
}

const draw = (p: number, delay: number, duration: number) =>
  Math.max(0, Math.min(1, (p - delay) / duration));

export default function SeaWalletDiagram({ progress }: Props) {
  const assets = ["SUI", "NFT", "TOKEN"];

  return (
    <svg
      viewBox='0 0 600 360'
      className='w-full h-full max-w-3xl'
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id='sw-glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='2.5' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      {/* Asset input boxes */}
      {assets.map((label, i) => {
        const opacity = draw(progress, 0.0 + i * 0.05, 0.25);
        return (
          <g key={label} style={{ opacity }}>
            <rect
              x={40}
              y={50 + i * 95}
              width={88}
              height={56}
              rx={6}
              fill='rgba(0, 229, 255, 0.04)'
              stroke='rgba(0, 229, 255, 0.6)'
              strokeWidth={1}
            />
            <text
              x={84}
              y={84 + i * 95}
              textAnchor='middle'
              fill='rgb(232, 238, 248)'
              fontSize={13}
              fontFamily='"Space Grotesk", sans-serif'
              letterSpacing='0.1em'
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Lines from each asset to contract */}
      {assets.map((label, i) => {
        const dashLen = 200;
        const off = (1 - draw(progress, 0.18 + i * 0.04, 0.2)) * dashLen;
        return (
          <line
            key={`line-${label}`}
            x1={128}
            y1={78 + i * 95}
            x2={250}
            y2={180}
            stroke='rgb(0, 229, 255)'
            strokeWidth={1}
            strokeOpacity={0.6}
            strokeDasharray={dashLen}
            strokeDashoffset={off}
          />
        );
      })}

      {/* Smart contract box */}
      <g style={{ opacity: draw(progress, 0.4, 0.25) }}>
        <rect
          x={250}
          y={140}
          width={130}
          height={80}
          rx={8}
          fill='rgba(18, 24, 38, 1)'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
        />
        <text
          x={315}
          y={172}
          textAnchor='middle'
          fill='rgb(232, 238, 248)'
          fontSize={12}
          fontFamily='"Space Grotesk", sans-serif'
          letterSpacing='0.08em'
        >
          SMART
        </text>
        <text
          x={315}
          y={194}
          textAnchor='middle'
          fill='rgb(232, 238, 248)'
          fontSize={12}
          fontFamily='"Space Grotesk", sans-serif'
          letterSpacing='0.08em'
        >
          CONTRACT
        </text>
        <circle
          cx={315}
          cy={210}
          r={2.5}
          fill='rgb(0, 229, 255)'
          opacity={0.7 + Math.sin(progress * 12) * 0.3}
        />
      </g>

      {/* Arrow to vault */}
      <line
        x1={380}
        y1={180}
        x2={460}
        y2={180}
        stroke='rgb(0, 229, 255)'
        strokeWidth={1.5}
        strokeOpacity={0.85}
        strokeDasharray={80}
        strokeDashoffset={(1 - draw(progress, 0.6, 0.18)) * 80}
      />

      {/* Vault */}
      <g
        style={{ opacity: draw(progress, 0.7, 0.25) }}
        filter='url(#sw-glow)'
      >
        <rect
          x={460}
          y={140}
          width={100}
          height={80}
          rx={8}
          fill='rgba(0, 229, 255, 0.08)'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.8}
        />
        <path
          d='M 510 158 v 12 M 504 170 a 6 6 0 0 1 12 0 v 6 M 498 176 h 24 v 18 h -24 z'
          fill='none'
          stroke='rgb(0, 229, 255)'
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>

      {/* Vault label */}
      <text
        x={510}
        y={245}
        textAnchor='middle'
        fill='rgb(0, 229, 255)'
        fontSize={11}
        letterSpacing='0.25em'
        fontFamily='"Space Grotesk", sans-serif'
        style={{ opacity: draw(progress, 0.78, 0.2) }}
      >
        VAULT
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
        FLOW · STORE · INHERIT
      </text>
    </svg>
  );
}
