import { useTheme } from '@/app/providers/use-theme'
import { Select } from '@/shared/ui/select/Select'
import type { AccentColor, ThemeMode } from '@/entities/settings/types'

const themeOptions = [
  { label: 'Системная', value: 'system' },
  { label: 'Светлая', value: 'light' },
  { label: 'Тёмная', value: 'dark' },
]

const accentOptions = [
  { label: 'Teal', value: 'teal' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Rose', value: 'rose' },
  { label: 'Violet', value: 'violet' },
]

export function ThemeSwitcher() {
  const { accentColor, setAccentColor, setThemeMode, themeMode } = useTheme()

  return (
    <>
      <Select
        label="Тема"
        onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
        options={themeOptions}
        value={themeMode}
      />
      <Select
        label="Акцент"
        onChange={(event) => setAccentColor(event.target.value as AccentColor)}
        options={accentOptions}
        value={accentColor}
      />
    </>
  )
}
