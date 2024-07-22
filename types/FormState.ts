export interface FormState {
  message?: string
  errors?: {
    email?: string[]
    subject?: string[]
    body?: string[]
  }
}