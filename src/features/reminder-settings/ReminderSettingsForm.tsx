import { useState } from 'react'
import { settingsRepository } from '@/entities/settings/settings-repository'
import { NumberInput } from '@/shared/ui/number-input/NumberInput'

export function ReminderSettingsForm() {
  const settings = settingsRepository.get()
  const [returnReminderLeadWeeks, setReturnReminderLeadWeeks] = useState(settings.returnReminderLeadWeeks.toString())

  const updateReturnReminderLeadWeeks = (value: string) => {
    setReturnReminderLeadWeeks(value)
    const numericValue = Number(value)

    if (Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 52) {
      settingsRepository.update({ returnReminderLeadWeeks: numericValue })
    }
  }

  return (
    <NumberInput
      label="Предупреждать о возврате за, недель"
      max={52}
      min={0}
      onValueChange={updateReturnReminderLeadWeeks}
      value={returnReminderLeadWeeks}
    />
  )
}
