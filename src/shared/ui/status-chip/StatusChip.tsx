import type { PropsWithChildren } from 'react'
import { Badge } from '@/shared/ui/badge/Badge'

type StatusChipProps = PropsWithChildren<{
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent'
}>

export function StatusChip({ children, tone = 'neutral' }: StatusChipProps) {
  return <Badge tone={tone}>{children}</Badge>
}
