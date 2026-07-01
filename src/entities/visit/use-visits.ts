import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { visitRepository } from './visit-repository'

export function useVisits(patientId: string) {
  useStorageVersion()

  return visitRepository.getByPatientId(patientId)
}
