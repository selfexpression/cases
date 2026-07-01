import { localStorageAdapter } from './local-storage-adapter'
import type { AppStorage } from './app-storage-schema'

type Updater = (storage: AppStorage) => AppStorage

export function readStorage() {
  return localStorageAdapter.read()
}

export function writeStorage(storage: AppStorage) {
  localStorageAdapter.write(storage)
}

export function updateStorage(updater: Updater) {
  const nextStorage = updater(readStorage())
  writeStorage(nextStorage)
  window.dispatchEvent(new Event('cases-storage-change'))
  return nextStorage
}

export function resetStorage() {
  localStorageAdapter.reset()
  window.dispatchEvent(new Event('cases-storage-change'))
}
