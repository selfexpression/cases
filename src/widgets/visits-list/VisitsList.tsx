import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { addWeeksISO, formatHumanDate } from '@/shared/lib/date/date'
import { Badge } from '@/shared/ui/badge/Badge'
import { Button } from '@/shared/ui/button/Button'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import { Sheet } from '@/shared/ui/sheet/Sheet'
import { VisitForm } from '@/features/visit-form/VisitForm'
import { visitRepository } from '@/entities/visit/visit-repository'
import type { Visit } from '@/entities/visit/types'
import styles from './VisitsList.module.css'

type VisitsListProps = {
  patientId: string
  visits: Visit[]
}

export function VisitsList({ patientId, visits }: VisitsListProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editedVisit, setEditedVisit] = useState<Visit>()

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Визиты</h2>
        <Button icon={<Plus size={18} />} onClick={() => setIsCreating(true)} variant="secondary">
          Добавить
        </Button>
      </div>

      <div className={styles.list}>
        {visits.length ? (
          visits.map((visit) => (
            <article className={styles.visit} key={visit.id}>
              <header>
                <h3>{formatHumanDate(visit.visitDate)}</h3>
                <div className={styles.rowActions}>
                  <IconButton icon={<Pencil size={17} />} label="Редактировать визит" onClick={() => setEditedVisit(visit)} />
                  <IconButton icon={<Trash2 size={17} />} label="Удалить визит" onClick={() => visitRepository.delete(visit.id)} />
                </div>
              </header>
              {visit.summary ? <p>{visit.summary}</p> : null}
              <div className={styles.meta}>
                {visit.nextAppointmentDate ? <Badge tone="accent">Запись {formatHumanDate(visit.nextAppointmentDate)}</Badge> : null}
                {!visit.nextAppointmentDate && visit.shouldReturnInWeeks ? (
                  <Badge tone="warning">
                    Вернуться через {visit.shouldReturnInWeeks} нед. · {formatHumanDate(addWeeksISO(visit.visitDate, visit.shouldReturnInWeeks))}
                  </Badge>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <p className={styles.muted}>Визитов пока нет</p>
        )}
      </div>

      <Sheet onClose={() => setIsCreating(false)} open={isCreating} title="Новый визит">
        <VisitForm
          onCancel={() => setIsCreating(false)}
          onSubmit={(draft) => {
            visitRepository.create(patientId, draft)
            setIsCreating(false)
          }}
        />
      </Sheet>

      <Sheet onClose={() => setEditedVisit(undefined)} open={Boolean(editedVisit)} title="Редактировать визит">
        {editedVisit ? (
          <VisitForm
            initialDraft={editedVisit}
            onCancel={() => setEditedVisit(undefined)}
            onSubmit={(draft) => {
              visitRepository.update(editedVisit.id, draft)
              setEditedVisit(undefined)
            }}
            submitLabel="Сохранить"
          />
        ) : null}
      </Sheet>
    </section>
  )
}
