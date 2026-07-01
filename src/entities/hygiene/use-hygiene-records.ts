import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { hygieneRepository } from './hygiene-repository'

export function useHygieneRecords(patientId: string) {
  useStorageVersion()

  return hygieneRepository.getByPatientId(patientId)
}
