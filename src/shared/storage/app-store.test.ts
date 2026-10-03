import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultStorage } from './default-storage'
import { indexedDbAdapter } from './indexed-db-adapter'
import { readStorage, writeStorage, updateStoragePersisted } from './app-store'

vi.mock('./indexed-db-adapter', () => ({ indexedDbAdapter: { write: vi.fn(), read: vi.fn() } }))

describe('storage writes', () => {
  beforeEach(async () => {
    vi.mocked(indexedDbAdapter.write).mockReset().mockResolvedValue(undefined)
    await writeStorage(structuredClone(defaultStorage))
  })

  it('resolves only when persistence completes and serializes writes', async () => {
    let finish!: () => void
    vi.mocked(indexedDbAdapter.write).mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve }))
    const first = updateStoragePersisted((s) => ({ ...s, settings: { ...s.settings, themeMode: 'dark' } }))
    const second = updateStoragePersisted((s) => ({ ...s, settings: { ...s.settings, accentColor: 'rose' } }))
    const completed = vi.fn()
    void second.then(completed)
    await Promise.resolve()
    expect(completed).not.toHaveBeenCalled()
    expect(indexedDbAdapter.write).toHaveBeenCalledTimes(2)
    finish()
    await Promise.all([first, second])
    expect(completed).toHaveBeenCalledOnce()
    expect(indexedDbAdapter.write).toHaveBeenLastCalledWith(expect.objectContaining({ settings: expect.objectContaining({ themeMode: 'dark', accentColor: 'rose' }) }))
  })

  it('rejects failed saves, restores the last persisted state, and allows retry', async () => {
    vi.mocked(indexedDbAdapter.write).mockRejectedValueOnce(new Error('Quota exceeded'))
    await expect(updateStoragePersisted((s) => ({ ...s, patients: [{ id: 'p', clinicId: 'default-clinic', fullName: 'Тест', createdAt: '', updatedAt: '' }] }))).rejects.toThrow('Quota exceeded')
    expect(readStorage().patients).toEqual([])
    await updateStoragePersisted((s) => ({ ...s, settings: { ...s.settings, themeMode: 'dark' } }))
    expect(readStorage().settings.themeMode).toBe('dark')
  })
})
