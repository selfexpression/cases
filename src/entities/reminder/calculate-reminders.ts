import { addWeeksISO, getDueState, subtractWeeksISO } from '@/shared/lib/date/date'
import type { HygieneRecord } from '@/entities/hygiene/types'
import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { Patient } from '@/entities/patient/types'
import type { Visit } from '@/entities/visit/types'
import type { Reminder } from './types'

type CalculateRemindersParams = {
  hygieneRecords: HygieneRecord[]
  orthodonticCases: OrthodonticCase[]
  patients: Patient[]
  returnReminderLeadWeeks?: number
  visits: Visit[]
}

function getLatestVisit(patientId: string, visits: Visit[]) {
  return visits
    .filter((visit) => visit.patientId === patientId)
    .sort((first, second) => second.visitDate.localeCompare(first.visitDate))[0]
}

function getLatestHygiene(patientId: string, hygieneRecords: HygieneRecord[]) {
  return hygieneRecords
    .filter((record) => record.patientId === patientId)
    .sort((first, second) => second.completedAt.localeCompare(first.completedAt))[0]
}

function hasText(value?: string) {
  return Boolean(value?.trim())
}

export function calculateReminders({
  hygieneRecords,
  orthodonticCases,
  patients,
  returnReminderLeadWeeks = 2,
  visits,
}: CalculateRemindersParams) {
  const reminders: Reminder[] = []

  for (const patient of patients) {
    const latestVisit = getLatestVisit(patient.id, visits)
    const orthodonticCase = orthodonticCases.find((caseItem) => caseItem.patientId === patient.id)
    const latestHygiene = getLatestHygiene(patient.id, hygieneRecords)

    if (!hasText(orthodonticCase?.nextPlannedAction)) {
      reminders.push({
        patientId: patient.id,
        tone: 'neutral',
        type: 'missing-next-action',
      })
    }

    if (latestVisit?.nextAppointmentDate) {
      const dueState = getDueState(latestVisit.nextAppointmentDate)

      if (dueState === 'overdue') {
        reminders.push({
          dueDate: latestVisit.nextAppointmentDate,
          patientId: patient.id,
          tone: 'danger',
          type: 'appointment-overdue',
        })
      }

      if (dueState === 'today') {
        reminders.push({
          dueDate: latestVisit.nextAppointmentDate,
          patientId: patient.id,
          tone: 'accent',
          type: 'appointment-today',
        })
      }

      if (dueState === 'soon') {
        reminders.push({
          dueDate: latestVisit.nextAppointmentDate,
          patientId: patient.id,
          tone: 'neutral',
          type: 'appointment-upcoming',
        })
      }
    } else if (latestVisit?.shouldReturnInWeeks) {
      const dueDate = addWeeksISO(latestVisit.visitDate, latestVisit.shouldReturnInWeeks)
      const reminderStartDate = subtractWeeksISO(dueDate, returnReminderLeadWeeks ?? 2)
      const dueState = getDueState(dueDate)
      const reminderStartState = getDueState(reminderStartDate)

      if (dueState === 'overdue' || dueState === 'today') {
        reminders.push({
          dueDate,
          patientId: patient.id,
          tone: dueState === 'overdue' ? 'danger' : 'warning',
          type: 'return-due',
        })
      } else if (reminderStartState === 'overdue' || reminderStartState === 'today') {
        reminders.push({
          dueDate,
          patientId: patient.id,
          tone: 'neutral',
          type: 'return-upcoming',
        })
      }
    } else {
      reminders.push({
        patientId: patient.id,
        tone: 'warning',
        type: 'missing-next-appointment',
      })
    }

    if (latestHygiene?.nextDueAt) {
      const dueState = getDueState(latestHygiene.nextDueAt)

      if (dueState === 'overdue' || dueState === 'today') {
        reminders.push({
          dueDate: latestHygiene.nextDueAt,
          patientId: patient.id,
          tone: dueState === 'overdue' ? 'danger' : 'warning',
          type: 'hygiene-due',
        })
      }
    }
  }

  return reminders.sort((first, second) => {
    const firstDate = 'dueDate' in first ? first.dueDate : '9999-12-31'
    const secondDate = 'dueDate' in second ? second.dueDate : '9999-12-31'
    return firstDate.localeCompare(secondDate)
  })
}
