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
