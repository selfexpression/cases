import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { orthodonticCaseRepository } from './orthodontic-case-repository'

export function useOrthodonticCase(patientId: string) {
  useStorageVersion()

  return orthodonticCaseRepository.getByPatientId(patientId)
}
