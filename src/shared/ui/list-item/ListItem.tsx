import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './ListItem.module.css'

type ListItemProps = {
  after?: ReactNode
  before?: ReactNode
  children: ReactNode
  className?: string
}

export function ListItem({ after, before, children, className }: ListItemProps) {
  return (
    <div className={clsx(styles.item, className)}>
      {before ? <div className={styles.before}>{before}</div> : null}
      <div className={styles.content}>{children}</div>
      {after ? <div className={styles.after}>{after}</div> : null}
    </div>
  )
}
