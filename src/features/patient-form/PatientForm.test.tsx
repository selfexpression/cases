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
    await user.type(screen.getByLabelText('Аппарат'), 'Брекеты')
    await user.click(screen.getByRole('button', { name: 'Создать' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Анна Смирнова',
        diagnosis: 'Скученность',
        appliance: 'Брекеты',
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
          appliance: 'Пластинка',
          patientId: 'patient-1',
          treatmentPlan: 'Элайнеры',
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

    await user.clear(screen.getByLabelText('Аппарат'))
    await user.type(screen.getByLabelText('Аппарат'), 'Брекеты')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Анна Смирнова',
        appliance: 'Брекеты',
      }),
    )
  })
  it('submits the local date and allows clearing an existing installation date', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PatientForm initialPatient={{ id: 'p', clinicId: 'c', fullName: 'Тестовый пациент', createdAt: '', updatedAt: '' }} initialCase={{ patientId: 'p', bracesInstalledAt: '2026-01-31', updatedAt: '' }} onSubmit={onSubmit} submitLabel="Сохранить" />)
    expect(screen.getByLabelText(/Дата установки брекетов/)).toHaveValue('31.01.2026')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ bracesInstalledAt: '2026-01-31' }))
    await user.clear(screen.getByLabelText(/Дата установки брекетов/))
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ bracesInstalledAt: '' }))
  })

  it('rejects a future installation date', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PatientForm onSubmit={onSubmit} submitLabel="Создать" />)
    await user.type(screen.getByLabelText('ФИО'), 'Тестовый пациент')
    await user.type(screen.getByLabelText(/Дата установки брекетов/), '01.01.2099')
    await user.click(screen.getByRole('button', { name: 'Создать' }))
    expect(screen.getByRole('alert')).toHaveTextContent('не может быть в будущем')
    expect(onSubmit).not.toHaveBeenCalled()
  })

})
