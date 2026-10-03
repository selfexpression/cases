import { describe, expect, it } from 'vitest'
import { groupReminders } from './group-reminders'
import type { Reminder } from './types'

describe('groupReminders', () => {
  it('keeps hygiene separate and after every appointment group', () => {
    const hygiene: Reminder = { patientId: 'p', type: 'hygiene-due', dueDate: '2026-01-01', tone: 'danger' }
    const appointment: Reminder = { patientId: 'p', type: 'appointment-overdue', dueDate: '2026-01-01', tone: 'danger' }
    const missing: Reminder = { patientId: 'q', type: 'missing-next-appointment', tone: 'warning' }
    expect(groupReminders([hygiene, appointment, missing])).toEqual([
      { id: 'overdue', title: 'Просрочено', reminders: [appointment] },
      { id: 'missing', title: 'Без следующей записи', reminders: [missing] },
      { id: 'hygiene', title: 'Профгигиена', reminders: [hygiene] },
    ])
  })

  it('keeps every reminder in a large collection', () => {
    const reminders: Reminder[] = Array.from({ length: 40 }, (_, i) => ({ patientId: String(i), type: 'missing-next-appointment', tone: 'warning' }))
    expect(groupReminders(reminders).flatMap((group) => group.reminders)).toEqual(reminders)
  })
})
