import type { TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './Textarea.module.css'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label: string
}

export function Textarea({ className, error, id, label, ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <label className={styles.field} htmlFor={textareaId}>
      <span className={styles.label}>{label}</span>
      <textarea className={clsx(styles.textarea, error && styles.invalid, className)} id={textareaId} {...props} />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
