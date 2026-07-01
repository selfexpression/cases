import { Bell, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import styles from './BottomNavigation.module.css'

const navItems = [
  { icon: Users, label: 'Пациенты', to: '/' },
  { icon: Bell, label: 'Напоминания', to: '/reminders' },
  { icon: Settings, label: 'Настройки', to: '/settings' },
]

export function BottomNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} key={item.to} to={item.to}>
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
