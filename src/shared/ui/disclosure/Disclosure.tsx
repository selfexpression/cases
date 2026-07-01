import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import styles from './Disclosure.module.css'

type DisclosureProps = {
  children: ReactNode
  defaultOpen?: boolean
  title: string
}

export function Disclosure({ children, defaultOpen = false, title }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section className={styles.disclosure}>
      <button aria-expanded={isOpen} className={styles.trigger} onClick={() => setIsOpen((value) => !value)} type="button">
        <span>{title}</span>
        <ChevronDown className={isOpen ? styles.openIcon : styles.icon} size={20} />
      </button>
      {isOpen ? <div className={styles.content}>{children}</div> : null}
    </section>
  )
}
