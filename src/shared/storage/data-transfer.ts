import { z } from 'zod'
import { appStorageSchema } from './app-storage-schema'
import { readStorage, writeStorage } from './app-store'
import { defaultStorage } from './default-storage'
import { migrateStorage } from './migrations'

const backupSchema = z.union([
  appStorageSchema,
  z.object({
    app: z.literal('cases'),
    exportedAt: z.string(),
    storage: z.unknown(),
    type: z.literal('cases-backup'),
  }),
])

export function exportStorage() {
  return JSON.stringify(
    {
      app: 'cases',
      type: 'cases-backup',
      exportedAt: new Date().toISOString(),
      storage: readStorage(),
    },
    null,
    2,
  )
}

export function importStorage(rawValue: string) {
  const parsedValue: unknown = JSON.parse(rawValue)
  const result = backupSchema.safeParse(parsedValue)

  if (!result.success) {
    throw new Error('Файл не похож на экспорт Cases')
  }

  const storage = 'storage' in result.data ? migrateStorage(result.data.storage) : result.data
  writeStorage(storage)

  return {
    patients: storage.patients.length,
    visits: storage.visits.length,
    notes: storage.notes.length,
    hygieneRecords: storage.hygieneRecords.length,
  }
}

export function clearStorage() {
  writeStorage(defaultStorage)
}
