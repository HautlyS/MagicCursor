// Effect type definitions and utilities
export type EffectType = 
  | 'fluid'      // Default fluid simulation
  | 'stars'      // Starry particles
  | 'sparkles'   // Sparkle burst
  | 'bubbles'    // Bubble float
  | 'hearts'     // Floating hearts
  | 'fireflies'  // Glowing fireflies
  | 'rainbow'    // Rainbow trail
  | 'neon'       // Neon glow
  | 'glitch'     // Glitch effect
  | 'cute'       // Kawaii cute effect
  | 'anime';     // Anime style effect

export const EFFECT_CONFIG: Record<EffectType, {
  name: string;
  emoji: string;
  colorScheme: string[];
  description: string;
}> = {
  fluid: {
    name: 'Fluid',
    emoji: '🎨',
    colorScheme: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
    description: 'Smooth, realistic fluid dynamics'
  },
  stars: {
    name: 'Stars',
    emoji: '⭐',
    colorScheme: ['#fff9c4', '#fff176', '#ffeb3b', '#ffd54f', '#ffca28'],
    description: 'Starry particle trail'
  },
  sparkles: {
    name: 'Sparkles',
    emoji: '✨',
    colorScheme: ['#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0'],
    description: 'Magical sparkle bursts'
  },
  bubbles: {
    name: 'Bubbles',
    emoji: '🫧',
    colorScheme: ['#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4'],
    description: 'Floating colorful bubbles'
  },
  hearts: {
    name: 'Hearts',
    emoji: '💖',
    colorScheme: ['#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60'],
    description: 'Sweet floating hearts'
  },
  fireflies: {
    name: 'Fireflies',
    emoji: '✨',
    colorScheme: ['#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50'],
    description: 'Glowing firefly particles'
  },
  rainbow: {
    name: 'Rainbow',
    emoji: '🌈',
    colorScheme: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    description: 'Classic rainbow trail'
  },
  neon: {
    name: 'Neon Glow',
    emoji: '💜',
    colorScheme: ['#ff00ff', '#00ffff', '#ff66ff', '#66ffff', '#ff33ff'],
    description: 'Neon glowing effect'
  },
  glitch: {
    name: 'Glitch',
    emoji: '🔮',
    colorScheme: ['#00ff00', '#ff0000', '#0000ff', '#00ffff', '#ff00ff'],
    description: 'Digital glitch effect'
  },
  cute: {
    name: 'Cute',
    emoji: '🌸',
    colorScheme: ['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#e8baff'],
    description: 'Kawaii cute pastel colors'
  },
  anime: {
    name: 'Anime',
    emoji: '💫',
    colorScheme: ['#ff6ec7', '#6eb5ff', '#ff9e6e', '#6eff9e', '#e56eff'],
    description: 'Anime style magical trail'
  }
};

export const ALL_EFFECTS = Object.keys(EFFECT_CONFIG) as EffectType[];

export function getRandomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.5, g: 0, b: 0 };
}