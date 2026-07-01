import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import styles from './Badge.module.css'

type BadgeProps = PropsWithChildren<{
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent'
}>

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[tone])}>{children}</span>
}
