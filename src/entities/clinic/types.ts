import type { z } from 'zod'
import type { clinicSchema } from '@/shared/storage/app-storage-schema'

export type Clinic = z.infer<typeof clinicSchema>
