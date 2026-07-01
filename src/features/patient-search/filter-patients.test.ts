import { describe, expect, it } from 'vitest'
import { filterPatients } from './filter-patients'

const patients = [
  {
    id: 'patient-1',
    fullName: 'Анна Смирнова',
    phone: '+79990000000',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'patient-2',
    fullName: 'Пётр Иванов',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
]

describe('filterPatients', () => {
  it('filters by patient and orthodontic case text', () => {
    expect(
      filterPatients({
        patients,
        orthodonticCases: [
          {
            patientId: 'patient-2',
            diagnosis: 'Дистальный прикус',
            updatedAt: '2026-07-01T00:00:00.000Z',
          },
        ],
        query: 'дистальный',
      }),
    ).toEqual([patients[1]])
  })

  it('returns all patients when query is empty', () => {
    expect(filterPatients({ patients, orthodonticCases: [], query: ' ' })).toEqual(patients)
  })
})
