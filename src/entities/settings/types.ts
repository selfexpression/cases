import type { z } from 'zod'
import type { accentColorSchema, appSettingsSchema, themeModeSchema } from '@/shared/storage/app-storage-schema'

export type ThemeMode = z.infer<typeof themeModeSchema>
export type AccentColor = z.infer<typeof accentColorSchema>
export type AppSettings = z.infer<typeof appSettingsSchema>
