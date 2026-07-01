import { Link } from 'react-router-dom'
import { formatHumanDate } from '@/shared/lib/date/date'
import { Badge } from '@/shared/ui/badge/Badge'
import { getReminderTitle } from '@/entities/reminder/reminder-labels'
import { groupReminders } from '@/entities/reminder/group-reminders'
import type { Reminder } from '@/entities/reminder/types'
import type { Patient } from '@/entities/patient/types'
import styles from './RemindersSummary.module.css'

type RemindersSummaryProps = {
  patients: Patient[]
  reminders: Reminder[]
}

export function RemindersSummary({ patients, reminders }: RemindersSummaryProps) {
  const patientsById = new Map(patients.map((patient) => [patient.id, patient]))
  const groups = groupReminders(reminders)

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section className={styles.group} key={group.id}>
          <h2>{group.title}</h2>
          <div className={styles.list}>
            {group.reminders.map((reminder, index) => {
              const patient = patientsById.get(reminder.patientId)

              if (!patient) {
                return null
              }

              return (
                <Link
                  className={styles.item}
                  key={`${reminder.patientId}-${reminder.type}-${index}`}
                  to={`/patients/${patient.id}`}
                >
                  <div>
                    <h3>{patient.fullName}</h3>
                    <p>{getReminderTitle(reminder)}</p>
                  </div>
                  <Badge tone={reminder.tone}>{'dueDate' in reminder ? formatHumanDate(reminder.dueDate) : 'Проверить'}</Badge>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
