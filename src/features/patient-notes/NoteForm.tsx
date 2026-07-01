import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/shared/ui/button/Button'
import { Textarea } from '@/shared/ui/textarea/Textarea'
import styles from './NoteForm.module.css'

type NoteFormProps = {
  initialContent?: string
  onCancel?: () => void
  onSubmit: (content: string) => void
}

export function NoteForm({ initialContent = '', onCancel, onSubmit }: NoteFormProps) {
  const [content, setContent] = useState(initialContent)
  const [error, setError] = useState<string>()

  const submit = () => {
    if (!content.trim()) {
      setError('Добавьте текст заметки')
      return
    }

    onSubmit(content)
    setContent('')
    setError(undefined)
  }

  return (
    <div className={styles.form}>
      <Textarea
        error={error}
        label="Заметка"
        onChange={(event) => setContent(event.target.value)}
        value={content}
      />
      <div className={styles.actions}>
        {onCancel ? (
          <Button onClick={onCancel} variant="ghost">
            Отмена
          </Button>
        ) : null}
        <Button icon={initialContent ? <Save size={18} /> : <Plus size={18} />} onClick={submit}>
          {initialContent ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </div>
  )
}
