import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export function Button({ children, className, icon, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} type="button" {...props}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
