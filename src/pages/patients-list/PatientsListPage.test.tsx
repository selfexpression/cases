import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { PatientsListPage } from './PatientsListPage'
import { defaultStorage } from '@/shared/storage/default-storage'
import { writeStorage } from '@/shared/storage/app-store'
import { installTestLocalStorage } from '@/shared/storage/test-storage'

const base = { clinicId: 'default-clinic', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }

describe('patient archive list', () => {
  beforeEach(async () => {
    installTestLocalStorage()
    await writeStorage({ ...structuredClone(defaultStorage), patients: [
      { ...base, id: 'a', fullName: 'Активный тест' },
      { ...base, id: 'b', fullName: 'Архивный тест', archivedAt: '2026-07-01T00:00:00.000Z' },
      { ...base, id: 'c', clinicId: 'other-clinic', fullName: 'Другая клиника', archivedAt: '2026-07-01T00:00:00.000Z' },
    ] })
  })

  it('switches between active and archived patients within the current clinic', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PatientsListPage /></MemoryRouter>)
    expect(screen.getByText('Активный тест')).toBeInTheDocument()
    expect(screen.queryByText('Архивный тест')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Архив' }))
    expect(screen.getByText('Архивный тест')).toBeInTheDocument()
    expect(screen.queryByText('Активный тест')).not.toBeInTheDocument()
    expect(screen.queryByText('Другая клиника')).not.toBeInTheDocument()
    expect(screen.getByText('В архиве')).toBeInTheDocument()
    expect(screen.queryByText('Нет записи')).not.toBeInTheDocument()
  })

  it('reopens the archive from its URL', () => {
    render(<MemoryRouter initialEntries={['/?status=archived']}><PatientsListPage /></MemoryRouter>)
    expect(screen.getByText('Архивный тест')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Архив' })).toHaveAttribute('aria-pressed', 'true')
  })
})
