import type { z } from 'zod'
import type { patientSchema } from '@/shared/storage/app-storage-schema'

export type Patient = z.infer<typeof patientSchema>
