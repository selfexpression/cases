import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RemindersSummary } from './RemindersSummary'
import type { Reminder } from '@/entities/reminder/types'

const clinics = [
  { id: 'a', name: 'Клиника Север', createdAt: '', updatedAt: '' },
  { id: 'b', name: 'Клиника Центр', createdAt: '', updatedAt: '' },
  { id: 'empty', name: 'Пустая клиника', createdAt: '', updatedAt: '' },
]
const patients = [
  { id: 'p1', clinicId: 'a', fullName: 'Пациент Север', createdAt: '', updatedAt: '' },
  { id: 'p2', clinicId: 'b', fullName: 'Пациент Центр', createdAt: '', updatedAt: '' },
]
const reminders: Reminder[] = [
  { type: 'appointment-overdue', patientId: 'p1', dueDate: '2026-01-01', tone: 'danger' },
  { type: 'hygiene-due', patientId: 'p1', dueDate: '2026-01-01', tone: 'danger' },
  { type: 'missing-next-appointment', patientId: 'p2', tone: 'warning' },
  { type: 'hygiene-due', patientId: 'p2', dueDate: '2026-01-01', tone: 'danger' },
]

function summary(props: { initialClinicId?: string; clinics?: typeof clinics; reminders?: Reminder[] } = {}) {
  return <MemoryRouter><RemindersSummary clinics={clinics} patients={patients} reminders={reminders} {...props} /></MemoryRouter>
}

describe('clinic reminder tabs', () => {
  it('selects the active clinic initially and displays only its reminders', () => {
    render(summary({ initialClinicId: 'b' }))
    expect(screen.getByRole('tab', { name: /Клиника Центр/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Пациент Центр')).toBeInTheDocument()
    expect(screen.queryByText('Пациент Север')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName(/Клиника Центр/)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('switches clinics, keeping date groups and a separate hygiene disclosure', async () => {
    const user = userEvent.setup()
    render(summary({ initialClinicId: 'a' }))
    const north = screen.getByRole('tab', { name: /Клиника Север/ })
    const center = screen.getByRole('tab', { name: /Клиника Центр/ })
    expect(within(north).getByLabelText('Напоминаний: 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Просрочено', level: 2 })).toBeInTheDocument()
    expect(screen.queryByText('Пора на профгигиену')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Профгигиена · 1' }))
    expect(screen.getByText('Пора на профгигиену')).toBeInTheDocument()
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/patients/p1')
    await user.click(center)
    expect(center).toHaveAttribute('aria-selected', 'true')
    expect(north).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Пациент Центр')).toBeInTheDocument()
    expect(screen.queryByText('Пациент Север')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Без следующей записи' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Профгигиена · 1' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows a zero-count tab and an empty state for a clinic without reminders', async () => {
    const user = userEvent.setup()
    render(summary())
    const empty = screen.getByRole('tab', { name: /Пустая клиника/ })
    expect(within(empty).getByLabelText('Напоминаний: 0')).toBeInTheDocument()
    await user.click(empty)
    expect(screen.getByRole('heading', { name: 'Актуальных напоминаний нет' })).toBeInTheDocument()
    expect(screen.queryByText('Пациент Север')).not.toBeInTheDocument()
    expect(screen.queryByText('Пациент Центр')).not.toBeInTheDocument()
  })

  it('supports arrow keys, Home and End with a single tab stop', async () => {
    const user = userEvent.setup()
    render(summary({ initialClinicId: 'a' }))
    const north = screen.getByRole('tab', { name: /Клиника Север/ })
    const center = screen.getByRole('tab', { name: /Клиника Центр/ })
    const empty = screen.getByRole('tab', { name: /Пустая клиника/ })
    await user.click(north)
    await user.keyboard('{ArrowRight}')
    expect(center).toHaveFocus()
    expect(center).toHaveAttribute('tabindex', '0')
    expect(north).toHaveAttribute('tabindex', '-1')
    await user.keyboard('{End}')
    expect(empty).toHaveFocus()
    await user.keyboard('{Home}{ArrowLeft}')
    expect(empty).toHaveFocus()
    expect(empty).toHaveAttribute('aria-selected', 'true')
  })

  it('falls back to an existing clinic if the selected one is removed', async () => {
    const user = userEvent.setup()
    const { rerender } = render(summary({ initialClinicId: 'a' }))
    await user.click(screen.getByRole('tab', { name: /Клиника Центр/ }))
    rerender(summary({ initialClinicId: 'a', clinics: [clinics[0], clinics[2]], reminders: reminders.filter((reminder) => reminder.patientId === 'p1') }))
    expect(screen.getByRole('tab', { name: /Клиника Север/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Пациент Север')).toBeInTheDocument()
  })

  it('keeps all clinic tabs when no clinic has reminders', () => {
    render(summary({ reminders: [] }))
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Актуальных напоминаний нет' })).toBeInTheDocument()
  })

  it('keeps reminders visible for a patient whose clinic is missing', () => {
    render(summary({ clinics: [] }))
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByText('Пациент Север')).toBeInTheDocument()
  })
})
