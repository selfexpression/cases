import type { z } from 'zod'
import type { patientNoteSchema } from '@/shared/storage/app-storage-schema'

export type PatientNote = z.infer<typeof patientNoteSchema>
