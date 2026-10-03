import { beforeEach, describe, expect, it } from 'vitest'
import { defaultStorage } from './default-storage'
import { importStorage, exportStorage } from './data-transfer'
import { readStorage, writeStorage } from './app-store'
import { installTestLocalStorage } from './test-storage'

const legacy = {
  ...defaultStorage,
  version: 7,
  patients: [{ id: 'p', clinicId: 'default-clinic', fullName: 'Тестовый пациент', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }],
  orthodonticCases: [{ patientId: 'p', diagnosis: 'Тест', treatmentPlan: 'План', treatmentStage: 'Этап', nextPlannedAction: 'Действие', updatedAt: '2026-01-01T00:00:00.000Z' }],
}

describe('backup compatibility', () => {
  beforeEach(async () => {
    installTestLocalStorage()
    await writeStorage(structuredClone(defaultStorage))
  })

  it.each([false, true])('imports a v7 backup, wrapped: %s', (wrapped) => {
    const result = importStorage(JSON.stringify(wrapped ? { app: 'cases', type: 'cases-backup', storage: legacy } : legacy))
    expect(result.patients).toBe(1)
    expect(readStorage().version).toBe(9)
    expect(readStorage().orthodonticCases[0]).toEqual({ patientId: 'p', diagnosis: 'Тест', treatmentPlan: 'План', updatedAt: '2026-01-01T00:00:00.000Z' })
    expect(readStorage().patients[0].archivedAt).toBeUndefined()
  })

  it('round-trips new fields and archived patients', () => {
    importStorage(JSON.stringify({ ...defaultStorage, patients: [{ ...legacy.patients[0], archivedAt: '2026-09-30T21:05:00.000Z' }], orthodonticCases: [{ patientId: 'p', appliance: 'Брекеты', bracesInstalledAt: '2026-01-31', plannedTreatmentMonths: 24, updatedAt: legacy.patients[0].updatedAt }] }))
    const original = readStorage()
    importStorage(exportStorage())
    expect(readStorage()).toEqual(original)
  })

  it.each([null, {}, { ...legacy, version: 999 }, { ...legacy, patients: [{}] }, { ...legacy, orthodonticCases: [{ patientId: 'p', bracesInstalledAt: '2026-02-31', updatedAt: '' }] }])('rejects invalid backup without replacing existing records', (bad) => {
    importStorage(JSON.stringify(legacy))
    const original = readStorage()
    expect(() => importStorage(JSON.stringify({ app: 'cases', type: 'cases-backup', storage: bad }))).toThrow()
    expect(readStorage()).toBe(original)
  })
  it.each([false, true])('imports a v8 backup without changing its records, wrapped: %s', (wrapped) => {
    const v8 = { ...legacy, version: 8, orthodonticCases: [{ patientId: 'p', treatmentPlan: 'Тестовый план', updatedAt: '' }] }
    const raw = wrapped ? { app: 'cases', type: 'cases-backup', storage: v8 } : v8
    expect(importStorage(JSON.stringify(raw)).patients).toBe(1)
    expect(readStorage().version).toBe(9)
    expect(readStorage().patients).toEqual(v8.patients)
    expect(readStorage().orthodonticCases[0].plannedTreatmentMonths).toBeUndefined()
  })

})
