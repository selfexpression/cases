import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { Patient } from '@/entities/patient/types'

type FilterPatientsParams = {
  orthodonticCases: OrthodonticCase[]
  patients: Patient[]
  query: string
}

export function filterPatients({ orthodonticCases, patients, query }: FilterPatientsParams) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return patients
  }

  return patients.filter((patient) => {
    const orthodonticCase = orthodonticCases.find((caseItem) => caseItem.patientId === patient.id)
    const searchableText = [
      patient.fullName,
      patient.phone,
      orthodonticCase?.diagnosis,
      orthodonticCase?.treatmentStage,
      orthodonticCase?.treatmentPlan,
      orthodonticCase?.nextPlannedAction,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedQuery)
  })
}
