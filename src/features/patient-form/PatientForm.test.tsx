import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PatientForm } from './PatientForm'

describe('PatientForm', () => {
  it('submits patient and orthodontic fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<PatientForm onSubmit={onSubmit} submitLabel="Создать" />)

    await user.type(screen.getByLabelText('ФИО'), 'Анна Смирнова')
    await user.type(screen.getByLabelText('Диагноз'), 'Скученность')
    await user.type(screen.getByLabelText('Следующее действие'), 'Смена дуги')
    await user.click(screen.getByRole('button', { name: 'Создать' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Анна Смирнова',
        diagnosis: 'Скученность',
        nextPlannedAction: 'Смена дуги',
      }),
    )
  })
})
