import type { z } from 'zod'
import type { visitSchema } from '@/shared/storage/app-storage-schema'

export type Visit = z.infer<typeof visitSchema>
