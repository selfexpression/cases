import { readStorage } from '@/shared/storage/app-store'

export const orthodonticCaseRepository = {
  getByPatientId(patientId: string) {
    return readStorage().orthodonticCases.find((orthodonticCase) => orthodonticCase.patientId === patientId)
  },
}
