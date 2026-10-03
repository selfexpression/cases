import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { readStorage } from '@/shared/storage/app-store'
import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { Button } from '@/shared/ui/button/Button'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { clinicRepository } from '@/entities/clinic/clinic-repository'
import { ClinicSwitcher } from '@/features/clinic-switcher/ClinicSwitcher'
import { filterPatients } from '@/features/patient-search/filter-patients'
import { PatientSearchField } from '@/features/patient-search/PatientSearchField'
import { PatientCard } from '@/widgets/patient-card/PatientCard'
import styles from './PatientsListPage.module.css'

export function PatientsListPage() {
  const storageVersion = useStorageVersion()
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const showArchive = searchParams.get('status') === 'archived'
  const storage = readStorage()
  void storageVersion
  const activeClinic = clinicRepository.getActive()
  const activeClinicId = clinicRepository.getActiveId()
  const patients = filterPatients({
    patients: storage.patients.filter((patient) => patient.clinicId === activeClinicId && Boolean(patient.archivedAt) === showArchive),
    orthodonticCases: storage.orthodonticCases,
    query,
  }).sort((first, second) => first.fullName.localeCompare(second.fullName))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>Cases</span>
          <h1>Пациенты</h1>
        </div>
        <Link to="/patients/new">
          <Button icon={<Plus size={18} />}>Добавить</Button>
        </Link>
      </header>

      <ClinicSwitcher />

      <div aria-label="Статус пациентов" className={styles.filters}>
        <Button aria-pressed={!showArchive} onClick={() => setSearchParams({})} variant={!showArchive ? 'primary' : 'secondary'}>Активные</Button>
        <Button aria-pressed={showArchive} onClick={() => setSearchParams({ status: 'archived' })} variant={showArchive ? 'primary' : 'secondary'}>Архив</Button>
      </div>

      <PatientSearchField onChange={setQuery} value={query} />

      {patients.length ? (
        <div className={styles.list}>
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              latestHygiene={storage.hygieneRecords
                .filter((record) => record.patientId === patient.id)
                .sort((first, second) => (second.completedAt ?? second.createdAt).localeCompare(first.completedAt ?? first.createdAt))[0]}
              latestVisit={storage.visits
                .filter((visit) => visit.patientId === patient.id)
                .sort((first, second) => second.visitDate.localeCompare(first.visitDate))[0]}
              orthodonticCase={storage.orthodonticCases.find((caseItem) => caseItem.patientId === patient.id)}
              patient={patient}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={!showArchive && !query.trim() ? (
            <Link to="/patients/new">
              <Button icon={<Plus size={18} />}>Добавить пациента</Button>
            </Link>
          ) : undefined}
          description={query.trim() ? 'Попробуйте изменить запрос.' : showArchive ? 'Здесь появятся пациенты с завершённым лечением.' : `Создайте первого пациента для клиники ${activeClinic?.name ?? 'Основная клиника'}.`}
          title={query.trim() ? 'Пациенты не найдены' : showArchive ? 'Архив пуст' : 'Активных пациентов нет'}
        />
      )}
    </div>
  )
}
