import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientEditPage } from './PatientEditPage'
import { PatientDetailsPage } from '@/pages/patient-details/PatientDetailsPage'
import { PatientsListPage } from '@/pages/patients-list/PatientsListPage'
import { writeStorage } from '@/shared/storage/app-store'
import { defaultStorage } from '@/shared/storage/default-storage'
import { indexedDbAdapter } from '@/shared/storage/indexed-db-adapter'
import { installTestLocalStorage } from '@/shared/storage/test-storage'

const patient = { id: 'p', clinicId: 'default-clinic', fullName: 'Тестовый пациент', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }

function renderFlow() {
  const router = createMemoryRouter([
    { path: '/', element: <PatientsListPage /> },
    { path: '/patients/:patientId', element: <PatientDetailsPage /> },
    { path: '/patients/:patientId/edit', element: <PatientEditPage /> },
  ], { initialEntries: ['/', '/patients/p', '/patients/p/edit'] })
  render(<RouterProvider router={router} />)
  return router
}

describe('patient edit navigation', () => {
  beforeEach(async () => {
    installTestLocalStorage()
    await writeStorage({ ...structuredClone(defaultStorage), patients: [patient] })
  })

  it('waits for persistence then saves and returns to the list with the card back arrow', async () => {
    const user = userEvent.setup()
    const router = renderFlow()
    let finish!: () => void
    const write = vi.spyOn(indexedDbAdapter, 'write').mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve }))
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(router.state.location.pathname).toBe('/patients/p/edit')
    expect(screen.getByRole('button', { name: 'Сохранение…' })).toBeDisabled()
    await act(async () => finish())
    await waitFor(() => expect(router.state.location.pathname).toBe('/patients/p'))
    write.mockRestore()
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'Пациенты' })).toBeInTheDocument()
    // Browser history also no longer contains the submitted edit route.
    await act(async () => router.navigate(-1))
    expect(router.state.location.pathname).toBe('/patients/p')
  })

  it('keeps the editor and draft on a database error', async () => {
    const user = userEvent.setup()
    const router = renderFlow()
    const write = vi.spyOn(indexedDbAdapter, 'write').mockRejectedValueOnce(new Error('Quota exceeded'))
    await user.clear(screen.getByLabelText('ФИО'))
    await user.type(screen.getByLabelText('ФИО'), 'Изменённый тест')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось сохранить')
    expect(router.state.location.pathname).toBe('/patients/p/edit')
    expect(screen.getByLabelText('ФИО')).toHaveValue('Изменённый тест')
    write.mockRestore()
  })
})
