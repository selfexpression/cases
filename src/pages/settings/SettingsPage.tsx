import { DataTransferPanel } from '@/features/data-transfer/DataTransferPanel'
import { ReminderSettingsForm } from '@/features/reminder-settings/ReminderSettingsForm'
import { ThemeSwitcher } from '@/features/theme-switcher/ThemeSwitcher'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>Приложение</span>
        <h1>Настройки</h1>
      </header>

      <section className={styles.section}>
        <h2>Внешний вид</h2>
        <ThemeSwitcher />
      </section>

      <section className={styles.section}>
        <h2>Напоминания</h2>
        <ReminderSettingsForm />
      </section>

      <section className={styles.section}>
        <h2>Данные</h2>
        <DataTransferPanel />
      </section>
    </div>
  )
}
