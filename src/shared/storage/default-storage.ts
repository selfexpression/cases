import type { AppStorage } from './app-storage-schema'

export const DEFAULT_CLINIC_ID = 'default-clinic'

export const defaultStorage: AppStorage = {
  version: 7,
  clinics: [
    {
      id: DEFAULT_CLINIC_ID,
      name: 'Основная клиника',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  patients: [],
  orthodonticCases: [],
  notes: [],
  visits: [],
  hygieneRecords: [],
  settings: {
    themeMode: 'system',
    accentColor: 'teal',
    returnReminderLeadWeeks: 2,
    activeClinicId: DEFAULT_CLINIC_ID,
  },
}
