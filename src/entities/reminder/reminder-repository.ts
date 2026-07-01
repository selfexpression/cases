import { readStorage } from '@/shared/storage/app-store'
import { calculateReminders } from './calculate-reminders'

export const reminderRepository = {
  getAll() {
    const storage = readStorage()
    const activeClinicId = storage.clinics.some((clinic) => clinic.id === storage.settings.activeClinicId)
      ? storage.settings.activeClinicId
      : storage.clinics[0]?.id
    const patients = storage.patients.filter((patient) => patient.clinicId === activeClinicId)

    return calculateReminders({
      patients,
      orthodonticCases: storage.orthodonticCases,
      visits: storage.visits,
      hygieneRecords: storage.hygieneRecords,
      returnReminderLeadWeeks: storage.settings.returnReminderLeadWeeks,
    })
  },
}
