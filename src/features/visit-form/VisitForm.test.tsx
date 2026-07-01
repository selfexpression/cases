import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { VisitForm } from './VisitForm'

describe('VisitForm', () => {
  it('submits visit draft', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<VisitForm onSubmit={onSubmit} />)

    await user.clear(screen.getByLabelText('Дата визита'))
    await user.type(screen.getByLabelText('Дата визита'), '2026-07-01')
    await user.type(screen.getByLabelText('Что сделали'), 'Активация дуги')
    await user.type(screen.getByLabelText('Если не записался, через недель'), '4')
    await user.click(screen.getByRole('button', { name: 'Добавить визит' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        visitDate: '2026-07-01',
        summary: 'Активация дуги',
        shouldReturnInWeeks: 4,
      }),
    )
  })
})
