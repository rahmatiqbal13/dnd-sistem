export interface ThemeColors {
  'forest-deep': string
  'forest-mid': string
  'forest-light': string
  'gold': string
  'gold-light': string
  'crimson': string
  'parchment': string
  'midnight': string
}

export interface Theme {
  id: string
  name: string
  primary: string
  accent: string
  bg: string
  colors: ThemeColors
}

export const THEMES: Theme[] = [
  {
    id: 'forest',
    name: 'Hutan Hijau',
    primary: '#1a4a2a',
    accent: '#d4980a',
    bg: '#fdf6e3',
    colors: {
      'forest-deep': '#1a4a2a',
      'forest-mid': '#266642',
      'forest-light': '#4aaa68',
      'gold': '#d4980a',
      'gold-light': '#f2c438',
      'crimson': '#a02424',
      'parchment': '#fdf6e3',
      'midnight': '#131d14',
    },
  },
  {
    id: 'sapphire',
    name: 'Biru Malam',
    primary: '#1a2e5e',
    accent: '#c8a830',
    bg: '#edf2ff',
    colors: {
      'forest-deep': '#1a2e5e',
      'forest-mid': '#2a4a9e',
      'forest-light': '#5282e0',
      'gold': '#c8a830',
      'gold-light': '#e8cc60',
      'crimson': '#9e2020',
      'parchment': '#edf2ff',
      'midnight': '#0c1428',
    },
  },
  {
    id: 'ruby',
    name: 'Merah Api',
    primary: '#6e1212',
    accent: '#c8a000',
    bg: '#fff4f0',
    colors: {
      'forest-deep': '#6e1212',
      'forest-mid': '#9e2020',
      'forest-light': '#d44040',
      'gold': '#c8a000',
      'gold-light': '#e8c020',
      'crimson': '#b81010',
      'parchment': '#fff4f0',
      'midnight': '#1a0c0c',
    },
  },
  {
    id: 'amethyst',
    name: 'Ungu Mistis',
    primary: '#3d1a6e',
    accent: '#d4a010',
    bg: '#f8f0ff',
    colors: {
      'forest-deep': '#3d1a6e',
      'forest-mid': '#5a2d9c',
      'forest-light': '#8a52d4',
      'gold': '#d4a010',
      'gold-light': '#f0c830',
      'crimson': '#9e2020',
      'parchment': '#f8f0ff',
      'midnight': '#180a2e',
    },
  },
  {
    id: 'amber',
    name: 'Pasir Emas',
    primary: '#6b4410',
    accent: '#e89820',
    bg: '#fdf5e0',
    colors: {
      'forest-deep': '#6b4410',
      'forest-mid': '#8c6020',
      'forest-light': '#c89040',
      'gold': '#e89820',
      'gold-light': '#f8bc40',
      'crimson': '#9e2020',
      'parchment': '#fdf5e0',
      'midnight': '#1e1608',
    },
  },
  {
    id: 'teal',
    name: 'Teal Samudra',
    primary: '#0a4040',
    accent: '#d4aa20',
    bg: '#e8f6f6',
    colors: {
      'forest-deep': '#0a4040',
      'forest-mid': '#126060',
      'forest-light': '#22a09a',
      'gold': '#d4aa20',
      'gold-light': '#f2cc30',
      'crimson': '#9e2020',
      'parchment': '#e8f6f6',
      'midnight': '#051818',
    },
  },
  {
    id: 'rose',
    name: 'Mawar Merah Muda',
    primary: '#6e1840',
    accent: '#d4960a',
    bg: '#fff0f5',
    colors: {
      'forest-deep': '#6e1840',
      'forest-mid': '#9e2860',
      'forest-light': '#d45090',
      'gold': '#d4960a',
      'gold-light': '#f0b820',
      'crimson': '#a01818',
      'parchment': '#fff0f5',
      'midnight': '#1a0812',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    primary: '#222228',
    accent: '#c8902a',
    bg: '#f4f4f8',
    colors: {
      'forest-deep': '#222228',
      'forest-mid': '#3a3a48',
      'forest-light': '#6868a0',
      'gold': '#c8902a',
      'gold-light': '#e8b048',
      'crimson': '#a02020',
      'parchment': '#f4f4f8',
      'midnight': '#10101a',
    },
  },
  {
    id: 'crimson-knight',
    name: 'Crimson Knight',
    primary: '#4a0e16',
    accent: '#d4af37',
    bg: '#faf3f0',
    colors: {
      'forest-deep': '#4a0e16',
      'forest-mid': '#7a1a24',
      'forest-light': '#b03040',
      'gold': '#d4af37',
      'gold-light': '#e8c94a',
      'crimson': '#8b0000',
      'parchment': '#faf3f0',
      'midnight': '#1a0a0c',
    },
  },
  {
    id: 'draconic-bronze',
    name: 'Draconic Bronze',
    primary: '#2d1f0f',
    accent: '#cd7f32',
    bg: '#f5f0e8',
    colors: {
      'forest-deep': '#2d1f0f',
      'forest-mid': '#4a3418',
      'forest-light': '#8b6914',
      'gold': '#cd7f32',
      'gold-light': '#e8a858',
      'crimson': '#8b0000',
      'parchment': '#f5f0e8',
      'midnight': '#0f0a05',
    },
  },
  {
    id: 'mystic-indigo',
    name: 'Mystic Indigo',
    primary: '#1a1a3e',
    accent: '#c0c0c0',
    bg: '#f0f4f8',
    colors: {
      'forest-deep': '#1a1a3e',
      'forest-mid': '#2d2d6e',
      'forest-light': '#4a4aa0',
      'gold': '#808080',
      'gold-light': '#c0c0c0',
      'crimson': '#8b0000',
      'parchment': '#f0f4f8',
      'midnight': '#0a0a18',
    },
  },
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    primary: '#0f0f1a',
    accent: '#9d4edd',
    bg: '#f0f0f5',
    colors: {
      'forest-deep': '#0f0f1a',
      'forest-mid': '#1f1f3d',
      'forest-light': '#3d3d7a',
      'gold': '#9d4edd',
      'gold-light': '#c77dff',
      'crimson': '#7b2cbf',
      'parchment': '#f0f0f5',
      'midnight': '#05050a',
    },
  },
  {
    id: 'desert-nomad',
    name: 'Desert Nomad',
    primary: '#8b4513',
    accent: '#ff8c00',
    bg: '#faf8f0',
    colors: {
      'forest-deep': '#8b4513',
      'forest-mid': '#a0522d',
      'forest-light': '#cd853f',
      'gold': '#ff8c00',
      'gold-light': '#ffa500',
      'crimson': '#8b0000',
      'parchment': '#faf8f0',
      'midnight': '#2a1810',
    },
  },
  {
    id: 'iceborn-sorcerer',
    name: 'Iceborn Sorcerer',
    primary: '#0a2a4a',
    accent: '#87ceeb',
    bg: '#f8fafc',
    colors: {
      'forest-deep': '#0a2a4a',
      'forest-mid': '#1a4a7a',
      'forest-light': '#4a8ac0',
      'gold': '#87ceeb',
      'gold-light': '#b0e0e6',
      'crimson': '#4682b4',
      'parchment': '#f8fafc',
      'midnight': '#051020',
    },
  },
  {
    id: 'nature-druid',
    name: 'Nature Druid',
    primary: '#1e3a1e',
    accent: '#8b7355',
    bg: '#f5f8f0',
    colors: {
      'forest-deep': '#1e3a1e',
      'forest-mid': '#2d5a2d',
      'forest-light': '#4a8a4a',
      'gold': '#8b7355',
      'gold-light': '#a08060',
      'crimson': '#8b4513',
      'parchment': '#f5f8f0',
      'midnight': '#0f1a0f',
    },
  },
  {
    id: 'blood-hunter',
    name: 'Blood Hunter',
    primary: '#1a0a0a',
    accent: '#dc143c',
    bg: '#faf0f0',
    colors: {
      'forest-deep': '#1a0a0a',
      'forest-mid': '#3d1515',
      'forest-light': '#702020',
      'gold': '#dc143c',
      'gold-light': '#ff1744',
      'crimson': '#8b0000',
      'parchment': '#faf0f0',
      'midnight': '#0a0505',
    },
  },
  {
    id: 'arcane-scholar',
    name: 'Arcane Scholar',
    primary: '#1e1e3f',
    accent: '#daa520',
    bg: '#f5f5f0',
    colors: {
      'forest-deep': '#1e1e3f',
      'forest-mid': '#2d2d5a',
      'forest-light': '#4a4a8a',
      'gold': '#daa520',
      'gold-light': '#f0d878',
      'crimson': '#8b0000',
      'parchment': '#f5f5f0',
      'midnight': '#0f0f1e',
    },
  },
  {
    id: 'wild-magic',
    name: 'Wild Magic',
    primary: '#4a0080',
    accent: '#ff1493',
    bg: '#faf5ff',
    colors: {
      'forest-deep': '#4a0080',
      'forest-mid': '#6a00b0',
      'forest-light': '#9932cc',
      'gold': '#ff1493',
      'gold-light': '#ff69b4',
      'crimson': '#8b008b',
      'parchment': '#faf5ff',
      'midnight': '#1e0033',
    },
  },
]

export const DEFAULT_THEME_ID = 'forest'

export function applyTheme(colors: ThemeColors) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--color-${key}`, value)
  }
}

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
