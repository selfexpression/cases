import type { Reminder } from './types'

export type ReminderGroupId = 'overdue' | 'today' | 'soon' | 'missing'

export type ReminderGroup = {
  id: ReminderGroupId
  reminders: Reminder[]
  title: string
}

function getGroupId(reminder: Reminder): ReminderGroupId {
  switch (reminder.type) {
    case 'appointment-overdue':
    case 'return-due':
    case 'hygiene-due':
      return reminder.tone === 'danger' ? 'overdue' : 'today'
    case 'appointment-today':
      return 'today'
    case 'return-upcoming':
    case 'appointment-upcoming':
      return 'soon'
    case 'missing-next-appointment':
      return 'missing'
  }
}

export function groupReminders(reminders: Reminder[]): ReminderGroup[] {
  const groups: ReminderGroup[] = [
    { id: 'overdue', title: 'Просрочено', reminders: [] },
    { id: 'today', title: 'Сегодня', reminders: [] },
    { id: 'soon', title: 'Скоро', reminders: [] },
    { id: 'missing', title: 'Без следующей записи', reminders: [] },
  ]

  for (const reminder of reminders) {
    groups.find((group) => group.id === getGroupId(reminder))?.reminders.push(reminder)
  }

  return groups.filter((group) => group.reminders.length > 0)
}
