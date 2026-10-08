import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const ConstellationBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    // Warm golden & amber color palette matching the screenshot reference
    const GOLD_COLORS = [
      { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' }, // Amber-500
      { fill: '#fbbf24', glow: 'rgba(251, 191, 36, 0.7)' }, // Amber-400
      { fill: '#d97706', glow: 'rgba(217, 119, 6, 0.5)' },  // Amber-600
      { fill: '#fcd34d', glow: 'rgba(252, 211, 77, 0.8)' }, // Amber-300
    ];

    const initParticles = (w: number, h: number) => {
      // Calculate particle density for clean, uncluttered constellation look
      const area = w * h;
      const count = Math.max(24, Math.min(65, Math.floor(area / 24000)));

      particles = [];
      for (let i = 0; i < count; i++) {
        const palette = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2.2 + 2.4, // Dot radius: 2.4px - 4.6px like in screenshot
          color: palette.fill,
          glowColor: palette.glow,
          alpha: Math.random() * 0.3 + 0.7,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    // Mouse tracking for subtle interactive connections
    let mouseX: number | null = null;
    let mouseY: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const maxLineDistance = 145; // Max distance to form connection lines

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      // Pure solid black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Subtle warm radial vignette in center for depth
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, 'rgba(18, 12, 6, 0.45)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently at borders with margin
        if (p.x < 10) {
          p.x = 10;
          p.vx *= -1;
        } else if (p.x > width - 10) {
          p.x = width - 10;
          p.vx *= -1;
        }

        if (p.y < 10) {
          p.y = 10;
          p.vy *= -1;
        } else if (p.y > height - 10) {
          p.y = height - 10;
          p.vy *= -1;
        }

        // Pulse phase
        p.pulsePhase += p.pulseSpeed;
      }

      // Draw connecting lines between close particles (as shown in reference screenshot)
      ctx.lineWidth = 0.9;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDistance) {
            const alpha = (1 - dist / maxLineDistance) * 0.35;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw faint lines to cursor if mouse is hovering in the hero area
      if (mouseX !== null && mouseY !== null) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDistance * 1.1) {
            const alpha = (1 - dist / (maxLineDistance * 1.1)) * 0.3;
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }

      // Draw glowing amber dots (golden nodes from screenshot)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = Math.sin(p.pulsePhase) * 0.2 + 0.85;
        const currentRadius = p.radius * pulse;

        // Outer soft glow
        ctx.save();
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright center dot for high-definition star look
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff8eb';
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block', backgroundColor: '#000000' }}
    />
  );
};
