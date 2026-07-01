import type { Reminder } from './types'

export function getReminderTitle(reminder: Reminder) {
  switch (reminder.type) {
    case 'return-upcoming':
      return 'Скоро срок возврата'
    case 'appointment-overdue':
      return 'Запись просрочена'
    case 'return-due':
      return 'Нужно связаться для записи'
    case 'appointment-today':
      return 'Запись сегодня'
    case 'appointment-upcoming':
      return 'Ближайшая запись'
    case 'hygiene-due':
      return 'Пора на профгигиену'
    case 'missing-next-appointment':
      return 'Нет следующей записи'
  }
}

export function getReminderActionLabel(reminder: Reminder) {
  if ('dueDate' in reminder) {
    return undefined
  }

  switch (reminder.type) {
    case 'missing-next-appointment':
      return 'Записать'
  }
}
