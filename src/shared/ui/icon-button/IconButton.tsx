import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './IconButton.module.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  label: string
}

export function IconButton({ className, icon, label, ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className={clsx(styles.button, className)} title={label} type="button" {...props}>
      {icon}
    </button>
  )
}
