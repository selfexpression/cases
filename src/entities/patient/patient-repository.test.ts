import { beforeEach, describe, expect, it } from 'vitest'
import { patientRepository } from './patient-repository'
import { readStorage, writeStorage } from '@/shared/storage/app-store'
import { defaultStorage } from '@/shared/storage/default-storage'
import { indexedDbAdapter } from '@/shared/storage/indexed-db-adapter'
import { installTestLocalStorage } from '@/shared/storage/test-storage'
import { reminderRepository } from '@/entities/reminder/reminder-repository'
import { noteRepository } from '@/entities/note/note-repository'

describe('patient archive and treatment data', () => {
  beforeEach(async () => {
    installTestLocalStorage()
    await writeStorage(structuredClone(defaultStorage))
  })

  it('persists treatment details, keeps archive through editing and restores reminders', async () => {
    const patient = await patientRepository.create({ fullName: 'Тестовый пациент', appliance: ' Брекеты ', bracesInstalledAt: '2026-01-31' })
    noteRepository.create(patient.id, 'Тестовая заметка')
    await patientRepository.setArchived(patient.id, true)
    const archivedAt = patientRepository.getById(patient.id)?.archivedAt
    expect(archivedAt).toBeDefined()
    expect(reminderRepository.getAll()).toEqual([])
    await patientRepository.update(patient.id, { fullName: 'Тестовый пациент', appliance: 'Брекеты', bracesInstalledAt: '2026-01-31' })
    const reloaded = await indexedDbAdapter.read()
    expect(reloaded.patients[0].archivedAt).toBe(archivedAt)
    expect(reloaded.orthodonticCases[0]).toMatchObject({ appliance: 'Брекеты', bracesInstalledAt: '2026-01-31' })
    expect(reloaded.notes).toHaveLength(1)
    await patientRepository.setArchived(patient.id, false)
    expect(patientRepository.getById(patient.id)?.archivedAt).toBeUndefined()
    expect(reminderRepository.getAll()).toHaveLength(1)
    expect(readStorage().notes).toHaveLength(1)
  })

  it('keeps both rapid edits in the persisted snapshot', async () => {
    const a = await patientRepository.create({ fullName: 'Тест Один' })
    const b = await patientRepository.create({ fullName: 'Тест Два' })
    await Promise.all([
      patientRepository.update(a.id, { fullName: 'Изменён Один', appliance: 'Пластинка' }),
      patientRepository.update(b.id, { fullName: 'Изменён Два', appliance: 'Элайнеры' }),
    ])
    const reloaded = await indexedDbAdapter.read()
    expect(reloaded.patients.map((p) => p.fullName)).toEqual(['Изменён Один', 'Изменён Два'])
    expect(reloaded.orthodonticCases.map((c) => c.appliance)).toEqual(['Пластинка', 'Элайнеры'])
  })
})
