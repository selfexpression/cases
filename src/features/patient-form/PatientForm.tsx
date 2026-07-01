import { useState } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/button/Button'
import { DateInput } from '@/shared/ui/date-input/DateInput'
import { Input } from '@/shared/ui/input/Input'
import { Textarea } from '@/shared/ui/textarea/Textarea'
import type { OrthodonticCase } from '@/entities/orthodontic-case/types'
import type { PatientDraft } from '@/entities/patient/patient-repository'
import type { Patient } from '@/entities/patient/types'
import styles from './PatientForm.module.css'

const patientFormSchema = z.object({
  birthDate: z.string().optional(),
  diagnosis: z.string().optional(),
  fullName: z.string().trim().min(2, 'Укажите ФИО'),
  nextPlannedAction: z.string().optional(),
  phone: z.string().optional(),
  treatmentPlan: z.string().optional(),
  treatmentStage: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

type PatientFormProps = {
  initialCase?: OrthodonticCase
  initialPatient?: Patient
  onSubmit: (draft: PatientDraft) => void
  submitLabel: string
}

export function PatientForm({ initialCase, initialPatient, onSubmit, submitLabel }: PatientFormProps) {
  const [formError, setFormError] = useState<string>()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PatientFormValues>({
    defaultValues: {
      birthDate: initialPatient?.birthDate ?? '',
      diagnosis: initialCase?.diagnosis ?? '',
      fullName: initialPatient?.fullName ?? '',
      nextPlannedAction: initialCase?.nextPlannedAction ?? '',
      phone: initialPatient?.phone ?? '',
      treatmentPlan: initialCase?.treatmentPlan ?? '',
      treatmentStage: initialCase?.treatmentStage ?? '',
    },
  })

  const submit = (values: PatientFormValues) => {
    const result = patientFormSchema.safeParse(values)

    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Проверьте данные')
      return
    }

    setFormError(undefined)
    onSubmit(result.data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <section className={styles.section}>
        <h2>Пациент</h2>
        <Input error={errors.fullName?.message} label="ФИО" {...register('fullName')} autoComplete="name" />
        <div className={styles.grid}>
          <DateInput label="Дата рождения" {...register('birthDate')} />
          <Input label="Телефон" type="tel" {...register('phone')} autoComplete="tel" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Ортодонтия</h2>
        <Textarea label="Диагноз" {...register('diagnosis')} />
        <Textarea label="Этап лечения" {...register('treatmentStage')} />
        <Textarea label="План лечения" {...register('treatmentPlan')} />
        <Textarea label="Следующее действие" {...register('nextPlannedAction')} />
      </section>

      {formError ? <p className={styles.error}>{formError}</p> : null}

      <Button icon={<Save size={18} />} type="submit">
        {submitLabel}
      </Button>
    </form>
  )
}
