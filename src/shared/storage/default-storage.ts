import type { AppStorage } from './app-storage-schema'

export const defaultStorage: AppStorage = {
  version: 2,
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
