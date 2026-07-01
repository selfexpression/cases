import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addWeeksISO, formatHumanDate, getDueState } from '@/shared/lib/date/date'
import { StatusChip } from '@/shared/ui/status-chip/StatusChip'
import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { Patient } from '@/entities/patient/types'
import type { Visit } from '@/entities/visit/types'
import styles from './PatientCard.module.css'

type PatientCardProps = {
  orthodonticCase?: OrthodonticCase
  patient: Patient
  latestVisit?: Visit
}

function getNextVisitLabel(latestVisit?: Visit) {
  if (!latestVisit) {
    return undefined
  }

  const controlDate =
    latestVisit.nextAppointmentDate ??
    (latestVisit.shouldReturnInWeeks ? addWeeksISO(latestVisit.visitDate, latestVisit.shouldReturnInWeeks) : undefined)

  if (!controlDate) {
    return undefined
  }

  const dueState = getDueState(controlDate)
  const tone = dueState === 'overdue' ? 'danger' : dueState === 'today' ? 'accent' : 'neutral'

  return {
    text: latestVisit.nextAppointmentDate ? formatHumanDate(controlDate) : `Вернуть ${formatHumanDate(controlDate)}`,
    tone,
  } as const
}

export function PatientCard({ latestVisit, orthodonticCase, patient }: PatientCardProps) {
  const nextVisit = getNextVisitLabel(latestVisit)

  return (
    <Link className={styles.card} to={`/patients/${patient.id}`}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2>{patient.fullName}</h2>
          {nextVisit ? <StatusChip tone={nextVisit.tone}>{nextVisit.text}</StatusChip> : <StatusChip>Нет записи</StatusChip>}
        </div>
        {orthodonticCase?.diagnosis ? <p>{orthodonticCase.diagnosis}</p> : null}
        {orthodonticCase?.treatmentStage ? <span>{orthodonticCase.treatmentStage}</span> : null}
      </div>
      <ChevronRight size={20} />
    </Link>
  )
}
