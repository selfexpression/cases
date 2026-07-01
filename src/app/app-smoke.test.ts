import { beforeEach, describe, expect, it } from 'vitest'
import { hygieneRepository } from '@/entities/hygiene/hygiene-repository'
import { noteRepository } from '@/entities/note/note-repository'
import { patientRepository } from '@/entities/patient/patient-repository'
import { reminderRepository } from '@/entities/reminder/reminder-repository'
import { visitRepository } from '@/entities/visit/visit-repository'
import { readStorage } from '@/shared/storage/app-store'
import { defaultStorage } from '@/shared/storage/default-storage'
import { localStorageAdapter } from '@/shared/storage/local-storage-adapter'
import { installTestLocalStorage } from '@/shared/storage/test-storage'

describe('app smoke flow', () => {
  beforeEach(() => {
    installTestLocalStorage()
    localStorageAdapter.write(defaultStorage)
  })

  it('creates patient, notes, visit, hygiene and reminders in local storage', () => {
    const patient = patientRepository.create({
      fullName: 'Анна Смирнова',
      diagnosis: 'Скученность',
      nextPlannedAction: 'Смена дуги',
    })

    noteRepository.create(patient.id, 'Пациент адаптируется хорошо')
    visitRepository.create(patient.id, {
      visitDate: '2026-06-01',
      shouldReturnInWeeks: 4,
      summary: 'Активация',
    })
    hygieneRepository.create(patient.id, {
      completedAt: '2026-01-01',
      nextDueAt: '2026-06-30',
    })

    const storage = readStorage()

    expect(storage.patients).toHaveLength(1)
    expect(storage.notes).toHaveLength(1)
    expect(storage.visits).toHaveLength(1)
    expect(storage.hygieneRecords).toHaveLength(1)
    expect(reminderRepository.getAll().length).toBeGreaterThan(0)
  })
})
