import { describe, expect, it, vi } from 'vitest'
import { calculateReminders } from './calculate-reminders'

const patient = {
  id: 'patient-1',
  fullName: 'Иван Иванов',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

describe('calculateReminders', () => {
  it('returns return reminder when patient was not scheduled and return week is due', () => {
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [
        {
          patientId: patient.id,
          nextPlannedAction: 'Смена дуги',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      visits: [
        {
          id: 'visit-1',
          patientId: patient.id,
          visitDate: '2026-06-03',
          shouldReturnInWeeks: 4,
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      hygieneRecords: [],
    })

    expect(reminders).toEqual([
      {
        dueDate: '2026-07-01',
        patientId: patient.id,
        tone: 'warning',
        type: 'return-due',
      },
    ])

    vi.useRealTimers()
  })

  it('returns upcoming return reminder inside configured lead window', () => {
    vi.setSystemTime(new Date('2026-06-18T10:00:00.000Z'))

    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [
        {
          patientId: patient.id,
          nextPlannedAction: 'Смена дуги',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      visits: [
        {
          id: 'visit-1',
          patientId: patient.id,
          visitDate: '2026-06-03',
          shouldReturnInWeeks: 4,
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      hygieneRecords: [],
      returnReminderLeadWeeks: 2,
    })

    expect(reminders).toEqual([
      {
        dueDate: '2026-07-01',
        patientId: patient.id,
        tone: 'neutral',
        type: 'return-upcoming',
      },
    ])

    vi.useRealTimers()
  })

  it('returns hygiene reminder when next hygiene date is overdue', () => {
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [
        {
          patientId: patient.id,
          nextPlannedAction: 'Контроль',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      visits: [],
      hygieneRecords: [
        {
          id: 'hygiene-1',
          patientId: patient.id,
          completedAt: '2026-01-01',
          nextDueAt: '2026-06-30',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    })

    expect(reminders).toContainEqual({
      dueDate: '2026-06-30',
      patientId: patient.id,
      tone: 'danger',
      type: 'hygiene-due',
    })

    vi.useRealTimers()
  })

  it('returns missing next action reminder when orthodontic case has no next action', () => {
    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [{ patientId: patient.id, updatedAt: '2026-06-01T00:00:00.000Z' }],
      visits: [],
      hygieneRecords: [],
    })

    expect(reminders).toContainEqual({
      patientId: patient.id,
      tone: 'neutral',
      type: 'missing-next-action',
    })
  })

  it('returns overdue appointment reminder when next appointment is in the past', () => {
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [
        {
          patientId: patient.id,
          nextPlannedAction: 'Активация',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      visits: [
        {
          id: 'visit-1',
          patientId: patient.id,
          visitDate: '2026-06-01',
          nextAppointmentDate: '2026-06-30',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      hygieneRecords: [],
    })

    expect(reminders).toContainEqual({
      dueDate: '2026-06-30',
      patientId: patient.id,
      tone: 'danger',
      type: 'appointment-overdue',
    })

    vi.useRealTimers()
  })

  it('returns missing next appointment when patient has no scheduling data', () => {
    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [
        {
          patientId: patient.id,
          nextPlannedAction: 'Контроль',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      visits: [],
      hygieneRecords: [],
    })

    expect(reminders).toEqual([
      {
        patientId: patient.id,
        tone: 'warning',
        type: 'missing-next-appointment',
      },
    ])
  })
})
