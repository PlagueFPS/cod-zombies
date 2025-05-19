import { type ClassValue, clsx } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CustomError {
  serverError?: string
  validationErrors?: {
    _errors?: string[];
} | undefined;
  bindArgsValidationErrors?: readonly [] | undefined;
}

export const customOnError = (error: CustomError, customErrorMessage: string) => {
  if (error.serverError) {
    toast.error(error.serverError, { position: 'bottom-right', duration: 5000 })
  }
  else if (error.validationErrors) {
    toast.error(customErrorMessage, { position: 'bottom-right', duration: 5000 })
  }
}

export const customOnSuccess = (success?: boolean, message?: string) => {
  if (success) {
    toast.success(message, { position: 'bottom-right', duration: 5000 })
  }
  else {
    toast.error(message, { position: 'bottom-right', duration: 5000 })
  }
}
