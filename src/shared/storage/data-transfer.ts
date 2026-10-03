import { readStorage, writeStorage } from './app-store'
import { defaultStorage } from './default-storage'
import { migrateStorage } from './migrations'

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
  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    throw new Error('Файл не похож на экспорт Cases')
  }
  const wrapped = 'storage' in parsedValue
  if (wrapped && (!('app' in parsedValue) || parsedValue.app !== 'cases' || !('type' in parsedValue) || parsedValue.type !== 'cases-backup')) {
    throw new Error('Файл не похож на экспорт Cases')
  }
  const storage = migrateStorage(wrapped ? parsedValue.storage : parsedValue, true)
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
