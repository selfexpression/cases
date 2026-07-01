import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label: string
}

export function Input({ className, error, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className={styles.field} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <input className={clsx(styles.input, error && styles.invalid, className)} id={inputId} {...props} />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
