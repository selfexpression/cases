import { useState } from 'react'
import { settingsRepository } from '@/entities/settings/settings-repository'
import { Input } from '@/shared/ui/input/Input'

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
    <Input
      label="Предупреждать о возврате за, недель"
      max={52}
      min={0}
      onChange={(event) => updateReturnReminderLeadWeeks(event.target.value)}
      type="number"
      value={returnReminderLeadWeeks}
    />
  )
}
