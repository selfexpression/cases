import { ArrowLeft, Edit } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import type { Patient } from '@/entities/patient/types'
import styles from './PatientHeader.module.css'

type PatientHeaderProps = {
  patient: Patient
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <IconButton icon={<ArrowLeft size={20} />} label="Назад" onClick={() => navigate(-1)} />
      <div>
        <h1>{patient.fullName}</h1>
        {patient.phone ? <a href={`tel:${patient.phone}`}>{patient.phone}</a> : <span>Телефон не указан</span>}
      </div>
      <Link aria-label="Редактировать" className={styles.iconLink} title="Редактировать" to={`/patients/${patient.id}/edit`}>
        <Edit size={20} />
      </Link>
    </header>
  )
}
