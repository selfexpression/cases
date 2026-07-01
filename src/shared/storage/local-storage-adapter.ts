import type { AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'
import { migrateStorage } from './migrations'
import type { StorageAdapter } from './storage-adapter'

const STORAGE_KEY = 'cases:v1'

function cloneDefaultStorage(): AppStorage {
  return structuredClone(defaultStorage)
}

function parseStorage(rawValue: string | null): AppStorage {
  if (!rawValue) {
    return cloneDefaultStorage()
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue)
    return migrateStorage(parsedValue)
  } catch {
    return cloneDefaultStorage()
  }
}

export const localStorageAdapter: StorageAdapter<AppStorage> = {
  read() {
    return parseStorage(window.localStorage.getItem(STORAGE_KEY))
  },
  write(value) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  reset() {
    window.localStorage.removeItem(STORAGE_KEY)
  },
}
