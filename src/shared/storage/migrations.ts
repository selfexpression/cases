import { appStorageSchema, type AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'

const CURRENT_STORAGE_VERSION = 2

type VersionedStorage = {
  version?: number
}

type Migration = (storage: Record<string, unknown>) => Record<string, unknown>

function migrateVisitsFromDaysToWeeks(visits: unknown) {
  if (!Array.isArray(visits)) {
    return []
  }

  return visits.map((visit) => {
    if (!isRecord(visit)) {
      return visit
    }

    const shouldReturnInDays = visit.shouldReturnInDays
    const shouldReturnInWeeks =
      typeof shouldReturnInDays === 'number' && Number.isFinite(shouldReturnInDays)
        ? Math.max(1, Math.ceil(shouldReturnInDays / 7))
        : visit.shouldReturnInWeeks
    const { shouldReturnInDays: _removed, ...nextVisit } = visit
    void _removed

    return {
      ...nextVisit,
      shouldReturnInWeeks,
    }
  })
}

const migrations: Record<number, Migration> = {
  1(storage) {
    return {
      ...storage,
      version: 2,
      visits: migrateVisitsFromDaysToWeeks(storage.visits),
      settings: {
        ...cloneDefaultStorage().settings,
        ...(isRecord(storage.settings) ? storage.settings : {}),
        returnReminderLeadWeeks:
          isRecord(storage.settings) && typeof storage.settings.returnReminderLeadWeeks === 'number'
            ? storage.settings.returnReminderLeadWeeks
            : 2,
      },
    }
  },
}

function cloneDefaultStorage(): AppStorage {
  return structuredClone(defaultStorage)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeInitialStorage(value: unknown) {
  if (!isRecord(value)) {
    return cloneDefaultStorage()
  }

  return {
    ...cloneDefaultStorage(),
    ...value,
    settings: isRecord(value.settings) ? { ...cloneDefaultStorage().settings, ...value.settings } : cloneDefaultStorage().settings,
  }
}

export function migrateStorage(value: unknown): AppStorage {
  let nextStorage = normalizeInitialStorage(value) as Record<string, unknown> & VersionedStorage
  let version = typeof nextStorage.version === 'number' ? nextStorage.version : 1

  while (version < CURRENT_STORAGE_VERSION) {
    const migration = migrations[version]

    if (!migration) {
      return cloneDefaultStorage()
    }

    nextStorage = migration(nextStorage)
    version = typeof nextStorage.version === 'number' ? nextStorage.version : version + 1
  }

  const result = appStorageSchema.safeParse(nextStorage)

  if (!result.success) {
    return cloneDefaultStorage()
  }

  return result.data
}

export { CURRENT_STORAGE_VERSION }
