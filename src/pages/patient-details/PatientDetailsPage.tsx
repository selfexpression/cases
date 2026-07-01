import { useParams } from 'react-router-dom'
import { addWeeksISO, formatHumanDate, getDueState } from '@/shared/lib/date/date'
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
          <NextAppointment
            nextAppointmentDate={latestVisit?.nextAppointmentDate}
            shouldReturnInWeeks={latestVisit?.shouldReturnInWeeks}
            visitDate={latestVisit?.visitDate}
          />
        </div>
        <dl className={styles.grid}>
          <div>
            <dt>Диагноз</dt>
            <dd>{orthodonticCase?.diagnosis || '-'}</dd>
          </div>
          <div>
            <dt>Этап</dt>
            <dd>{orthodonticCase?.treatmentStage || '-'}</dd>
          </div>
          <div>
            <dt>План</dt>
            <dd>{orthodonticCase?.treatmentPlan || '-'}</dd>
          </div>
          <div>
            <dt>Следующее действие</dt>
            <dd>{orthodonticCase?.nextPlannedAction || '-'}</dd>
          </div>
        </dl>
      </section>

      <HygienePanel patientId={patient.id} records={hygieneRecords} />
      <VisitsList patientId={patient.id} visits={visits} />
      <PatientNotesList notes={notes} patientId={patient.id} />
    </div>
  )
}
