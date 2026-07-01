import { Bell } from 'lucide-react'
import { readStorage } from '@/shared/storage/app-store'
import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
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

      {reminders.length ? (
        <RemindersSummary patients={storage.patients} reminders={reminders} />
      ) : (
        <EmptyState
          description="Нет просроченных возвратов, записей на сегодня или подошедшей профгигиены."
          title="Всё спокойно"
        />
      )}

      <section className={styles.note}>
        <Bell size={18} />
        <p>На этом этапе напоминания показываются внутри приложения при открытии.</p>
      </section>
    </div>
  )
}
