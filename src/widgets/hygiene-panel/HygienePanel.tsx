import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { formatHumanDate, getDueState } from '@/shared/lib/date/date'
import { Badge } from '@/shared/ui/badge/Badge'
import { Button } from '@/shared/ui/button/Button'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import { Sheet } from '@/shared/ui/sheet/Sheet'
import { HygieneForm } from '@/features/hygiene-tracking/HygieneForm'
import { hygieneRepository } from '@/entities/hygiene/hygiene-repository'
import type { HygieneRecord } from '@/entities/hygiene/types'
import styles from './HygienePanel.module.css'

type HygienePanelProps = {
  patientId: string
  records: HygieneRecord[]
}

function getHygieneBadge(record?: HygieneRecord) {
  if (record?.externalUnknownDate) {
    return <Badge tone="warning">Другая клиника · дата неизвестна</Badge>
  }

  if (!record?.nextDueAt) {
    return <Badge>Нет даты</Badge>
  }

  const dueState = getDueState(record.nextDueAt)
  const tone = dueState === 'overdue' ? 'danger' : dueState === 'today' ? 'warning' : dueState === 'soon' ? 'accent' : 'success'

  const label = record.nextDueInMonths
    ? `Через ${record.nextDueInMonths} мес. · ${formatHumanDate(record.nextDueAt)}`
    : formatHumanDate(record.nextDueAt)

  return <Badge tone={tone}>{label}</Badge>
}

export function HygienePanel({ patientId, records }: HygienePanelProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editedRecord, setEditedRecord] = useState<HygieneRecord>()
  const latestRecord = records[0]

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>Профгигиена</h2>
          <p>
            {latestRecord
              ? latestRecord.externalUnknownDate || !latestRecord.completedAt
                ? 'Последняя: дата неизвестна'
                : `Последняя: ${formatHumanDate(latestRecord.completedAt)}`
              : 'Записей пока нет'}
          </p>
        </div>
        {getHygieneBadge(latestRecord)}
      </div>

      <div className={styles.actions}>
        <Button icon={<Plus size={18} />} onClick={() => setIsCreating(true)} variant="secondary">
          Отметить
        </Button>
        {latestRecord ? (
          <Button icon={<Pencil size={18} />} onClick={() => setEditedRecord(latestRecord)} variant="ghost">
            Изменить
          </Button>
        ) : null}
      </div>

      {records.length > 1 ? (
        <div className={styles.history}>
          {records.slice(1).map((record) => (
            <div className={styles.record} key={record.id}>
              <span>{record.externalUnknownDate || !record.completedAt ? 'Другая клиника · дата неизвестна' : formatHumanDate(record.completedAt)}</span>
              <div className={styles.rowActions}>
                <IconButton icon={<Pencil size={17} />} label="Редактировать гигиену" onClick={() => setEditedRecord(record)} />
                <IconButton
                  icon={<Trash2 size={17} />}
                  label="Удалить запись о гигиене"
                  onClick={() => hygieneRepository.delete(record.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Sheet onClose={() => setIsCreating(false)} open={isCreating} title="Профгигиена">
        <HygieneForm
          onCancel={() => setIsCreating(false)}
          onSubmit={(draft) => {
            hygieneRepository.create(patientId, draft)
            setIsCreating(false)
          }}
        />
      </Sheet>

      <Sheet onClose={() => setEditedRecord(undefined)} open={Boolean(editedRecord)} title="Редактировать профгигиену">
        {editedRecord ? (
          <HygieneForm
            initialDraft={editedRecord}
            onCancel={() => setEditedRecord(undefined)}
            onSubmit={(draft) => {
              hygieneRepository.update(editedRecord.id, draft)
              setEditedRecord(undefined)
            }}
            submitLabel="Сохранить"
          />
        ) : null}
      </Sheet>
    </section>
  )
}
