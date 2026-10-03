import { describe, expect, it } from 'vitest'
import { groupRemindersByClinic } from './group-reminders-by-clinic'
import type { Reminder } from './types'

const clinics = [
  { id: 'a', name: 'Клиника Север', createdAt: '', updatedAt: '' },
  { id: 'b', name: 'Клиника Центр', createdAt: '', updatedAt: '' },
  { id: 'empty', name: 'Без напоминаний', createdAt: '', updatedAt: '' },
]
const patients = [
  { id: 'p1', clinicId: 'a', fullName: 'Тест Север', createdAt: '', updatedAt: '' },
  { id: 'p2', clinicId: 'b', fullName: 'Тест Центр', createdAt: '', updatedAt: '' },
]
const reminders: Reminder[] = [
  { patientId: 'p2', type: 'appointment-today', tone: 'accent', dueDate: '2026-10-03' },
  { patientId: 'p1', type: 'hygiene-due', tone: 'danger', dueDate: '2026-01-01' },
  { patientId: 'p1', type: 'appointment-overdue', tone: 'danger', dueDate: '2026-10-02' },
]

describe('groupRemindersByClinic', () => {
  it('separates clinics and keeps date categories and hygiene within each clinic', () => {
    const groups = groupRemindersByClinic({ clinics, patients, reminders })
    expect(groups).toEqual([
      {
        clinicId: 'a', title: 'Клиника Север', count: 2,
        groups: [
          { id: 'overdue', title: 'Просрочено', reminders: [reminders[2]] },
          { id: 'hygiene', title: 'Профгигиена', reminders: [reminders[1]] },
        ],
      },
      {
        clinicId: 'b', title: 'Клиника Центр', count: 1,
        groups: [{ id: 'today', title: 'Сегодня', reminders: [reminders[0]] }],
      },
    ])
  })

  it('keeps clinics with identical names separate by their ids', () => {
    const groups = groupRemindersByClinic({ clinics: clinics.map((clinic) => ({ ...clinic, name: 'Одинаковое название' })), patients, reminders })
    expect(groups.map((group) => group.clinicId).sort()).toEqual(['a', 'b'])
    expect(groups.map((group) => group.count).sort()).toEqual([1, 2])
  })

  it('keeps reminders for a patient whose clinic is missing', () => {
    expect(groupRemindersByClinic({ clinics: [], patients: [patients[0]], reminders: [reminders[1]] })).toEqual([
      { clinicId: 'a', title: 'Клиника не найдена', count: 1, groups: [{ id: 'hygiene', title: 'Профгигиена', reminders: [reminders[1]] }] },
    ])
  })

  it('does not create empty sections or count reminders for nonexistent patients', () => {
    expect(groupRemindersByClinic({ clinics, patients: [], reminders })).toEqual([])
    expect(groupRemindersByClinic({ clinics, patients, reminders: [] })).toEqual([])
  })
})
