import { ChevronDown, Check } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import styles from './Select.module.css'

type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  label: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  value: string
}

export function Select({ label, onValueChange, options, value }: SelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)

    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  const selectOption = (option: SelectOption) => {
    onValueChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={styles.field} ref={rootRef}>
      <span className={styles.label}>{label}</span>
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        className={styles.trigger}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false)
          }
        }}
        type="button"
      >
        <span>{selectedOption?.label ?? 'Выбрать'}</span>
        <ChevronDown className={isOpen ? styles.openIcon : styles.icon} size={20} />
      </button>

      {isOpen ? (
        <div className={styles.options} id={listboxId} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                aria-selected={isSelected}
                className={isSelected ? styles.selectedOption : styles.option}
                key={option.value}
                onClick={() => selectOption(option)}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                {isSelected ? <Check size={18} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
