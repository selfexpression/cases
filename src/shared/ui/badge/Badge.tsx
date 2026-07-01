import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import styles from './Badge.module.css'

type BadgeProps = PropsWithChildren<{
  compact?: boolean
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent'
}>

export function Badge({ children, compact = false, tone = 'neutral' }: BadgeProps) {
  return <span className={clsx(styles.badge, compact && styles.compact, styles[tone])}>{children}</span>
}
