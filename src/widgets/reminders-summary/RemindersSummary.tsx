import { Link } from 'react-router-dom'
import { formatHumanDate } from '@/shared/lib/date/date'
import { Badge } from '@/shared/ui/badge/Badge'
import { getReminderActionLabel, getReminderTitle } from '@/entities/reminder/reminder-labels'
import { groupReminders } from '@/entities/reminder/group-reminders'
import type { Clinic } from '@/entities/clinic/types'
import type { Reminder } from '@/entities/reminder/types'
import type { Patient } from '@/entities/patient/types'
import styles from './RemindersSummary.module.css'

type RemindersSummaryProps = {
  clinics: Clinic[]
  patients: Patient[]
  reminders: Reminder[]
}

export function RemindersSummary({ clinics, patients, reminders }: RemindersSummaryProps) {
  const clinicsById = new Map(clinics.map((clinic) => [clinic.id, clinic]))
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
              const clinic = patient ? clinicsById.get(patient.clinicId) : undefined

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
                    {clinic ? <span className={styles.clinic}>{clinic.name}</span> : null}
                    <p>{getReminderTitle(reminder)}</p>
                  </div>
                  <Badge tone={reminder.tone}>
                    {'dueDate' in reminder ? formatHumanDate(reminder.dueDate) : getReminderActionLabel(reminder)}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
