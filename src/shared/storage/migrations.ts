import { differenceInCalendarMonths, parseISO } from 'date-fns'
import { appStorageSchema, type AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'

const CURRENT_STORAGE_VERSION = 5

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
  2(storage) {
    return {
      ...storage,
      version: 3,
      hygieneRecords: migrateHygieneDatesToMonths(storage.hygieneRecords),
    }
  },
  3(storage) {
    return {
      ...storage,
      version: 4,
      patients: removePatientPhones(storage.patients),
    }
  },
  4(storage) {
    return {
      ...storage,
      version: 5,
      hygieneRecords: migrateHygieneWeeksToMonths(storage.hygieneRecords),
    }
  },
}

function removePatientPhones(patients: unknown) {
  if (!Array.isArray(patients)) {
    return []
  }

  return patients.map((patient) => {
    if (!isRecord(patient)) {
      return patient
    }

    const { phone: _removed, ...nextPatient } = patient
    void _removed

    return nextPatient
  })
}

function migrateHygieneDatesToMonths(hygieneRecords: unknown) {
  if (!Array.isArray(hygieneRecords)) {
    return []
  }

  return hygieneRecords.map((record) => {
    if (!isRecord(record)) {
      return record
    }

    const completedAt = typeof record.completedAt === 'string' ? record.completedAt : undefined
    const nextDueAt = typeof record.nextDueAt === 'string' ? record.nextDueAt : undefined
    const nextDueInMonths =
      typeof record.nextDueInMonths === 'number'
        ? record.nextDueInMonths
        : typeof record.nextDueInWeeks === 'number'
          ? Math.max(1, Math.ceil(record.nextDueInWeeks / 4))
        : completedAt && nextDueAt
          ? Math.max(1, differenceInCalendarMonths(parseISO(nextDueAt), parseISO(completedAt)))
          : undefined
    const { nextDueInWeeks: _removed, ...nextRecord } = record
    void _removed

    return {
      ...nextRecord,
      nextDueInMonths,
    }
  })
}

function migrateHygieneWeeksToMonths(hygieneRecords: unknown) {
  if (!Array.isArray(hygieneRecords)) {
    return []
  }

  return hygieneRecords.map((record) => {
    if (!isRecord(record)) {
      return record
    }

    const nextDueInMonths =
      typeof record.nextDueInMonths === 'number'
        ? record.nextDueInMonths
        : typeof record.nextDueInWeeks === 'number'
          ? Math.max(1, Math.ceil(record.nextDueInWeeks / 4))
          : undefined
    const { nextDueInWeeks: _removed, ...nextRecord } = record
    void _removed

    return {
      ...nextRecord,
      nextDueInMonths,
    }
  })
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
