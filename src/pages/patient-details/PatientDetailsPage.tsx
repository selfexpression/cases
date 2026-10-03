import { useState } from 'react'
import { Archive, ArchiveRestore } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { addWeeksISO, formatHumanDate, getDueState, getFullMonthsSince, toISODate } from '@/shared/lib/date/date'
import { patientRepository } from '@/entities/patient/patient-repository'
import { Button } from '@/shared/ui/button/Button'
import { Badge } from '@/shared/ui/badge/Badge'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { useHygieneRecords } from '@/entities/hygiene/use-hygiene-records'
import { useNotes } from '@/entities/note/use-notes'
import { useOrthodonticCase } from '@/entities/orthodontic-case/use-orthodontic-case'
import { usePatient } from '@/entities/patient/use-patient'
import { useVisits } from '@/entities/visit/use-visits'
import { HygienePanel } from '@/widgets/hygiene-panel/HygienePanel'
import { PatientHeader } from '@/widgets/patient-header/PatientHeader'
import { PatientNotesList } from '@/widgets/patient-notes-list/PatientNotesList'
import { VisitsList } from '@/widgets/visits-list/VisitsList'
import styles from './PatientDetailsPage.module.css'

function NextAppointment({
  nextAppointmentDate,
  shouldReturnInWeeks,
  visitDate,
}: {
  nextAppointmentDate?: string
  shouldReturnInWeeks?: number
  visitDate?: string
}) {
  const returnDate = visitDate && shouldReturnInWeeks ? addWeeksISO(visitDate, shouldReturnInWeeks) : undefined
  const controlDate = nextAppointmentDate ?? returnDate

  if (!controlDate) {
    return <Badge compact tone="warning">Следующая запись не указана</Badge>
  }

  const dueState = getDueState(controlDate)
  const tone = dueState === 'overdue' ? 'danger' : dueState === 'today' ? 'accent' : 'success'
  const label = nextAppointmentDate ? 'Следующая запись' : 'Рекомендуемая дата приёма'

  return <Badge compact tone={tone}>{label} {formatHumanDate(controlDate)}</Badge>
}

export function PatientDetailsPage() {
  const { patientId = '' } = useParams()
  const [archiving, setArchiving] = useState(false)
  const [archiveError, setArchiveError] = useState<string>()
  const patient = usePatient(patientId)
  const orthodonticCase = useOrthodonticCase(patientId)
  const notes = useNotes(patientId)
  const visits = useVisits(patientId)
  const hygieneRecords = useHygieneRecords(patientId)
  const latestVisit = visits[0]

  if (!patient) {
    return <EmptyState description="Такого пациента нет в локальном хранилище." title="Пациент не найден" />
  }

  return (
    <div className={styles.page}>
      <PatientHeader patient={patient} />

      <section className={styles.summary}>
        <div className={styles.summaryHeader}>
          <h2>Ортодонтическая карта</h2>
          {patient.archivedAt ? <Badge compact>Лечение завершено · В архиве</Badge> : <NextAppointment
            nextAppointmentDate={latestVisit?.nextAppointmentDate}
            shouldReturnInWeeks={latestVisit?.shouldReturnInWeeks}
            visitDate={latestVisit?.visitDate}
          />}
        </div>
        <dl className={styles.grid}>
          <div>
            <dt>Диагноз</dt>
            <dd>{orthodonticCase?.diagnosis || '-'}</dd>
          </div>
          <div>
            <dt>Аппарат</dt>
            <dd>{orthodonticCase?.appliance || 'Не указан'}</dd>
          </div>
          <div>
            <dt>План</dt>
            <dd>{orthodonticCase?.treatmentPlan || '-'}</dd>
          </div>
          <div>
            <dt>Плановый срок лечения</dt>
            <dd>{orthodonticCase?.plannedTreatmentMonths !== undefined
              ? `${orthodonticCase.plannedTreatmentMonths} мес.`
              : 'Не указан'}</dd>
          </div>
          <div>
            <dt>Дата установки ортодонтического аппарата</dt>
            <dd>{orthodonticCase?.bracesInstalledAt ? formatHumanDate(orthodonticCase.bracesInstalledAt) : 'Не указана'}</dd>
          </div>
          <div>
            <dt>Срок ношения ортодонтического аппарата{patient.archivedAt ? ' на момент завершения лечения' : ''}</dt>
            <dd>{orthodonticCase?.bracesInstalledAt
              ? `${getFullMonthsSince(orthodonticCase.bracesInstalledAt, patient.archivedAt ? toISODate(new Date(patient.archivedAt)) : undefined)} мес. (полных)`
              : 'Укажите дату установки'}</dd>
          </div>
        </dl>
      </section>

      <Button
        disabled={archiving}
        icon={patient.archivedAt ? <ArchiveRestore size={18} /> : <Archive size={18} />}
        onClick={async () => {
          setArchiving(true)
          setArchiveError(undefined)
          try {
            await patientRepository.setArchived(patient.id, !patient.archivedAt)
          } catch {
            setArchiveError('Не удалось изменить статус пациента. Повторите попытку.')
          } finally {
            setArchiving(false)
          }
        }}
        variant="secondary"
      >
        {archiving ? 'Сохранение…' : patient.archivedAt ? 'Вернуть в активные' : 'Завершить лечение и перенести в архив'}
      </Button>
      {archiveError ? <p role="alert">{archiveError}</p> : null}

      <HygienePanel patientId={patient.id} records={hygieneRecords} />
      <VisitsList patientId={patient.id} visits={visits} />
      <PatientNotesList notes={notes} patientId={patient.id} />
    </div>
  )
}
