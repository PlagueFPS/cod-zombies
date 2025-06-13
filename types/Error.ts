export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export class FetchError extends Error {
  readonly _tag = "FETCH_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ContactGetError extends Error {
  readonly _tag = "CONTACT_GET_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ContactExistsError extends Error {
  readonly _tag = "CONTACT_EXISTS_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ContactCreateError extends Error {
  readonly _tag = "CONTACT_CREATE_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ContactNotFoundError extends Error {
  readonly _tag = "CONTACT_NOT_FOUND_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class EmailSendError extends Error {
  readonly _tag = "EMAIL_SEND_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TokenVerificationError extends Error {
  readonly _tag = "TOKEN_VERIFICATION_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ContactRemoveError extends Error {
  readonly _tag = "CONTACT_REMOVE_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class BroadcastCreateError extends Error {
  readonly _tag = "BROADCAST_CREATE_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class BroadcastDataError extends Error {
  readonly _tag = "BROADCAST_DATA_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class BroadcastSendError extends Error {
  readonly _tag = "BROADCAST_SEND_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}