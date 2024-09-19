interface FormState {
  success: boolean
  message?: string
}
export interface NewsletterFormState extends FormState {
  errors?: {
    email?: string[]
  }
}

export interface FeedbackFormState extends FormState {
  errors?: {
    title?: string[]
    email?: string[]
    name?: string[]
    label?: string[]
    feedback?: string[]
  }
}