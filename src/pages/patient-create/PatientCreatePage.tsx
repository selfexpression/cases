import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PatientForm } from '@/features/patient-form/PatientForm'
import { patientRepository } from '@/entities/patient/patient-repository'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import styles from './PatientCreatePage.module.css'

export function PatientCreatePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <IconButton icon={<ArrowLeft size={20} />} label="Назад" onClick={() => navigate(-1)} />
        <div>
          <span>Новый пациент</span>
          <h1>Добавить пациента</h1>
        </div>
      </header>

      <PatientForm
        onSubmit={(draft) => {
          const patient = patientRepository.create(draft)
          navigate(`/patients/${patient.id}`)
        }}
        submitLabel="Создать пациента"
      />
    </div>
  )
}
