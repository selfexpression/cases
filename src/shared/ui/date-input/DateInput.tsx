import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatHumanDate, toISODate } from '@/shared/lib/date/date'
import styles from './DateInput.module.css'

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  error?: string
  label: string
}

function parseDate(value?: string | number | readonly string[]) {
  if (typeof value !== 'string' || !value) {
    return undefined
  }

  const parsedDate = parseISO(value)

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate
}

function formatDateMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return [day, month, year].filter(Boolean).join('.')
}

function isoToMaskedDate(value: string) {
  const parsedDate = parseDate(value)
  return parsedDate ? formatHumanDate(value) : ''
}

function maskedDateToISO(value: string) {
  const [day, month, year] = value.split('.')

  if (day?.length !== 2 || month?.length !== 2 || year?.length !== 4) {
    return ''
  }

  const isoValue = `${year}-${month}-${day}`
  const parsedDate = parseDate(isoValue)

  if (!parsedDate || toISODate(parsedDate) !== isoValue) {
    return ''
  }

  return isoValue
}

export function DateInput({ error, id, label, name, onBlur, onChange, value, ...props }: DateInputProps) {
  const rootRef = useRef<HTMLLabelElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const inputId = id ?? name
  const stringValue = typeof value === 'string' ? value : ''
  const selectedDate = useMemo(() => parseDate(stringValue), [stringValue])
  const [maskedValue, setMaskedValue] = useState(() => isoToMaskedDate(stringValue))
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(selectedDate ?? new Date())

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate)
    }
  }, [selectedDate])

  useEffect(() => {
    setMaskedValue(isoToMaskedDate(stringValue))
  }, [stringValue])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node

      if (!rootRef.current?.contains(target) && !calendarRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth)
    const monthEnd = endOfMonth(visibleMonth)

    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    })
  }, [visibleMonth])

  const emitChange = (nextValue: string) => {
    onChange?.({
      target: { name, value: nextValue },
      currentTarget: { name, value: nextValue },
    } as ChangeEvent<HTMLInputElement>)
  }

  const emitBlur = () => {
    onBlur?.({
      target: { name, value: stringValue },
      currentTarget: { name, value: stringValue },
    } as FocusEvent<HTMLInputElement>)
  }

  const selectDate = (date: Date) => {
    const nextValue = toISODate(date)
    setMaskedValue(formatHumanDate(nextValue))
    emitChange(nextValue)
    setIsOpen(false)
  }

  const clearDate = () => {
    setMaskedValue('')
    emitChange('')
    setIsOpen(false)
  }

  const updateMaskedValue = (nextValue: string) => {
    const formattedValue = formatDateMask(nextValue)
    setMaskedValue(formattedValue)

    if (formattedValue.length === 10) {
      emitChange(maskedDateToISO(formattedValue))
    }

    if (!formattedValue) {
      emitChange('')
    }
  }

  const calendar = isOpen ? (
    <div className={styles.backdrop} onPointerDown={() => setIsOpen(false)} role="presentation">
      <div className={styles.calendar} onPointerDown={(event) => event.stopPropagation()} ref={calendarRef}>
        <header className={styles.calendarHeader}>
          <button aria-label="Предыдущий месяц" onClick={() => setVisibleMonth((date) => subMonths(date, 1))} type="button">
            <ChevronLeft size={18} />
          </button>
          <strong>
            {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </strong>
          <button aria-label="Следующий месяц" onClick={() => setVisibleMonth((date) => addMonths(date, 1))} type="button">
            <ChevronRight size={18} />
          </button>
        </header>

        <div className={styles.weekDays}>
          {weekDays.map((weekDay) => (
            <span key={weekDay}>{weekDay}</span>
          ))}
        </div>

        <div className={styles.days}>
          {calendarDays.map((date) => {
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
            const isToday = isSameDay(date, new Date())
            const isMuted = !isSameMonth(date, visibleMonth)

            return (
              <button
                className={isSelected ? styles.selectedDay : isToday ? styles.today : isMuted ? styles.mutedDay : styles.day}
                key={date.toISOString()}
                onClick={() => selectDate(date)}
                type="button"
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>

        <footer className={styles.calendarFooter}>
          <button onClick={clearDate} type="button">
            <X size={16} />
            Очистить
          </button>
          <button onClick={() => selectDate(new Date())} type="button">
            Сегодня
          </button>
        </footer>
      </div>
    </div>
  ) : null

  return (
    <label className={styles.field} htmlFor={inputId} ref={rootRef}>
      <span className={styles.label}>{label}</span>
      <span className={error ? styles.invalidControl : styles.control}>
        <input
          id={inputId}
          inputMode="numeric"
          onBlur={emitBlur}
          onChange={(event) => updateMaskedValue(event.target.value)}
          placeholder="дд.мм.гггг"
          value={maskedValue}
        />
        <button
          aria-expanded={isOpen}
          aria-label="Открыть календарь"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          type="button"
        >
          <CalendarDays size={20} />
        </button>
      </span>
      <input name={name} type="hidden" value={stringValue} {...props} />
      {error ? <span className={styles.error}>{error}</span> : null}
      {calendar ? createPortal(calendar, document.body) : null}
    </label>
  )
}
