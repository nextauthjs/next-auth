/**
 * Same as the default `Error`, but it is JSON serializable.
 * @source https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
 */
export class UnknownError extends Error {}
export class OAuthCallbackError extends UnknownError {}
export class AccountNotLinkedError extends UnknownError {}
export class CreateUserError extends UnknownError {}
export class GetUserError extends UnknownError {}
export class GetUserByEmailError extends UnknownError {}
export class GetUserByIdError extends UnknownError {}
export class GetUserByProviderAccountIdError extends UnknownError {}
export class UpdateUserError extends UnknownError {}
export class DeleteUserError extends UnknownError {}
export class LinkAccountError extends UnknownError {}
export class UnlinkAccountError extends UnknownError {}
export class CreateSessionError extends UnknownError {}
export class GetSessionError extends UnknownError {}
export class UpdateSessionError extends UnknownError {}
export class DeleteSessionError extends UnknownError {}
export class CreateVerificationRequestError extends UnknownError {}
export class GetVerificationRequestError extends UnknownError {}
export class DeleteVerificationRequestError extends UnknownError {}
