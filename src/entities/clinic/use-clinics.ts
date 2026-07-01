import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { clinicRepository } from './clinic-repository'

export function useClinics() {
  useStorageVersion()

  return {
    activeClinic: clinicRepository.getActive(),
    activeClinicId: clinicRepository.getActiveId(),
    clinics: clinicRepository.getAll(),
  }
}
