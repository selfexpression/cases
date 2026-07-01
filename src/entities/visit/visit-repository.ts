import { createId } from '@/shared/lib/id/create-id'
import { readStorage, updateStorage } from '@/shared/storage/app-store'
import type { Visit } from './types'

export type VisitDraft = {
  nextAppointmentDate?: string
  shouldReturnInWeeks?: number
  summary?: string
  visitDate: string
}

function nowISO() {
  return new Date().toISOString()
}

function cleanOptional(value?: string) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : undefined
}

export const visitRepository = {
  getByPatientId(patientId: string) {
    return readStorage()
      .visits.filter((visit) => visit.patientId === patientId)
      .sort((first, second) => second.visitDate.localeCompare(first.visitDate))
  },
  getLatestByPatientId(patientId: string) {
    return this.getByPatientId(patientId)[0]
  },
  create(patientId: string, draft: VisitDraft) {
    const timestamp = nowISO()
    const visit: Visit = {
      id: createId(),
      patientId,
      visitDate: draft.visitDate,
      summary: cleanOptional(draft.summary),
      nextAppointmentDate: cleanOptional(draft.nextAppointmentDate),
      shouldReturnInWeeks: draft.shouldReturnInWeeks,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    updateStorage((storage) => ({
      ...storage,
      visits: [...storage.visits, visit],
    }))

    return visit
  },
  update(visitId: string, draft: VisitDraft) {
    updateStorage((storage) => ({
      ...storage,
      visits: storage.visits.map((visit) =>
        visit.id === visitId
          ? {
              ...visit,
              visitDate: draft.visitDate,
              summary: cleanOptional(draft.summary),
              nextAppointmentDate: cleanOptional(draft.nextAppointmentDate),
              shouldReturnInWeeks: draft.shouldReturnInWeeks,
              updatedAt: nowISO(),
            }
          : visit,
      ),
    }))
  },
  delete(visitId: string) {
    updateStorage((storage) => ({
      ...storage,
      visits: storage.visits.filter((visit) => visit.id !== visitId),
    }))
  },
}
