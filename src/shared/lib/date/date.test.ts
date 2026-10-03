import { afterEach, describe, expect, it, vi } from 'vitest'
import { getFullMonthsSince, todayISO } from './date'

describe('brace duration in full calendar months', () => {
  afterEach(() => vi.useRealTimers())

  it.each([
    ['2026-01-15', '2026-02-14', 0],
    ['2026-01-15', '2026-02-15', 1],
    ['2026-01-31', '2026-02-28', 1],
    ['2024-01-31', '2024-02-29', 1],
    ['2025-12-31', '2026-01-31', 1],
    ['2025-03-01', '2026-03-01', 12],
    ['2026-03-01', '2026-02-01', 0],
  ])('%s to %s gives %s months', (start, end, months) => {
    expect(getFullMonthsSince(start, end)).toBe(months)
  })

  it('uses the local calendar day near midnight', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 1, 0, 5))
    expect(todayISO()).toBe('2026-03-01')
    expect(getFullMonthsSince('2026-02-01')).toBe(1)
  })
})
