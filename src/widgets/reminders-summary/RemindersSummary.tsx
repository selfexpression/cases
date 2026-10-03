import { useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatHumanDate } from '@/shared/lib/date/date'
import { Disclosure } from '@/shared/ui/disclosure/Disclosure'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { Badge } from '@/shared/ui/badge/Badge'
import { getReminderActionLabel, getReminderTitle } from '@/entities/reminder/reminder-labels'
import { groupRemindersByClinic } from '@/entities/reminder/group-reminders-by-clinic'
import type { Clinic } from '@/entities/clinic/types'
import type { Reminder } from '@/entities/reminder/types'
import type { Patient } from '@/entities/patient/types'
import styles from './RemindersSummary.module.css'

type RemindersSummaryProps = {
  clinics: Clinic[]
  initialClinicId?: string
  patients: Patient[]
  reminders: Reminder[]
}

export function RemindersSummary({ clinics, initialClinicId, patients, reminders }: RemindersSummaryProps) {
  const id = useId()
  const [selectedClinicId, setSelectedClinicId] = useState(initialClinicId)
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const patientsById = new Map(patients.map((patient) => [patient.id, patient]))
  const clinicGroups = groupRemindersByClinic({ clinics, patients, reminders })

  const groupsByClinicId = new Map(clinicGroups.map((clinic) => [clinic.clinicId, clinic]))
  const knownClinicIds = new Set(clinics.map((clinic) => clinic.id))
  const tabs = [
    ...clinics.map((clinic) => groupsByClinicId.get(clinic.id) ?? {
      clinicId: clinic.id, title: clinic.name, count: 0, groups: [],
    }),
    ...clinicGroups.filter((clinic) => !knownClinicIds.has(clinic.clinicId)),
  ].sort((first, second) => first.title.localeCompare(second.title, 'ru'))
  const selected = tabs.find((clinic) => clinic.clinicId === selectedClinicId)
    ?? tabs.find((clinic) => clinic.clinicId === initialClinicId)
    ?? tabs[0]
  const selectedIndex = tabs.findIndex((clinic) => clinic.clinicId === selected?.clinicId)

  if (!selected) {
    return <EmptyState title="Актуальных напоминаний нет" description="Нет напоминаний для отображения." />
  }

  return (
    <div className={styles.clinics}>
      <div
        aria-label="Клиники"
        className={styles.tabs}
        role="tablist"
        style={{ gridTemplateColumns: `repeat(${Math.min(3, tabs.length)}, minmax(0, 1fr))` }}
      >
        {tabs.map((clinic, index) => (
          <button
            aria-controls={`${id}-panel`}
            aria-selected={clinic.clinicId === selected.clinicId}
            className={clinic.clinicId === selected.clinicId ? styles.activeTab : styles.tab}
            id={`${id}-tab-${index}`}
            key={clinic.clinicId}
            onClick={() => setSelectedClinicId(clinic.clinicId)}
            onKeyDown={(event) => {
              let nextIndex: number
              switch (event.key) {
                case 'ArrowRight': nextIndex = (index + 1) % tabs.length; break
                case 'ArrowLeft': nextIndex = (index - 1 + tabs.length) % tabs.length; break
                case 'Home': nextIndex = 0; break
                case 'End': nextIndex = tabs.length - 1; break
                default: return
              }
              event.preventDefault()
              const nextClinic = tabs[nextIndex]
              setSelectedClinicId(nextClinic.clinicId)
              tabRefs.current.get(nextClinic.clinicId)?.focus()
            }}
            ref={(element) => {
              if (element) tabRefs.current.set(clinic.clinicId, element)
              else tabRefs.current.delete(clinic.clinicId)
            }}
            role="tab"
            tabIndex={clinic.clinicId === selected.clinicId ? 0 : -1}
            type="button"
          >
            <span>{clinic.title}</span>
            <span aria-label={`Напоминаний: ${clinic.count}`} className={styles.count}>{clinic.count}</span>
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`${id}-tab-${selectedIndex}`}
        className={styles.groups}
        id={`${id}-panel`}
        key={selected.clinicId}
        role="tabpanel"
        tabIndex={0}
      >
        {selected.count ? selected.groups.map((group) => (
          <ReminderSection key={group.id} title={group.title} hygiene={group.id === 'hygiene'} count={group.reminders.length}>
            <div className={styles.list}>
              {group.reminders.map((reminder, index) => {
                const patient = patientsById.get(reminder.patientId)
                if (!patient) return null

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
                    <Badge tone={group.id === 'hygiene' ? 'neutral' : reminder.tone}>
                      {'dueDate' in reminder ? formatHumanDate(reminder.dueDate) : getReminderActionLabel(reminder)}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </ReminderSection>
        )) : (
          <EmptyState title="Актуальных напоминаний нет" description="В этой клинике нет напоминаний о приёмах, возвратах или профгигиене." />
        )}
      </div>
    </div>
  )
}

function ReminderSection({ children, count, hygiene, title }: { children: ReactNode; count: number; hygiene: boolean; title: string }) {
  return hygiene ? (
    <Disclosure title={`${title} · ${count}`}>{children}</Disclosure>
  ) : (
    <section className={styles.group}><h2>{title}</h2>{children}</section>
  )
}
