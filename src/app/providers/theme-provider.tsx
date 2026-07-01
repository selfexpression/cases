import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { settingsRepository } from '@/entities/settings/settings-repository'
import type { AccentColor, ThemeMode } from '@/entities/settings/types'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }: PropsWithChildren) {
  const initialSettings = settingsRepository.get()
  const [themeMode, setThemeModeState] = useState(initialSettings.themeMode)
  const [accentColor, setAccentColorState] = useState(initialSettings.accentColor)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    document.documentElement.dataset.accent = accentColor
  }, [accentColor, themeMode])

  const setThemeMode = (nextThemeMode: ThemeMode) => {
    settingsRepository.update({ themeMode: nextThemeMode })
    setThemeModeState(nextThemeMode)
  }

  const setAccentColor = (nextAccentColor: AccentColor) => {
    settingsRepository.update({ accentColor: nextAccentColor })
    setAccentColorState(nextAccentColor)
  }

  const value = useMemo(
    () => ({ accentColor, setAccentColor, themeMode, setThemeMode }),
    [accentColor, themeMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
