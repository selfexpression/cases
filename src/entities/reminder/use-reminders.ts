import { useStorageVersion } from '@/shared/storage/use-storage-version'
import { reminderRepository } from './reminder-repository'

export function useReminders() {
  useStorageVersion()

  return reminderRepository.getAll()
}
