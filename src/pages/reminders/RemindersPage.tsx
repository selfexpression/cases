import { readStorage } from '@/shared/storage/app-store'
import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { useReminders } from '@/entities/reminder/use-reminders'
import { RemindersSummary } from '@/widgets/reminders-summary/RemindersSummary'
import styles from './RemindersPage.module.css'

export function RemindersPage() {
  const storageVersion = useStorageVersion()
  const reminders = useReminders()
  const storage = readStorage()
  void storageVersion

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>Контроль сроков</span>
        <h1>Напоминания</h1>
      </header>

      <RemindersSummary
        clinics={storage.clinics}
        initialClinicId={storage.settings.activeClinicId}
        patients={storage.patients}
        reminders={reminders}
      />
    </div>
  )
}
