import type { AppStorage } from './app-storage-schema'

export const defaultStorage: AppStorage = {
  version: 6,
  patients: [],
  orthodonticCases: [],
  notes: [],
  visits: [],
  hygieneRecords: [],
  settings: {
    themeMode: 'system',
    accentColor: 'teal',
    returnReminderLeadWeeks: 2,
  },
}
