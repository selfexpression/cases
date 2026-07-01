import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { patientRepository } from './patient-repository'

export function usePatients() {
  useStorageVersion()

  return patientRepository.getAll()
}
