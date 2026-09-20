export type ThemeName = 'light-minimal'

export interface ThemeConfig {
  name: string
  label: string
  description: string
  colors: {
    background: string
    surface: string
    surface2: string
    border: string
    text: string
    textSecondary: string
    textTertiary: string
    primary: string
    primaryHover: string
    accent: string
    accent2: string
    gradientStart: string
    gradientEnd: string
  }
  shadows: {
    card: string
    hover: string
  }
  fontFamily: string
}

export const themes: Record<ThemeName, ThemeConfig> = {
  'light-minimal': {
    name: 'light-minimal',
    label: '浅色简约',
    description: '浅色简约风格，米色背景，金色点缀，专业优雅',
    colors: {
      background: '#FAF9F6',
      surface: '#FFFFFF',
      surface2: '#F5F4F1',
      border: '#E5E3DD',
      text: '#2D2D2D',
      textSecondary: '#6B6B6B',
      textTertiary: '#9A9A9A',
      primary: '#D4A574',
      primaryHover: '#C49464',
      accent: '#8B7355',
      accent2: '#A67C52',
      gradientStart: '#D4A574',
      gradientEnd: '#8B7355'
    },
    shadows: {
      card: '0 2px 12px rgba(0, 0, 0, 0.05)',
      hover: '0 8px 24px rgba(212, 165, 116, 0.15)'
    },
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
  }
}

export const getTheme = (name: ThemeName): ThemeConfig => themes[name]