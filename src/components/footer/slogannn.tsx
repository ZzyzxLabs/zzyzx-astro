import React, { useEffect, useRef } from 'react';

export default function Sogan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = containerRef.current;
    if (!canvas || !ctx || !container) return;

    let animationFrameId: number;
    let time = 0;

    // Configuration
    const textLines = ["WE ONLY", "SOLVE", "[HARD]", "PROBLEMS"];
    // 8xl is approx 96px, adjusting base size to match visual weight
    const fontSizeBase = 100; 
    const lineHeight = 0.9;
    
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      // Calculate height based on font stack to mimic "text-8xl flex-col" height
      // 4 lines * ~96px * 0.9 line-height + padding
      const estimatedHeight = rect.width < 600 ? 300 : 450; 
      
      canvas.width = rect.width * dpr;
      canvas.height = estimatedHeight * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `100%`;
      canvas.style.height = `${estimatedHeight}px`;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const draw = () => {
      time++;
      // Use logical dimensions for drawing calculations
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      // 1. Clear - Transparent background to blend with footer if needed, 
      // or dark to make the glow pop. Using dark for the effect.
      ctx.clearRect(0, 0, width, height);
      
      // Optional: Add a very subtle dark backing if your footer isn't black
      // ctx.fillStyle = 'rgba(0,0,0,0.5)';
      // ctx.fillRect(0,0,width,height);

      const baseIntensity = 0.03; 
      const interactionIntensity = mouseRef.current.active ? 0.2 : 0;
      const totalIntensity = baseIntensity + interactionIntensity;

      const responsiveFontSize = Math.min(width / 5.5, fontSizeBase);
      ctx.font = `900 ${responsiveFontSize}px "Inter", "Helvetica Neue", sans-serif`;
      ctx.textAlign = 'left'; // Align left like standard flex-col text usually does, or center if preferred
      ctx.textBaseline = 'alphabetic';

      const totalContentHeight = textLines.length * responsiveFontSize * lineHeight;
      const startY = (height - totalContentHeight) / 2 + responsiveFontSize * 0.8; // Approximate baseline adjustment
      const startX = (width - ctx.measureText("WE ONLY").width) / 2; // Center horizontally

      textLines.forEach((line, index) => {
        const isHard = line === "[HARD]";
        const y = startY + index * responsiveFontSize * lineHeight;
        
        // Center alignment calculation
        const lineWidth = ctx.measureText(line).width;
        const x = (width - lineWidth) / 2;

        const jitterX = Math.random() < totalIntensity ? random(-2, 2) : 0;
        const jitterY = Math.random() < totalIntensity ? random(-2, 2) : 0;
        const offset = Math.random() < totalIntensity ? random(2, 4) : 0;
        
        // --- [HARD] RED LOGIC ---
        if (isHard) {
            // Intense Red Glitch
            ctx.globalCompositeOperation = 'source-over';
            
            // Red Shadow/Glow
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = Math.random() > 0.8 ? 20 : 0;
            
            // Chromatic Aberration (Cyan split for contrast)
            if (Math.random() < 0.3) {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
                ctx.fillText(line, x - offset, y);
            }

            // Main Red Text
            // Using a bright red (#ef4444 = tailwind red-500)
            ctx.fillStyle = Math.random() > 0.95 ? '#cccccc' : '#ef4444'; 
            ctx.fillText(line, x + jitterX, y + jitterY);
            
            // Reset shadow
            ctx.shadowBlur = 0;
        } else {
            // --- Normal Text (Gray-400 style) ---
            // Simulating text-gray-400 (#9ca3af)
            ctx.fillStyle = '#9ca3af'; 
            
            // Occasional glitch on normal text
            if (Math.random() < totalIntensity) {
                ctx.fillStyle = '#d1d5db'; // lighter gray flicker
            }
            ctx.fillText(line, x + jitterX, y + jitterY);
        }
      });

      // Scanline overlay (optional, keeps the tech feel)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let i = 0; i < height; i += 3) {
        ctx.fillRect(0, i, width, 1);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex text-gray-400 font-extrabold flex-col text-8xl w-full cursor-default select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
