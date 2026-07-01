import { z } from 'zod'

export const themeModeSchema = z.enum(['light', 'dark', 'system'])
export const accentColorSchema = z.enum(['teal', 'blue', 'green', 'rose', 'violet'])

export const appSettingsSchema = z.object({
  themeMode: themeModeSchema,
  accentColor: accentColorSchema,
  returnReminderLeadWeeks: z.number().int().min(0).max(52),
  activeClinicId: z.string(),
})

export const clinicSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const patientSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  fullName: z.string(),
  birthDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const orthodonticCaseSchema = z.object({
  patientId: z.string(),
  diagnosis: z.string().optional(),
  treatmentStage: z.string().optional(),
  treatmentPlan: z.string().optional(),
  nextPlannedAction: z.string().optional(),
  updatedAt: z.string(),
})

export const patientNoteSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const visitSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  visitDate: z.string(),
  summary: z.string().optional(),
  nextAppointmentDate: z.string().optional(),
  shouldReturnInWeeks: z.number().positive().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const hygieneRecordSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  completedAt: z.string().optional(),
  externalUnknownDate: z.boolean().optional(),
  nextDueAt: z.string().optional(),
  nextDueInMonths: z.number().positive().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const appStorageSchema = z.object({
  version: z.literal(7),
  clinics: z.array(clinicSchema),
  patients: z.array(patientSchema),
  orthodonticCases: z.array(orthodonticCaseSchema),
  notes: z.array(patientNoteSchema),
  visits: z.array(visitSchema),
  hygieneRecords: z.array(hygieneRecordSchema),
  settings: appSettingsSchema,
})

export type AppStorage = z.infer<typeof appStorageSchema>
