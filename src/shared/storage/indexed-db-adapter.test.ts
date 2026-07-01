import { beforeEach, describe, expect, it } from 'vitest'
import { deleteDB } from 'idb'
import { indexedDbAdapter } from './indexed-db-adapter'
import { defaultStorage } from './default-storage'
import { localStorageAdapter } from './local-storage-adapter'
import { installTestLocalStorage } from './test-storage'

describe('indexedDbAdapter', () => {
  beforeEach(async () => {
    installTestLocalStorage()
    await deleteDB('cases')
  })

  it('migrates existing localStorage data on first read', async () => {
    localStorageAdapter.write({
      ...defaultStorage,
      patients: [
        {
          id: 'patient-1',
          clinicId: defaultStorage.settings.activeClinicId,
          fullName: 'Анна Смирнова',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-01T00:00:00.000Z',
        },
      ],
    })

    const storage = await indexedDbAdapter.read()

    expect(storage.patients).toHaveLength(1)
    expect(window.localStorage.getItem('cases:indexeddb-migrated')).toBe('true')
  })
})
