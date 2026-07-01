import { describe, expect, it } from 'vitest'
import { defaultStorage } from './default-storage'
import { migrateStorage } from './migrations'

describe('migrateStorage', () => {
  it('fills missing collections for current schema-compatible storage', () => {
    expect(
      migrateStorage({
        version: 2,
        patients: [],
        settings: { themeMode: 'dark', returnReminderLeadWeeks: 3 },
      }),
    ).toEqual({
      ...defaultStorage,
      settings: {
        ...defaultStorage.settings,
        themeMode: 'dark',
        returnReminderLeadWeeks: 3,
      },
    })
  })

  it('migrates v1 visit return interval from days to weeks', () => {
    expect(
      migrateStorage({
        version: 1,
        patients: [],
        orthodonticCases: [],
        notes: [],
        hygieneRecords: [],
        settings: { themeMode: 'system', accentColor: 'teal' },
        visits: [
          {
            id: 'visit-1',
            patientId: 'patient-1',
            visitDate: '2026-06-01',
            shouldReturnInDays: 30,
            createdAt: '2026-06-01T00:00:00.000Z',
            updatedAt: '2026-06-01T00:00:00.000Z',
          },
        ],
      }).visits[0],
    ).toEqual({
      id: 'visit-1',
      patientId: 'patient-1',
      visitDate: '2026-06-01',
      shouldReturnInWeeks: 5,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
    })
  })

  it('returns default storage for invalid payloads', () => {
    expect(migrateStorage(null)).toEqual(defaultStorage)
    expect(migrateStorage({ version: 999 })).toEqual(defaultStorage)
  })
})
