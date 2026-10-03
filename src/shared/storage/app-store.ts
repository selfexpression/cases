import type { AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'
import { indexedDbAdapter } from './indexed-db-adapter'

type Updater = (storage: AppStorage) => AppStorage

let memoryStorage = structuredClone(defaultStorage)
let isHydrated = false
let persistedStorage = memoryStorage
let pendingWrite: Promise<void> = Promise.resolve()

function emitStorageChange() {
  window.dispatchEvent(new Event('cases-storage-change'))
}

export async function hydrateStorage() {
  if (isHydrated) {
    return memoryStorage
  }

  await pendingWrite
  memoryStorage = await indexedDbAdapter.read()
  persistedStorage = memoryStorage
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
  const write = pendingWrite.then(async () => {
    try {
      await indexedDbAdapter.write(storage)
      persistedStorage = storage
    } catch (error) {
      if (memoryStorage === storage) {
        memoryStorage = persistedStorage
        emitStorageChange()
      }
      throw error
    }
  })
  // Keep the queue usable after a failed write; callers can await the original promise.
  pendingWrite = write.catch(() => undefined)
  emitStorageChange()
  return write
}

export function updateStorage(updater: Updater) {
  const nextStorage = updater(readStorage())
  writeStorage(nextStorage)
  return nextStorage
}

export function updateStoragePersisted(updater: Updater) {
  return writeStorage(updater(readStorage()))
}

export function resetStorage() {
  return writeStorage(structuredClone(defaultStorage))
}
