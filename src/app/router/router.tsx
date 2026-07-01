import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/widgets/app-shell/AppShell'
import { PatientCreatePage } from '@/pages/patient-create/PatientCreatePage'
import { PatientDetailsPage } from '@/pages/patient-details/PatientDetailsPage'
import { PatientEditPage } from '@/pages/patient-edit/PatientEditPage'
import { PatientsListPage } from '@/pages/patients-list/PatientsListPage'
import { RemindersPage } from '@/pages/reminders/RemindersPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <PatientsListPage /> },
      { path: '/patients/new', element: <PatientCreatePage /> },
      { path: '/patients/:patientId', element: <PatientDetailsPage /> },
      { path: '/patients/:patientId/edit', element: <PatientEditPage /> },
      { path: '/reminders', element: <RemindersPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
