import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { formatHumanDate } from '@/shared/lib/date/date'
import { Button } from '@/shared/ui/button/Button'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import { Sheet } from '@/shared/ui/sheet/Sheet'
import { NoteForm } from '@/features/patient-notes/NoteForm'
import { noteRepository } from '@/entities/note/note-repository'
import type { PatientNote } from '@/entities/note/types'
import styles from './PatientNotesList.module.css'

type PatientNotesListProps = {
  notes: PatientNote[]
  patientId: string
}

export function PatientNotesList({ notes, patientId }: PatientNotesListProps) {
  const [editedNote, setEditedNote] = useState<PatientNote>()
  const [isCreating, setIsCreating] = useState(false)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Заметки</h2>
        <Button icon={<Plus size={18} />} onClick={() => setIsCreating(true)} variant="secondary">
          Добавить
        </Button>
      </div>

      <div className={styles.list}>
        {notes.length ? (
          notes.map((note) => (
            <article className={styles.note} key={note.id}>
              <p>{note.content}</p>
              <footer>
                <span>{formatHumanDate(note.createdAt.slice(0, 10))}</span>
                <div>
                  <IconButton icon={<Pencil size={17} />} label="Редактировать заметку" onClick={() => setEditedNote(note)} />
                  <IconButton
                    icon={<Trash2 size={17} />}
                    label="Удалить заметку"
                    onClick={() => noteRepository.delete(note.id)}
                  />
                </div>
              </footer>
            </article>
          ))
        ) : (
          <p className={styles.muted}>Заметок пока нет</p>
        )}
      </div>

      <Sheet onClose={() => setIsCreating(false)} open={isCreating} title="Новая заметка">
        <NoteForm
          onCancel={() => setIsCreating(false)}
          onSubmit={(content) => {
            noteRepository.create(patientId, content)
            setIsCreating(false)
          }}
        />
      </Sheet>

      <Sheet onClose={() => setEditedNote(undefined)} open={Boolean(editedNote)} title="Редактировать заметку">
        {editedNote ? (
          <NoteForm
            initialContent={editedNote.content}
            onCancel={() => setEditedNote(undefined)}
            onSubmit={(content) => {
              noteRepository.update(editedNote.id, content)
              setEditedNote(undefined)
            }}
          />
        ) : null}
      </Sheet>
    </section>
  )
}
