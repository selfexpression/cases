export type ReminderTone = 'danger' | 'warning' | 'accent' | 'neutral'

export type Reminder =
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'return-due'
    }
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'return-upcoming'
    }
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'appointment-overdue'
    }
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'appointment-today'
    }
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'appointment-upcoming'
    }
  | {
      dueDate: string
      patientId: string
      tone: ReminderTone
      type: 'hygiene-due'
    }
  | {
      patientId: string
      tone: ReminderTone
      type: 'missing-next-appointment'
    }
  | {
      patientId: string
      tone: ReminderTone
      type: 'missing-next-action'
    }
