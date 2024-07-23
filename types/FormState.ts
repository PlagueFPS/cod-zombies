export interface FormState {
  success: boolean
  message?: string
  errors?: {
    email?: string[]
    subject?: string[]
    body?: string[]
  }
}