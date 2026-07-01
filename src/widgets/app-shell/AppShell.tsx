import { Outlet } from 'react-router-dom'
import { BottomNavigation } from '@/widgets/bottom-navigation/BottomNavigation'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
