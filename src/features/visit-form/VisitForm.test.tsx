import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VisitForm } from './VisitForm'

describe('VisitForm', () => {
  it('submits visit draft', async () => {
    const onSubmit = vi.fn()

    render(<VisitForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Что сделали'), { target: { value: 'Активация дуги' } })
    fireEvent.change(screen.getByLabelText('Если не записался, через недель'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Добавить визит' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        summary: 'Активация дуги',
        shouldReturnInWeeks: 4,
      }),
    )
  })
})
