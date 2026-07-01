import { describe, expect, it } from 'vitest'
import { defaultStorage } from './default-storage'
import { migrateStorage } from './migrations'

describe('migrateStorage', () => {
  it('fills missing collections for current schema-compatible storage', () => {
    expect(
      migrateStorage({
        version: 4,
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

  it('migrates v2 hygiene next date to months interval', () => {
    expect(
      migrateStorage({
        version: 2,
        patients: [],
        orthodonticCases: [],
        notes: [],
        visits: [],
        settings: { themeMode: 'system', accentColor: 'teal', returnReminderLeadWeeks: 2 },
        hygieneRecords: [
          {
            id: 'hygiene-1',
            patientId: 'patient-1',
            completedAt: '2026-01-01',
            nextDueAt: '2026-06-30',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      }).hygieneRecords[0]?.nextDueInMonths,
    ).toBe(5)
  })

  it('migrates v4 hygiene weeks interval to months interval', () => {
    expect(
      migrateStorage({
        version: 4,
        patients: [],
        orthodonticCases: [],
        notes: [],
        visits: [],
        settings: { themeMode: 'system', accentColor: 'teal', returnReminderLeadWeeks: 2 },
        hygieneRecords: [
          {
            id: 'hygiene-1',
            patientId: 'patient-1',
            completedAt: '2026-01-01',
            nextDueAt: '2026-06-30',
            nextDueInWeeks: 26,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      }).hygieneRecords[0]?.nextDueInMonths,
    ).toBe(7)
  })

  it('removes patient phone during v3 migration', () => {
    expect(
      migrateStorage({
        version: 3,
        patients: [
          {
            id: 'patient-1',
            fullName: 'Анна Смирнова',
            phone: '+79990000000',
            createdAt: '2026-07-01T00:00:00.000Z',
            updatedAt: '2026-07-01T00:00:00.000Z',
          },
        ],
        orthodonticCases: [],
        notes: [],
        visits: [],
        hygieneRecords: [],
        settings: { themeMode: 'system', accentColor: 'teal', returnReminderLeadWeeks: 2 },
      }).patients[0],
    ).toEqual({
      id: 'patient-1',
      fullName: 'Анна Смирнова',
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    })
  })

  it('returns default storage for invalid payloads', () => {
    expect(migrateStorage(null)).toEqual(defaultStorage)
    expect(migrateStorage({ version: 999 })).toEqual(defaultStorage)
  })
})
