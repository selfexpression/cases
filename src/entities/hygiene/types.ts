import type { z } from 'zod'
import type { hygieneRecordSchema } from '@/shared/storage/app-storage-schema'

export type HygieneRecord = z.infer<typeof hygieneRecordSchema>
