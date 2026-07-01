import { readStorage } from '@/shared/storage/app-store'
import { calculateReminders } from './calculate-reminders'

export const reminderRepository = {
  getAll() {
    const storage = readStorage()

    return calculateReminders({
      patients: storage.patients,
      orthodonticCases: storage.orthodonticCases,
      visits: storage.visits,
      hygieneRecords: storage.hygieneRecords,
      returnReminderLeadWeeks: storage.settings.returnReminderLeadWeeks,
    })
  },
}
