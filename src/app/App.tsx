import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { router } from '@/app/router/router'
import { hydrateStorage } from '@/shared/storage/app-store'

export function App() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    void hydrateStorage().finally(() => setIsHydrated(true))
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
