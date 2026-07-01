import { createId } from '@/shared/lib/id/create-id'
import { readStorage, updateStorage } from '@/shared/storage/app-store'
import { DEFAULT_CLINIC_ID } from '@/shared/storage/default-storage'
import type { Clinic } from './types'

function nowISO() {
  return new Date().toISOString()
}

function cleanName(name: string) {
  return name.trim()
}

function getFallbackClinicId(clinics: Clinic[]) {
  return clinics[0]?.id ?? DEFAULT_CLINIC_ID
}

export const clinicRepository = {
  getAll() {
    return [...readStorage().clinics].sort((first, second) => first.name.localeCompare(second.name))
  },
  getActive() {
    const storage = readStorage()
    return storage.clinics.find((clinic) => clinic.id === storage.settings.activeClinicId) ?? storage.clinics[0]
  },
  getActiveId() {
    const storage = readStorage()
    return storage.clinics.some((clinic) => clinic.id === storage.settings.activeClinicId)
      ? storage.settings.activeClinicId
      : getFallbackClinicId(storage.clinics)
  },
  create(name: string) {
    const cleanedName = cleanName(name)

    if (!cleanedName) {
      return undefined
    }

    const timestamp = nowISO()
    const clinic: Clinic = {
      id: createId(),
      name: cleanedName,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    updateStorage((storage) => ({
      ...storage,
      clinics: [...storage.clinics, clinic],
      settings: {
        ...storage.settings,
        activeClinicId: clinic.id,
      },
    }))

    return clinic
  },
  rename(clinicId: string, name: string) {
    const cleanedName = cleanName(name)

    if (!cleanedName) {
      return
    }

    updateStorage((storage) => ({
      ...storage,
      clinics: storage.clinics.map((clinic) =>
        clinic.id === clinicId ? { ...clinic, name: cleanedName, updatedAt: nowISO() } : clinic,
      ),
    }))
  },
  setActive(clinicId: string) {
    updateStorage((storage) => {
      const nextActiveClinicId = storage.clinics.some((clinic) => clinic.id === clinicId)
        ? clinicId
        : getFallbackClinicId(storage.clinics)

      return {
        ...storage,
        settings: {
          ...storage.settings,
          activeClinicId: nextActiveClinicId,
        },
      }
    })
  },
  deleteEmpty(clinicId: string) {
    updateStorage((storage) => {
      const hasPatients = storage.patients.some((patient) => patient.clinicId === clinicId)

      if (hasPatients || storage.clinics.length <= 1) {
        return storage
      }

      const clinics = storage.clinics.filter((clinic) => clinic.id !== clinicId)
      const activeClinicId =
        storage.settings.activeClinicId === clinicId ? getFallbackClinicId(clinics) : storage.settings.activeClinicId

      return {
        ...storage,
        clinics,
        settings: {
          ...storage.settings,
          activeClinicId,
        },
      }
    })
  },
}
