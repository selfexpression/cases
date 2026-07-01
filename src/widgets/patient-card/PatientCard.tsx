import { ArrowUpRight, CircleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addWeeksISO, formatHumanDate, getDueState } from '@/shared/lib/date/date'
import { StatusChip } from '@/shared/ui/status-chip/StatusChip'
import type { HygieneRecord } from '@/entities/hygiene/types'
import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { Patient } from '@/entities/patient/types'
import type { Visit } from '@/entities/visit/types'
import styles from './PatientCard.module.css'

type PatientCardProps = {
  orthodonticCase?: OrthodonticCase
  patient: Patient
  latestHygiene?: HygieneRecord
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
    text: latestVisit.nextAppointmentDate ? formatHumanDate(controlDate) : `Рекомендуемая дата приёма ${formatHumanDate(controlDate)}`,
    tone,
  } as const
}

function getHygieneFlag(latestHygiene?: HygieneRecord) {
  if (latestHygiene?.externalUnknownDate) {
    return {
      className: styles.hygieneWarning,
      title: 'Профгигиена выполнена в другой клинике, дата неизвестна',
    }
  }

  if (!latestHygiene?.nextDueAt) {
    return undefined
  }

  const dueState = getDueState(latestHygiene.nextDueAt)

  if (dueState === 'overdue') {
    return {
      className: styles.hygieneDanger,
      title: `Срок профгигиены прошёл: ${formatHumanDate(latestHygiene.nextDueAt)}`,
    }
  }

  if (dueState === 'today') {
    return {
      className: styles.hygieneWarning,
      title: `Сегодня срок профгигиены: ${formatHumanDate(latestHygiene.nextDueAt)}`,
    }
  }

  return undefined
}

export function PatientCard({ latestHygiene, latestVisit, orthodonticCase, patient }: PatientCardProps) {
  const nextVisit = getNextVisitLabel(latestVisit)
  const hygieneFlag = getHygieneFlag(latestHygiene)

  return (
    <Link className={styles.card} to={`/patients/${patient.id}`}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2>{patient.fullName}</h2>
          <span className={styles.actionIcon} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className={styles.meta}>
          {nextVisit ? (
            <StatusChip compact tone={nextVisit.tone}>
              {nextVisit.text}
            </StatusChip>
          ) : (
            <StatusChip compact>Нет записи</StatusChip>
          )}
          {hygieneFlag ? (
            <span
              aria-label={hygieneFlag.title}
              className={`${styles.hygieneFlag} ${hygieneFlag.className}`}
              role="img"
              title={hygieneFlag.title}
            >
              <CircleAlert size={16} />
            </span>
          ) : null}
        </div>
        {orthodonticCase?.diagnosis ? <p>{orthodonticCase.diagnosis}</p> : null}
        {orthodonticCase?.treatmentStage ? <span className={styles.stage}>{orthodonticCase.treatmentStage}</span> : null}
      </div>
    </Link>
  )
}
