import { createId } from '@/shared/lib/id/create-id'
import { readStorage, updateStorage } from '@/shared/storage/app-store'
import { DEFAULT_CLINIC_ID } from '@/shared/storage/default-storage'
import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { Patient } from './types'

export type PatientDraft = {
  birthDate?: string
  diagnosis?: string
  fullName: string
  nextPlannedAction?: string
  treatmentPlan?: string
  treatmentStage?: string
}

function nowISO() {
  return new Date().toISOString()
}

function cleanOptional(value?: string) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : undefined
}

function getActiveClinicId() {
  const storage = readStorage()

  return storage.clinics.some((clinic) => clinic.id === storage.settings.activeClinicId)
    ? storage.settings.activeClinicId
    : (storage.clinics[0]?.id ?? DEFAULT_CLINIC_ID)
}

function toOrthodonticCase(patientId: string, draft: PatientDraft): OrthodonticCase {
  return {
    patientId,
    diagnosis: cleanOptional(draft.diagnosis),
    treatmentStage: cleanOptional(draft.treatmentStage),
    treatmentPlan: cleanOptional(draft.treatmentPlan),
    nextPlannedAction: cleanOptional(draft.nextPlannedAction),
    updatedAt: nowISO(),
  }
}

export const patientRepository = {
  getAll() {
    return [...readStorage().patients].sort((first, second) => first.fullName.localeCompare(second.fullName))
  },
  getByClinicId(clinicId: string) {
    return readStorage()
      .patients.filter((patient) => patient.clinicId === clinicId)
      .sort((first, second) => first.fullName.localeCompare(second.fullName))
  },
  getById(patientId: string) {
    return readStorage().patients.find((patient) => patient.id === patientId)
  },
  create(draft: PatientDraft) {
    const timestamp = nowISO()
    const patient: Patient = {
      id: createId(),
      clinicId: getActiveClinicId(),
      fullName: draft.fullName.trim(),
      birthDate: cleanOptional(draft.birthDate),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    updateStorage((storage) => ({
      ...storage,
      patients: [...storage.patients, patient],
      orthodonticCases: [...storage.orthodonticCases, toOrthodonticCase(patient.id, draft)],
    }))

    return patient
  },
  update(patientId: string, draft: PatientDraft) {
    const timestamp = nowISO()

    updateStorage((storage) => {
      const nextPatient: Patient = {
        id: patientId,
        clinicId: storage.patients.find((patient) => patient.id === patientId)?.clinicId ?? DEFAULT_CLINIC_ID,
        fullName: draft.fullName.trim(),
        birthDate: cleanOptional(draft.birthDate),
        createdAt: storage.patients.find((patient) => patient.id === patientId)?.createdAt ?? timestamp,
        updatedAt: timestamp,
      }
      const nextCase = toOrthodonticCase(patientId, draft)
      const hasCase = storage.orthodonticCases.some((orthodonticCase) => orthodonticCase.patientId === patientId)

      return {
        ...storage,
        patients: storage.patients.map((patient) => (patient.id === patientId ? nextPatient : patient)),
        orthodonticCases: hasCase
          ? storage.orthodonticCases.map((orthodonticCase) =>
              orthodonticCase.patientId === patientId ? nextCase : orthodonticCase,
            )
          : [...storage.orthodonticCases, nextCase],
      }
    })
  },
  delete(patientId: string) {
    updateStorage((storage) => ({
      ...storage,
      patients: storage.patients.filter((patient) => patient.id !== patientId),
      orthodonticCases: storage.orthodonticCases.filter((orthodonticCase) => orthodonticCase.patientId !== patientId),
      notes: storage.notes.filter((note) => note.patientId !== patientId),
      visits: storage.visits.filter((visit) => visit.patientId !== patientId),
      hygieneRecords: storage.hygieneRecords.filter((record) => record.patientId !== patientId),
    }))
  },
}
