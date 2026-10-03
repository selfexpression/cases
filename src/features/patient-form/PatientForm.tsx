import { useState } from 'react'
import { Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { todayISO } from '@/shared/lib/date/date'
import { Button } from '@/shared/ui/button/Button'
import { DateInput } from '@/shared/ui/date-input/DateInput'
import { orthodonticCaseSchema } from '@/shared/storage/app-storage-schema'
import { NumberInput } from '@/shared/ui/number-input/NumberInput'
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
  appliance: z.string().optional(),
  bracesInstalledAt: z.union([z.literal(''), z.iso.date()]).optional(),
  treatmentPlan: z.string().optional(),
  plannedTreatmentMonths: z.string().trim()
    .refine((value) => value === '' || /^\d+$/.test(value), 'Укажите срок лечения целым числом месяцев больше нуля')
    .transform((value) => value === '' ? undefined : Number(value))
    .pipe(orthodonticCaseSchema.shape.plannedTreatmentMonths),
})

type PatientFormValues = z.input<typeof patientFormSchema>

type PatientFormProps = {
  initialCase?: OrthodonticCase
  initialPatient?: Patient
  onSubmit: (draft: PatientDraft) => void | Promise<void>
  submitLabel: string
}

export function PatientForm({ initialCase, initialPatient, onSubmit, submitLabel }: PatientFormProps) {
  const [formError, setFormError] = useState<string>()
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register,
    watch,
  } = useForm<PatientFormValues>({
    defaultValues: {
      birthDate: initialPatient?.birthDate ?? '',
      diagnosis: initialCase?.diagnosis ?? '',
      fullName: initialPatient?.fullName ?? '',
      appliance: initialCase?.appliance ?? '',
      bracesInstalledAt: initialCase?.bracesInstalledAt ?? '',
      treatmentPlan: initialCase?.treatmentPlan ?? '',
      plannedTreatmentMonths: initialCase?.plannedTreatmentMonths?.toString() ?? '',
    },
  })
  const birthDateField = register('birthDate')
  const birthDate = watch('birthDate') ?? ''
  const bracesDateField = register('bracesInstalledAt')
  const bracesInstalledAt = watch('bracesInstalledAt') ?? ''

  const submit = async (values: PatientFormValues) => {
    const result = patientFormSchema.safeParse(values)

    if (!result.success) {
      const issue = result.error.issues[0]
      setFormError(issue?.path[0] === 'plannedTreatmentMonths'
        ? 'Укажите срок лечения целым числом месяцев больше нуля'
        : issue?.message ?? 'Проверьте данные')
      return
    }

    if (result.data.bracesInstalledAt && result.data.bracesInstalledAt > todayISO()) {
      setFormError('Дата установки ортодонтического аппарата не может быть в будущем')
      return
    }
    setFormError(undefined)
    try {
      await onSubmit(result.data)
    } catch {
      setFormError('Не удалось сохранить пациента. Повторите попытку.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <section className={styles.section}>
        <h2>Пациент</h2>
        <Input error={errors.fullName?.message} label="ФИО" {...register('fullName')} autoComplete="name" />
        <div className={styles.grid}>
          <DateInput
            label="Дата рождения"
            name={birthDateField.name}
            onBlur={birthDateField.onBlur}
            onChange={birthDateField.onChange}
            value={birthDate}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Ортодонтия</h2>
        <Textarea label="Диагноз" {...register('diagnosis')} />
        <Input label="Аппарат" placeholder="Брекеты, пластинка, элайнеры…" {...register('appliance')} />
        <DateInput
          label="Дата установки ортодонтического аппарата"
          name={bracesDateField.name}
          onBlur={bracesDateField.onBlur}
          onChange={bracesDateField.onChange}
          value={bracesInstalledAt}
        />
        <Textarea label="План лечения" {...register('treatmentPlan')} />
        <Controller
          control={control}
          name="plannedTreatmentMonths"
          render={({ field }) => (
            <NumberInput
              label="Плановый срок лечения, месяцев"
              min={1}
              name={field.name}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </section>

      {formError ? <p className={styles.error} role="alert">{formError}</p> : null}

      <Button disabled={isSubmitting} icon={<Save size={18} />} type="submit">
        {isSubmitting ? 'Сохранение…' : submitLabel}
      </Button>
    </form>
  )
}
