import { SearchField } from '@/shared/ui/search-field/SearchField'

type PatientSearchFieldProps = {
  onChange: (query: string) => void
  value: string
}

export function PatientSearchField({ onChange, value }: PatientSearchFieldProps) {
  return (
    <SearchField
      label="Поиск пациентов"
      onChange={(event) => onChange(event.target.value)}
      placeholder="ФИО, диагноз, этап"
      value={value}
    />
  )
}
