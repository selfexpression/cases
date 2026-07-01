import { createContext } from 'react'
import type { AccentColor, ThemeMode } from '@/entities/settings/types'

export type ThemeContextValue = {
  accentColor: AccentColor
  setAccentColor: (accentColor: AccentColor) => void
  themeMode: ThemeMode
  setThemeMode: (themeMode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
