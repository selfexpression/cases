import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'cases:v1'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('cases-storage-change', onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener('cases-storage-change', onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function useStorageVersion() {
  return useSyncExternalStore(subscribe, () => window.localStorage.getItem(STORAGE_KEY) ?? '', () => '')
}
