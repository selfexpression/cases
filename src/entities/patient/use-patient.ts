import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { patientRepository } from './patient-repository'

export function usePatient(patientId: string) {
  useStorageVersion()

  return patientRepository.getById(patientId)
}
