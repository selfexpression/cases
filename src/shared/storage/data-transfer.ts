import { appStorageSchema } from './app-storage-schema'
import { readStorage, resetStorage, writeStorage } from './app-store'
import { defaultStorage } from './default-storage'

export function exportStorage() {
  return JSON.stringify(readStorage(), null, 2)
}

export function importStorage(rawValue: string) {
  const parsedValue: unknown = JSON.parse(rawValue)
  const result = appStorageSchema.safeParse(parsedValue)

  if (!result.success) {
    throw new Error('Файл не похож на экспорт Cases')
  }

  writeStorage(result.data)
  window.dispatchEvent(new Event('cases-storage-change'))
}

export function clearStorage() {
  resetStorage()
  writeStorage(defaultStorage)
  window.dispatchEvent(new Event('cases-storage-change'))
}
