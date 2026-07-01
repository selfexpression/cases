import { Minus, Plus } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './NumberInput.module.css'

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & {
  error?: string
  label: string
  onValueChange: (value: string) => void
  value: string
}

function toNumber(value: string) {
  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : 0
}

export function NumberInput({ className, error, id, label, max, min, onValueChange, step = 1, value, ...props }: NumberInputProps) {
  const inputId = id ?? props.name
  const numericStep = Number(step)
  const minValue = min === undefined ? undefined : Number(min)
  const maxValue = max === undefined ? undefined : Number(max)

  const setNextValue = (direction: 'decrement' | 'increment') => {
    const delta = direction === 'increment' ? numericStep : -numericStep
    const rawNextValue = toNumber(value) + delta
    const nextValue = Math.min(maxValue ?? rawNextValue, Math.max(minValue ?? rawNextValue, rawNextValue))
    onValueChange(String(nextValue))
  }

  return (
    <label className={styles.field} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <span className={clsx(styles.control, error && styles.invalid)}>
        <input
          className={className}
          id={inputId}
          inputMode="numeric"
          max={max}
          min={min}
          onChange={(event) => onValueChange(event.target.value)}
          step={step}
          type="text"
          value={value}
          {...props}
        />
        <span className={styles.steppers}>
          <button aria-label="Увеличить" onClick={() => setNextValue('increment')} type="button">
            <Plus size={16} />
          </button>
          <button aria-label="Уменьшить" onClick={() => setNextValue('decrement')} type="button">
            <Minus size={16} />
          </button>
        </span>
      </span>
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
