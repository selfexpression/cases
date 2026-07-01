import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { router } from '@/app/router/router'

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
