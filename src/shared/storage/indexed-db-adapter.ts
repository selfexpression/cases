import { openDB, type DBSchema } from 'idb'
import type { AppStorage } from './app-storage-schema'
import { defaultStorage } from './default-storage'
import { localStorageAdapter } from './local-storage-adapter'
import { migrateStorage } from './migrations'

const DATABASE_NAME = 'cases'
const DATABASE_VERSION = 1
const STORAGE_STORE = 'storage'
const STORAGE_KEY = 'app'
const LOCAL_STORAGE_MIGRATION_KEY = 'cases:indexeddb-migrated'

type CasesDatabase = DBSchema & {
  storage: {
    key: string
    value: AppStorage
  }
}

function cloneDefaultStorage(): AppStorage {
  return structuredClone(defaultStorage)
}

async function openCasesDatabase() {
  return openDB<CasesDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORAGE_STORE)) {
        database.createObjectStore(STORAGE_STORE)
      }
    },
  })
}

async function migrateFromLocalStorageIfNeeded() {
  if (window.localStorage.getItem(LOCAL_STORAGE_MIGRATION_KEY) === 'true') {
    return undefined
  }

  const localStorageValue = localStorageAdapter.read()
  window.localStorage.setItem(LOCAL_STORAGE_MIGRATION_KEY, 'true')

  if (
    localStorageValue.patients.length ||
    localStorageValue.visits.length ||
    localStorageValue.notes.length ||
    localStorageValue.hygieneRecords.length ||
    localStorageValue.orthodonticCases.length
  ) {
    return localStorageValue
  }

  return undefined
}

export const indexedDbAdapter = {
  async read() {
    const database = await openCasesDatabase()
    const storedValue = await database.get(STORAGE_STORE, STORAGE_KEY)

    if (storedValue) {
      return migrateStorage(storedValue)
    }

    const migratedLocalStorage = await migrateFromLocalStorageIfNeeded()
    const nextStorage = migratedLocalStorage ?? cloneDefaultStorage()
    await database.put(STORAGE_STORE, nextStorage, STORAGE_KEY)

    return nextStorage
  },
  async write(value: AppStorage) {
    const database = await openCasesDatabase()
    await database.put(STORAGE_STORE, value, STORAGE_KEY)
  },
  async reset() {
    const database = await openCasesDatabase()
    await database.delete(STORAGE_STORE, STORAGE_KEY)
  },
}
