import { useState } from 'react'
import { Save, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button/Button'
import { DateInput } from '@/shared/ui/date-input/DateInput'
import { NumberInput } from '@/shared/ui/number-input/NumberInput'
import { addMonthsISO, formatHumanDate, todayISO } from '@/shared/lib/date/date'
import type { HygieneDraft } from '@/entities/hygiene/hygiene-repository'
import styles from './HygieneForm.module.css'

type HygieneFormProps = {
  initialDraft?: HygieneDraft
  onCancel?: () => void
  onSubmit: (draft: HygieneDraft) => void
  submitLabel?: string
}

export function HygieneForm({ initialDraft, onCancel, onSubmit, submitLabel = 'Отметить' }: HygieneFormProps) {
  const [externalUnknownDate, setExternalUnknownDate] = useState(Boolean(initialDraft?.externalUnknownDate))
  const [completedAt, setCompletedAt] = useState(initialDraft?.completedAt ?? todayISO())
  const [nextDueInMonths, setNextDueInMonths] = useState(initialDraft?.nextDueInMonths?.toString() ?? '')
  const calculatedNextDueAt = !externalUnknownDate && nextDueInMonths ? addMonthsISO(completedAt, Number(nextDueInMonths)) : undefined

  return (
    <div className={styles.form}>
      <label className={styles.checkbox}>
        <input
          checked={externalUnknownDate}
          onChange={(event) => setExternalUnknownDate(event.target.checked)}
          type="checkbox"
        />
        <span>Гигиена выполнена в другой клинике, дата неизвестна</span>
      </label>

      {!externalUnknownDate ? (
        <>
          <DateInput
            label="Дата профгигиены"
            onChange={(event) => setCompletedAt(event.target.value)}
            value={completedAt}
          />
          <NumberInput
            label="Следующая профгигиена, через месяцев"
            min={1}
            onValueChange={setNextDueInMonths}
            value={nextDueInMonths}
          />
        </>
      ) : null}

      {calculatedNextDueAt ? <p className={styles.hint}>Дата напоминания: {formatHumanDate(calculatedNextDueAt)}</p> : null}
      <div className={styles.actions}>
        {onCancel ? (
          <Button onClick={onCancel} variant="ghost">
            Отмена
          </Button>
        ) : null}
        <Button
          icon={initialDraft ? <Save size={18} /> : <Sparkles size={18} />}
          onClick={() =>
            onSubmit({
              completedAt: externalUnknownDate ? undefined : completedAt,
              externalUnknownDate,
              nextDueInMonths: !externalUnknownDate && nextDueInMonths ? Number(nextDueInMonths) : undefined,
            })
          }
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
