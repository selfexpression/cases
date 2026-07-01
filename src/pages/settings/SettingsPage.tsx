import { DataTransferPanel } from '@/features/data-transfer/DataTransferPanel'
import { ClinicManagementPanel } from '@/features/clinic-management/ClinicManagementPanel'
import { ReminderSettingsForm } from '@/features/reminder-settings/ReminderSettingsForm'
import { ThemeSwitcher } from '@/features/theme-switcher/ThemeSwitcher'
import { Disclosure } from '@/shared/ui/disclosure/Disclosure'
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
        <h2>Клиники</h2>
        <ClinicManagementPanel />
      </section>

      <Disclosure title="Данные">
        <DataTransferPanel />
      </Disclosure>
    </div>
  )
}
