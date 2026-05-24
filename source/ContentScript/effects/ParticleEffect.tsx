import React, { useEffect, useRef } from 'react';
import { EffectType } from './types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  shape: string;
}

interface ParticleEffectProps {
  effectType: EffectType;
  colorScheme: string[];
  splatRadius?: number;
  splatForce?: number;
}

const shapeGenerators: Record<string, (ctx: CanvasRenderingContext2D, p: Particle) => void> = {
  circle: (ctx, p) => {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  },
  heart: (ctx, p) => {
    ctx.save();
    ctx.scale(p.size / 10, p.size / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-5, -2, -10, 2, 0, 10);
    ctx.bezierCurveTo(10, 2, 5, -2, 0, 3);
    ctx.fill();
    ctx.restore();
  },
  star: (ctx, p) => {
    const spikes = 5;
    const outerRadius = p.size;
    const innerRadius = p.size / 2;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  },
  sparkle: (ctx, p) => {
    const spikes = 4;
    const outerRadius = p.size * 1.5;
    const innerRadius = p.size * 0.3;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  },
  bubble: (ctx, p) => {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  },
  diamond: (ctx, p) => {
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size, 0);
    ctx.lineTo(0, p.size);
    ctx.lineTo(-p.size, 0);
    ctx.closePath();
    ctx.fill();
  },
  glitch: (ctx, p) => {
    ctx.fillRect(-p.size, -p.size / 4, p.size * 2, p.size / 2);
    ctx.fillRect(-p.size * 0.7, p.size / 4, p.size * 1.5, p.size / 3);
  },
};

export default function ParticleEffect({
  effectType,
  colorScheme,
  splatRadius = 0.2,
  splatForce = 6000,
}: ParticleEffectProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const getShape = (): string => {
      switch (effectType) {
        case 'hearts': return 'heart';
        case 'stars': return 'star';
        case 'sparkles': return 'sparkle';
        case 'bubbles': return 'bubble';
        case 'neon': return 'diamond';
        case 'glitch': return 'glitch';
        case 'cute':
        case 'anime':
          return Math.random() > 0.5 ? 'heart' : 'sparkle';
        default: return 'circle';
      }
    };

    const addParticle = (x: number, y: number, dx: number, dy: number): void => {
      const color = colorScheme[Math.floor(Math.random() * colorScheme.length)];
      const count = effectType === 'cute' || effectType === 'anime' ? 5 : 3;
      
      for (let i = 0; i < count; i++) {
        const spread = effectType === 'fireflies' || effectType === 'stars' ? 50 : 30;
        const particle: Particle = {
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread,
          vx: dx * (Math.random() * 0.5 + 0.5) + (Math.random() - 0.5) * 2,
          vy: dy * (Math.random() * 0.5 + 0.5) + (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: effectType === 'fireflies' ? 3 : effectType === 'bubbles' ? 4 : 2,
          size: Math.random() * 8 + 4,
          color,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          shape: getShape(),
        };
        particlesRef.current.push(particle);
      }
    };

    const update = (): void => {
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply different physics based on effect type
        switch (effectType) {
          case 'bubbles':
            p.vy -= 0.02; // Float up
            p.vx *= 0.99;
            break;
          case 'fireflies':
            p.vx += (Math.random() - 0.5) * 0.1;
            p.vy += (Math.random() - 0.5) * 0.1;
            p.vx *= 0.95;
            p.vy *= 0.95;
            break;
          case 'stars':
            p.vy += 0.01;
            p.vx *= 0.98;
            break;
          case 'glitch':
            p.x += (Math.random() - 0.5) * 10;
            p.y += (Math.random() - 0.5) * 10;
            break;
          default:
            p.vy += 0.02; // Slight gravity
            p.vx *= 0.98;
            p.vy *= 0.98;
        }

        p.rotation += p.rotationSpeed;
        p.life -= 0.015 / p.maxLife;
        p.alpha = Math.max(0, p.life);
        p.size *= 0.995;

        return p.life > 0 && p.size > 0.5;
      });
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        
        // Glow effect for neon/fireflies
        if (effectType === 'neon' || effectType === 'fireflies') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 20;
        }
        
        // Glitch color split
        if (effectType === 'glitch') {
          ctx.fillStyle = p.color;
          shapeGenerators[p.shape]?.(ctx, p);
          
          ctx.globalAlpha = p.alpha * 0.5;
          ctx.fillStyle = '#00ffff';
          ctx.translate(Math.random() * 4 - 2, 0);
          shapeGenerators[p.shape]?.(ctx, p);
          
          ctx.fillStyle = '#ff00ff';
          ctx.translate(Math.random() * 4 - 2, 0);
          shapeGenerators[p.shape]?.(ctx, p);
        } else {
          ctx.fillStyle = p.color;
          shapeGenerators[p.shape]?.(ctx, p);
        }
        
        ctx.restore();
      }
    };

    const animate = (): void => {
      update();
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      addParticle(e.clientX, e.clientY, e.movementX * 0.1, e.movementY * 0.1);
    };

    const handleClick = (e: MouseEvent): void => {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        addParticle(
          e.clientX,
          e.clientY,
          Math.cos(angle) * 3,
          Math.sin(angle) * 3
        );
      }
    };

    const handleTouch = (e: TouchEvent): void => {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          0,
          0
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouch);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, [effectType, colorScheme, splatRadius, splatForce]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}