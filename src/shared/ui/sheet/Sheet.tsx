import type { PropsWithChildren, ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import styles from './Sheet.module.css'

type SheetProps = PropsWithChildren<{
  onClose: () => void
  open: boolean
  title: string
  footer?: ReactNode
}>

export function Sheet({ children, footer, onClose, open, title }: SheetProps) {
  if (!open) {
    return null
  }

  return (
    <div className={styles.backdrop} role="presentation">
      <section aria-modal="true" className={styles.sheet} role="dialog">
        <header className={styles.header}>
          <h2>{title}</h2>
          <IconButton icon={<X size={20} />} label="Закрыть" onClick={onClose} />
        </header>
        <div className={styles.content}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </section>
    </div>
  )
}
