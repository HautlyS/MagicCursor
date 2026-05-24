<template>
  <div class="magic-mouse-container">
    <canvas ref="canvasRef" class="magic-mouse-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Effect types
type EffectType = 'fluid' | 'stars' | 'sparkles' | 'bubbles' | 'hearts' | 'fireflies' | 'rainbow' | 'neon' | 'glitch' | 'cute' | 'anime';

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

const props = withDefaults(defineProps<{
  effectType?: EffectType;
  splatRadius?: number;
  splatForce?: number;
}>(), {
  effectType: 'fluid',
  splatRadius: 0.2,
  splatForce: 6000,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId: number | null = null;
let particles: Particle[] = [];

const COLOR_SCHEMES: Record<EffectType, string[]> = {
  fluid: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
  stars: ['#fff9c4', '#fff176', '#ffeb3b', '#ffd54f', '#ffca28'],
  sparkles: ['#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0'],
  bubbles: ['#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4'],
  hearts: ['#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60'],
  fireflies: ['#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50'],
  rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
  neon: ['#ff00ff', '#00ffff', '#ff66ff', '#66ffff', '#ff33ff'],
  glitch: ['#00ff00', '#ff0000', '#0000ff', '#00ffff', '#ff00ff'],
  cute: ['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#e8baff'],
  anime: ['#ff6ec7', '#6eb5ff', '#ff9e6e', '#6eff9e', '#e56eff'],
};

const drawShape = (ctx: CanvasRenderingContext2D, p: Particle, shape: string): void => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;

  switch (shape) {
    case 'heart':
      ctx.scale(p.size / 10, p.size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(-5, -2, -10, 2, 0, 10);
      ctx.bezierCurveTo(10, 2, 5, -2, 0, 3);
      ctx.fill();
      break;
    case 'star':
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? p.size : p.size / 2;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    case 'sparkle':
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? p.size * 1.5 : p.size * 0.3;
        const angle = (i * Math.PI) / 4;
        i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    case 'bubble':
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${p.alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    case 'glitch':
      ctx.fillRect(-p.size, -p.size / 4, p.size * 2, p.size / 2);
      ctx.fillRect(-p.size * 0.7, p.size / 4, p.size * 1.5, p.size / 3);
      break;
    default:
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
  }
  ctx.restore();
};

const getShape = (effect: EffectType): string => {
  switch (effect) {
    case 'hearts': return 'heart';
    case 'stars': return 'star';
    case 'sparkles': return 'sparkle';
    case 'bubbles': return 'bubble';
    case 'glitch': return 'glitch';
    case 'cute':
    case 'anime': return Math.random() > 0.5 ? 'heart' : 'sparkle';
    default: return 'circle';
  }
};

const addParticle = (x: number, y: number, dx: number, dy: number): void => {
  const colors = COLOR_SCHEMES[props.effectType] || COLOR_SCHEMES.fluid;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = props.effectType === 'cute' || props.effectType === 'anime' ? 5 : 3;
  const spread = props.effectType === 'fireflies' || props.effectType === 'stars' ? 50 : 30;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * spread,
      y: y + (Math.random() - 0.5) * spread,
      vx: dx * (Math.random() * 0.5 + 0.5) + (Math.random() - 0.5) * 2,
      vy: dy * (Math.random() * 0.5 + 0.5) + (Math.random() - 0.5) * 2,
      life: 1,
      maxLife: props.effectType === 'fireflies' ? 3 : props.effectType === 'bubbles' ? 4 : 2,
      size: Math.random() * 8 + 4,
      color,
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      shape: getShape(props.effectType),
    });
  }
};

const updateParticles = (): void => {
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;

    switch (props.effectType) {
      case 'bubbles': p.vy -= 0.02; p.vx *= 0.99; break;
      case 'fireflies':
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        p.vx *= 0.95;
        p.vy *= 0.95;
        break;
      case 'stars': p.vy += 0.01; p.vx *= 0.98; break;
      case 'glitch':
        p.x += (Math.random() - 0.5) * 10;
        p.y += (Math.random() - 0.5) * 10;
        break;
      default:
        p.vy += 0.02;
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

const drawParticles = (ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const p of particles) {
    if (props.effectType === 'neon' || props.effectType === 'fireflies') {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
    }

    if (props.effectType === 'glitch') {
      drawShape(ctx, p, p.shape);
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.fillStyle = '#00ffff';
      ctx.save();
      ctx.translate(Math.random() * 4 - 2, 0);
      drawShape(ctx, p, p.shape);
      ctx.restore();
      ctx.fillStyle = '#ff00ff';
      ctx.save();
      ctx.translate(Math.random() * 4 - 2, 0);
      drawShape(ctx, p, p.shape);
      ctx.restore();
    } else {
      drawShape(ctx, p, p.shape);
    }
    ctx.shadowBlur = 0;
  }
};

let ctx: CanvasRenderingContext2D | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let clickHandler: ((e: MouseEvent) => void) | null = null;

const startAnimation = (): void => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const handleResize = (): void => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  mouseMoveHandler = (e: MouseEvent): void => {
    addParticle(e.clientX, e.clientY, e.movementX * 0.1, e.movementY * 0.1);
  };

  clickHandler = (e: MouseEvent): void => {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      addParticle(e.clientX, e.clientY, Math.cos(angle) * 3, Math.sin(angle) * 3);
    }
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('click', clickHandler);

  const animate = (): void => {
    updateParticles();
    if (ctx) drawParticles(ctx);
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);
};

const stopAnimation = (): void => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
  if (clickHandler) {
    window.removeEventListener('click', clickHandler);
    clickHandler = null;
  }
  particles = [];
};

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  stopAnimation();
});

watch(() => props.effectType, () => {
  particles = [];
});
</script>

<style scoped>
.magic-mouse-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
}
.magic-mouse-canvas {
  width: 100vw;
  height: 100vh;
  display: block;
  pointer-events: none;
}
</style>