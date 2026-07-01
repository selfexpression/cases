import { addDays, addWeeks, differenceInCalendarDays, format, isBefore, isToday, parseISO, startOfToday, subWeeks } from 'date-fns'

export function toISODate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(dateISO: string, days: number) {
  return toISODate(addDays(parseISO(dateISO), days))
}

export function addWeeksISO(dateISO: string, weeks: number) {
  return toISODate(addWeeks(parseISO(dateISO), weeks))
}

export function subtractWeeksISO(dateISO: string, weeks: number) {
  return toISODate(subWeeks(parseISO(dateISO), weeks))
}

export function formatHumanDate(dateISO: string) {
  return format(parseISO(dateISO), 'dd.MM.yyyy')
}

export function getDaysUntil(dateISO: string) {
  return differenceInCalendarDays(parseISO(dateISO), startOfToday())
}

export function getDueState(dateISO: string) {
  const date = parseISO(dateISO)

  if (isToday(date)) {
    return 'today'
  }

  if (isBefore(date, startOfToday())) {
    return 'overdue'
  }

  if (getDaysUntil(dateISO) <= 14) {
    return 'soon'
  }

  return 'planned'
}
