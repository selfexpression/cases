import { describe, expect, it, vi } from 'vitest'
import { calculateReminders } from './calculate-reminders'

const patient = {
  id: 'patient-1',
  clinicId: 'clinic-1',
  fullName: 'Иван Иванов',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

const secondPatient = {
  id: 'patient-2',
  clinicId: 'clinic-2',
  fullName: 'Пётр Иванов',
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
          nextDueInMonths: 6,
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

  it('does not return reminders for missing next planned action', () => {
    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [{ patientId: patient.id, updatedAt: '2026-06-01T00:00:00.000Z' }],
      visits: [
        {
          id: 'visit-1',
          patientId: patient.id,
          visitDate: '2026-06-01',
          nextAppointmentDate: '2026-07-10',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      hygieneRecords: [],
    })

    expect(reminders).toEqual([
      {
        dueDate: '2026-07-10',
        patientId: patient.id,
        tone: 'neutral',
        type: 'appointment-upcoming',
      },
    ])
  })

  it('does not duplicate a new patient without appointment and next action', () => {
    const reminders = calculateReminders({
      patients: [patient],
      orthodonticCases: [{ patientId: patient.id, updatedAt: '2026-06-01T00:00:00.000Z' }],
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

  it('sorts dated reminders by closest date first and missing dates last', () => {
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const reminders = calculateReminders({
      patients: [
        patient,
        secondPatient,
        {
          ...patient,
          id: 'patient-3',
          fullName: 'Мария Кузьмина',
        },
      ],
      orthodonticCases: [],
      visits: [
        {
          id: 'visit-1',
          patientId: patient.id,
          visitDate: '2026-06-01',
          nextAppointmentDate: '2026-06-20',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
        {
          id: 'visit-2',
          patientId: secondPatient.id,
          visitDate: '2026-06-01',
          nextAppointmentDate: '2026-06-30',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ],
      hygieneRecords: [],
    })

    expect(reminders.map((reminder) => ('dueDate' in reminder ? reminder.dueDate : 'no-date'))).toEqual([
      '2026-06-30',
      '2026-06-20',
      'no-date',
    ])

    vi.useRealTimers()
  })
})
