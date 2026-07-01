import { useState } from 'react'
import { Save, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button/Button'
import { DateInput } from '@/shared/ui/date-input/DateInput'
import { todayISO } from '@/shared/lib/date/date'
import type { HygieneDraft } from '@/entities/hygiene/hygiene-repository'
import styles from './HygieneForm.module.css'

type HygieneFormProps = {
  initialDraft?: HygieneDraft
  onCancel?: () => void
  onSubmit: (draft: HygieneDraft) => void
  submitLabel?: string
}

export function HygieneForm({ initialDraft, onCancel, onSubmit, submitLabel = 'Отметить' }: HygieneFormProps) {
  const [completedAt, setCompletedAt] = useState(initialDraft?.completedAt ?? todayISO())
  const [nextDueAt, setNextDueAt] = useState(initialDraft?.nextDueAt ?? '')

  return (
    <div className={styles.form}>
      <DateInput
        label="Дата профгигиены"
        onChange={(event) => setCompletedAt(event.target.value)}
        value={completedAt}
      />
      <DateInput
        label="Следующая профгигиена"
        onChange={(event) => setNextDueAt(event.target.value)}
        value={nextDueAt}
      />
      <div className={styles.actions}>
        {onCancel ? (
          <Button onClick={onCancel} variant="ghost">
            Отмена
          </Button>
        ) : null}
        <Button
          icon={initialDraft ? <Save size={18} /> : <Sparkles size={18} />}
          onClick={() => onSubmit({ completedAt, nextDueAt: nextDueAt || undefined })}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
