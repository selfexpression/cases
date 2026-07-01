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

  it('submits edited patient fields after changing initial values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <PatientForm
        initialCase={{
          diagnosis: 'Дистальный прикус',
          nextPlannedAction: 'Контроль',
          patientId: 'patient-1',
          treatmentPlan: 'Элайнеры',
          treatmentStage: 'Активное лечение',
          updatedAt: '2026-06-01T00:00:00.000Z',
        }}
        initialPatient={{
          clinicId: 'clinic-1',
          createdAt: '2026-06-01T00:00:00.000Z',
          fullName: 'Анна Смирнова',
          id: 'patient-1',
          updatedAt: '2026-06-01T00:00:00.000Z',
        }}
        onSubmit={onSubmit}
        submitLabel="Сохранить"
      />,
    )

    await user.clear(screen.getByLabelText('Следующее действие'))
    await user.type(screen.getByLabelText('Следующее действие'), 'Смена дуги')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Анна Смирнова',
        nextPlannedAction: 'Смена дуги',
      }),
    )
  })
})
