import { createId } from '@/shared/lib/id/create-id'
import { readStorage, updateStorage } from '@/shared/storage/app-store'
import type { PatientNote } from './types'

function nowISO() {
  return new Date().toISOString()
}

export const noteRepository = {
  getByPatientId(patientId: string) {
    return readStorage()
      .notes.filter((note) => note.patientId === patientId)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  },
  create(patientId: string, content: string) {
    const timestamp = nowISO()
    const note: PatientNote = {
      id: createId(),
      patientId,
      content: content.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    updateStorage((storage) => ({
      ...storage,
      notes: [...storage.notes, note],
    }))

    return note
  },
  update(noteId: string, content: string) {
    updateStorage((storage) => ({
      ...storage,
      notes: storage.notes.map((note) =>
        note.id === noteId ? { ...note, content: content.trim(), updatedAt: nowISO() } : note,
      ),
    }))
  },
  delete(noteId: string) {
    updateStorage((storage) => ({
      ...storage,
      notes: storage.notes.filter((note) => note.id !== noteId),
    }))
  },
}
