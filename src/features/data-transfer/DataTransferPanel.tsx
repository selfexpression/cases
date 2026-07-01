import { Download, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { clearStorage, exportStorage, importStorage } from '@/shared/storage/data-transfer'
import { Button } from '@/shared/ui/button/Button'
import styles from './DataTransferPanel.module.css'

export function DataTransferPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string>()

  const downloadBackup = () => {
    const blob = new Blob([exportStorage()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cases-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const uploadBackup = async (file?: File) => {
    if (!file) {
      return
    }

    try {
      const result = importStorage(await file.text())
      setMessage(
        `Восстановлено: ${result.patients} пациентов, ${result.visits} визитов, ${result.notes} заметок, ${result.hygieneRecords} записей гигиены`,
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось импортировать данные')
    }
  }

  return (
    <>
      <p className={styles.description}>
        Данные хранятся на этом устройстве. Чтобы восстановить их после очистки данных браузера или на новом телефоне,
        регулярно сохраняйте резервную копию.
      </p>
      <div className={styles.actions}>
        <Button icon={<Download size={16} />} onClick={downloadBackup} size="sm" variant="secondary">
          Экспорт
        </Button>
        <Button icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()} size="sm" variant="secondary">
          Импорт
        </Button>
        <Button
          icon={<RotateCcw size={16} />}
          onClick={() => {
            if (window.confirm('Очистить все локальные данные?')) {
              clearStorage()
              setMessage('Данные очищены')
            }
          }}
          size="sm"
          variant="danger"
        >
          Очистить
        </Button>
      </div>
      <input
        ref={fileInputRef}
        accept="application/json"
        className={styles.file}
        onChange={(event) => void uploadBackup(event.target.files?.[0])}
        type="file"
      />
      {message ? <p className={styles.message}>{message}</p> : null}
    </>
  )
}
