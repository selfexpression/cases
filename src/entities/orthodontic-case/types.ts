import type { z } from 'zod'
import type { orthodonticCaseSchema } from '@/shared/storage/app-storage-schema'

export type OrthodonticCase = z.infer<typeof orthodonticCaseSchema>
