import { useSyncExternalStore } from 'react'

let storageVersion = 0

function subscribe(onStoreChange: () => void) {
  const handleStorageChange = () => {
    storageVersion += 1
    onStoreChange()
  }

  window.addEventListener('cases-storage-change', handleStorageChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener('cases-storage-change', handleStorageChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function useStorageVersion() {
  return useSyncExternalStore(subscribe, () => storageVersion, () => 0)
}
