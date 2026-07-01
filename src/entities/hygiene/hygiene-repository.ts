import { createId } from '@/shared/lib/id/create-id'
import { readStorage, updateStorage } from '@/shared/storage/app-store'
import type { HygieneRecord } from './types'

export type HygieneDraft = {
  completedAt: string
  nextDueAt?: string
}

function nowISO() {
  return new Date().toISOString()
}

export const hygieneRepository = {
  getByPatientId(patientId: string) {
    return readStorage()
      .hygieneRecords.filter((record) => record.patientId === patientId)
      .sort((first, second) => second.completedAt.localeCompare(first.completedAt))
  },
  getLatestByPatientId(patientId: string) {
    return this.getByPatientId(patientId)[0]
  },
  create(patientId: string, draft: HygieneDraft) {
    const timestamp = nowISO()
    const record: HygieneRecord = {
      id: createId(),
      patientId,
      completedAt: draft.completedAt,
      nextDueAt: draft.nextDueAt || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    updateStorage((storage) => ({
      ...storage,
      hygieneRecords: [...storage.hygieneRecords, record],
    }))

    return record
  },
  update(recordId: string, draft: HygieneDraft) {
    updateStorage((storage) => ({
      ...storage,
      hygieneRecords: storage.hygieneRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              completedAt: draft.completedAt,
              nextDueAt: draft.nextDueAt || undefined,
              updatedAt: nowISO(),
            }
          : record,
      ),
    }))
  },
  delete(recordId: string) {
    updateStorage((storage) => ({
      ...storage,
      hygieneRecords: storage.hygieneRecords.filter((record) => record.id !== recordId),
    }))
  },
}
