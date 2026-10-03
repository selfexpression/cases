import type { Clinic } from '@/entities/clinic/types'
import type { Patient } from '@/entities/patient/types'
import { groupReminders, type ReminderGroup } from './group-reminders'
import type { Reminder } from './types'

export type ClinicReminderGroup = {
  clinicId: string
  title: string
  count: number
  groups: ReminderGroup[]
}

export function groupRemindersByClinic({ clinics, patients, reminders }: {
  clinics: Clinic[]
  patients: Patient[]
  reminders: Reminder[]
}): ClinicReminderGroup[] {
  const clinicsById = new Map(clinics.map((clinic) => [clinic.id, clinic]))
  const patientsById = new Map(patients.map((patient) => [patient.id, patient]))
  const remindersByClinic = new Map<string, Reminder[]>()

  for (const reminder of reminders) {
    const patient = patientsById.get(reminder.patientId)
    if (!patient) continue

    const clinicReminders = remindersByClinic.get(patient.clinicId) ?? []
    clinicReminders.push(reminder)
    remindersByClinic.set(patient.clinicId, clinicReminders)
  }

  return [...remindersByClinic].map(([clinicId, clinicReminders]) => ({
    clinicId,
    title: clinicsById.get(clinicId)?.name ?? 'Клиника не найдена',
    count: clinicReminders.length,
    groups: groupReminders(clinicReminders),
  })).sort((first, second) => first.title.localeCompare(second.title, 'ru'))
}
