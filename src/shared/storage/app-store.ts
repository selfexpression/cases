import type { AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'
import { indexedDbAdapter } from './indexed-db-adapter'

type Updater = (storage: AppStorage) => AppStorage

let memoryStorage = structuredClone(defaultStorage)
let isHydrated = false

function emitStorageChange() {
  window.dispatchEvent(new Event('cases-storage-change'))
}

export async function hydrateStorage() {
  if (isHydrated) {
    return memoryStorage
  }

  memoryStorage = await indexedDbAdapter.read()
  isHydrated = true
  emitStorageChange()

  return memoryStorage
}

export function readStorage() {
  return memoryStorage
}

export function writeStorage(storage: AppStorage) {
  memoryStorage = storage
  isHydrated = true
  void indexedDbAdapter.write(storage)
  emitStorageChange()
}

export function updateStorage(updater: Updater) {
  const nextStorage = updater(readStorage())
  writeStorage(nextStorage)
  return nextStorage
}

export function resetStorage() {
  memoryStorage = structuredClone(defaultStorage)
  isHydrated = true
  void indexedDbAdapter.reset()
  emitStorageChange()
}
