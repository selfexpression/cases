import { Building2 } from 'lucide-react'
import { clinicRepository } from '@/entities/clinic/clinic-repository'
import { useClinics } from '@/entities/clinic/use-clinics'
import { Select } from '@/shared/ui/select/Select'
import styles from './ClinicSwitcher.module.css'

export function ClinicSwitcher() {
  const { activeClinicId, clinics } = useClinics()

  return (
    <div className={styles.switcher}>
      <span className={styles.icon} aria-hidden="true">
        <Building2 size={18} />
      </span>
      <Select
        label="Клиника"
        onValueChange={(clinicId) => clinicRepository.setActive(clinicId)}
        options={clinics.map((clinic) => ({ label: clinic.name, value: clinic.id }))}
        value={activeClinicId}
      />
    </div>
  )
}
