import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import { toast } from "sonner"
import { z } from "zod"

export class ActionError extends Error {}

export const createAction = createSafeActionClient({
  defineMetadataSchema: () => z.object({
    actionName: z.string(),
  }),
  handleServerError: (error) => {
    console.error(error)

    if (error instanceof ActionError) {
      return error.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  }
})

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