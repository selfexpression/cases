import { ArrowLeft, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PatientForm } from '@/features/patient-form/PatientForm'
import { useOrthodonticCase } from '@/entities/orthodontic-case/use-orthodontic-case'
import { patientRepository } from '@/entities/patient/patient-repository'
import { usePatient } from '@/entities/patient/use-patient'
import { Button } from '@/shared/ui/button/Button'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import styles from './PatientEditPage.module.css'

export function PatientEditPage() {
  const navigate = useNavigate()
  const { patientId = '' } = useParams()
  const patient = usePatient(patientId)
  const orthodonticCase = useOrthodonticCase(patientId)

  if (!patient) {
    return <EmptyState description="Такого пациента нет в локальном хранилище." title="Пациент не найден" />
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <IconButton icon={<ArrowLeft size={20} />} label="Назад" onClick={() => navigate(-1)} />
        <div>
          <span>Редактирование</span>
          <h1>{patient.fullName}</h1>
        </div>
      </header>

      <PatientForm
        initialCase={orthodonticCase}
        initialPatient={patient}
        onSubmit={(draft) => {
          patientRepository.update(patient.id, draft)
          navigate(`/patients/${patient.id}`)
        }}
        submitLabel="Сохранить"
      />

      <Button
        icon={<Trash2 size={18} />}
        onClick={() => {
          if (window.confirm('Удалить пациента и все связанные данные?')) {
            patientRepository.delete(patient.id)
            navigate('/')
          }
        }}
        variant="danger"
      >
        Удалить пациента
      </Button>
    </div>
  )
}
