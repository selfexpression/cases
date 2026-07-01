import { readStorage, updateStorage } from '@/shared/storage/app-store'
import type { AppSettings } from './types'

export const settingsRepository = {
  get() {
    return readStorage().settings
  },
  update(settingsPatch: Partial<AppSettings>) {
    return updateStorage((storage) => ({
      ...storage,
      settings: {
        ...storage.settings,
        ...settingsPatch,
      },
    })).settings
  },
}
