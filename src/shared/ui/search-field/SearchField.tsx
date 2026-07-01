import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import styles from './SearchField.module.css'

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function SearchField({ label, ...props }: SearchFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.control}>
        <Search size={18} />
        <input type="search" {...props} />
      </span>
    </label>
  )
}
