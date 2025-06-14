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

export class ContactExistsError extends Error {
  readonly _tag = "CONTACT_EXISTS_ERROR"
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

export class TokenVerificationError extends Error {
  readonly _tag = "TOKEN_VERIFICATION_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TokenExpirationError extends Error {
  readonly _tag = "TOKEN_EXPIRATION_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class InvalidUnsubscribeLinkError extends Error {
  readonly _tag = "INVALID_UNSUBSCRIBE_LINK_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ExpiredUnsubscribeLinkError extends Error {
  readonly _tag = "EXPIRED_UNSUBSCRIBE_LINK_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class InvalidSubscribeLinkError extends Error {
  readonly _tag = "INVALID_SUBSCRIBE_LINK_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ExpiredSubscribeLinkError extends Error {
  readonly _tag = "EXPIRED_SUBSCRIBE_LINK_ERROR"
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

export class UpstreamProviderError extends Error {
  readonly _tag = "UPSTREAM_PROVIDER_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class EntryNotFoundError extends Error {
  readonly _tag = "ENTRY_NOT_FOUND_ERROR"
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}