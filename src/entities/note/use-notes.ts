import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { noteRepository } from './note-repository'

export function useNotes(patientId: string) {
  useStorageVersion()

  return noteRepository.getByPatientId(patientId)
}
