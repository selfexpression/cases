import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  size?: 'md' | 'sm'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export function Button({ children, className, icon, size = 'md', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[size], styles[variant], className)} type="button" {...props}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
