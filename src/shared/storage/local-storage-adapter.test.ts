import { beforeEach, describe, expect, it } from 'vitest'
import { defaultStorage } from './default-storage'
import { localStorageAdapter } from './local-storage-adapter'
import { installTestLocalStorage } from './test-storage'

describe('localStorageAdapter', () => {
  beforeEach(() => {
    installTestLocalStorage()
  })

  it('returns default storage when storage is empty', () => {
    expect(localStorageAdapter.read()).toEqual(defaultStorage)
  })

  it('returns default storage when stored value is corrupted', () => {
    window.localStorage.setItem('cases:v1', '{bad json')

    expect(localStorageAdapter.read()).toEqual(defaultStorage)
  })

  it('persists valid storage', () => {
    const storage = {
      ...defaultStorage,
      patients: [
        {
          id: 'patient-1',
          clinicId: defaultStorage.settings.activeClinicId,
          fullName: 'Иван Иванов',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-01T00:00:00.000Z',
        },
      ],
    }

    localStorageAdapter.write(storage)

    expect(localStorageAdapter.read().patients).toHaveLength(1)
  })
})
