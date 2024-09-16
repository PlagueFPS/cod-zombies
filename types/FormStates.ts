interface FormState {
  success: boolean
  message?: string
}

export interface ContactFormState extends FormState {
  errors?: {
    email?: string[]
    subject?: string[]
    body?: string[]
  }
}

export interface NewsletterFormState extends FormState {
  errors?: {
    email?: string[]
  }
}