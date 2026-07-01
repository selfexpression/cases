import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { clinicRepository } from '@/entities/clinic/clinic-repository'
import type { Clinic } from '@/entities/clinic/types'
import { useClinics } from '@/entities/clinic/use-clinics'
import { readStorage } from '@/shared/storage/app-store'
import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { Button } from '@/shared/ui/button/Button'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import { Input } from '@/shared/ui/input/Input'
import styles from './ClinicManagementPanel.module.css'

function ClinicRow({ activeClinicId, clinic, patientCount }: { activeClinicId: string; clinic: Clinic; patientCount: number }) {
  const [name, setName] = useState(clinic.name)

  useEffect(() => {
    setName(clinic.name)
  }, [clinic.name])

  const canDelete = patientCount === 0

  return (
    <div className={styles.row}>
      <Input
        label={clinic.id === activeClinicId ? 'Активная клиника' : 'Клиника'}
        onBlur={() => {
          if (name.trim() && name.trim() !== clinic.name) {
            clinicRepository.rename(clinic.id, name)
          }
        }}
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
      <div className={styles.rowActions}>
        <span>{patientCount} пац.</span>
        <IconButton
          disabled={!canDelete}
          icon={<Trash2 size={18} />}
          label={canDelete ? 'Удалить клинику' : 'Нельзя удалить клинику с пациентами'}
          onClick={() => clinicRepository.deleteEmpty(clinic.id)}
        />
      </div>
    </div>
  )
}

export function ClinicManagementPanel() {
  const storageVersion = useStorageVersion()
  const { activeClinicId, clinics } = useClinics()
  const [newClinicName, setNewClinicName] = useState('')
  const storage = readStorage()
  void storageVersion

  const patientCountByClinicId = new Map<string, number>()

  for (const patient of storage.patients) {
    patientCountByClinicId.set(patient.clinicId, (patientCountByClinicId.get(patient.clinicId) ?? 0) + 1)
  }

  const createClinic = () => {
    const clinic = clinicRepository.create(newClinicName)

    if (clinic) {
      setNewClinicName('')
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.create}>
        <Input label="Новая клиника" onChange={(event) => setNewClinicName(event.target.value)} value={newClinicName} />
        <Button icon={<Plus size={18} />} onClick={createClinic} variant="secondary">
          Добавить
        </Button>
      </div>

      <div className={styles.list}>
        {clinics.map((clinic) => (
          <ClinicRow
            activeClinicId={activeClinicId}
            clinic={clinic}
            key={clinic.id}
            patientCount={patientCountByClinicId.get(clinic.id) ?? 0}
          />
        ))}
      </div>
    </div>
  )
}
