import { useState } from 'react'
import { CalendarPlus, Save } from 'lucide-react'
import { Button } from '@/shared/ui/button/Button'
import { DateInput } from '@/shared/ui/date-input/DateInput'
import { Input } from '@/shared/ui/input/Input'
import { Textarea } from '@/shared/ui/textarea/Textarea'
import { todayISO } from '@/shared/lib/date/date'
import type { VisitDraft } from '@/entities/visit/visit-repository'
import styles from './VisitForm.module.css'

type VisitFormProps = {
  initialDraft?: VisitDraft
  onCancel?: () => void
  onSubmit: (draft: VisitDraft) => void
  submitLabel?: string
}

export function VisitForm({ initialDraft, onCancel, onSubmit, submitLabel = 'Добавить визит' }: VisitFormProps) {
  const [visitDate, setVisitDate] = useState(initialDraft?.visitDate ?? todayISO())
  const [summary, setSummary] = useState(initialDraft?.summary ?? '')
  const [nextAppointmentDate, setNextAppointmentDate] = useState(initialDraft?.nextAppointmentDate ?? '')
  const [shouldReturnInWeeks, setShouldReturnInWeeks] = useState(initialDraft?.shouldReturnInWeeks?.toString() ?? '')
  const [error, setError] = useState<string>()

  const submit = () => {
    const returnInWeeks = shouldReturnInWeeks ? Number(shouldReturnInWeeks) : undefined

    if (!visitDate) {
      setError('Укажите дату визита')
      return
    }

    if (returnInWeeks && returnInWeeks <= 0) {
      setError('Срок возврата должен быть больше нуля')
      return
    }

    onSubmit({
      visitDate,
      summary,
      nextAppointmentDate: nextAppointmentDate || undefined,
      shouldReturnInWeeks: returnInWeeks,
    })
  }

  return (
    <div className={styles.form}>
      <DateInput label="Дата визита" onChange={(event) => setVisitDate(event.target.value)} value={visitDate} />
      <Textarea label="Что сделали" onChange={(event) => setSummary(event.target.value)} value={summary} />
      <div className={styles.grid}>
        <DateInput
          label="Следующая запись"
          onChange={(event) => setNextAppointmentDate(event.target.value)}
          value={nextAppointmentDate}
        />
        <Input
          label="Если не записался, через недель"
          min={1}
          onChange={(event) => setShouldReturnInWeeks(event.target.value)}
          type="number"
          value={shouldReturnInWeeks}
        />
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.actions}>
        {onCancel ? (
          <Button onClick={onCancel} variant="ghost">
            Отмена
          </Button>
        ) : null}
        <Button icon={initialDraft ? <Save size={18} /> : <CalendarPlus size={18} />} onClick={submit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
