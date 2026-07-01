export type StorageAdapter<TValue> = {
  read: () => TValue
  write: (value: TValue) => void
  reset: () => void
}
