import type { InputHTMLAttributes } from 'react'
import { Input } from '@/shared/ui/input/Input'

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  error?: string
  label: string
}

export function DateInput(props: DateInputProps) {
  return <Input type="date" {...props} />
}
