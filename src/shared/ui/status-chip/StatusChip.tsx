import type { PropsWithChildren } from 'react'
import { Badge } from '@/shared/ui/badge/Badge'

type StatusChipProps = PropsWithChildren<{
  compact?: boolean
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent'
}>

export function StatusChip({ children, compact = false, tone = 'neutral' }: StatusChipProps) {
  return <Badge compact={compact} tone={tone}>{children}</Badge>
}
