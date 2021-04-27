import {
  CreateSessionError,
  GetSessionError,
  UpdateSessionError,
  DeleteSessionError,
  CreateUserError,
  GetUserByEmailError,
  GetUserByIdError,
  GetUserByProviderAccountIdError,
  UpdateUserError,
  DeleteUserError,
  CreateVerificationRequestError,
  GetVerificationRequestError,
  DeleteVerificationRequestError,
  LinkAccountError,
  UnlinkAccountError,
} from "../lib/errors"

/**
 * Takes away the error handling responsibility
 * from the actual adapter.
 * @param {import("types/adapters").Adapter | undefined} adapter
 * @return {import("types/adapters").Adapter | undefined}
 */
export default function adapterErrorHandler(adapter) {
  if (!adapter) {
    return
  }
  return function Adapter(...args) {
    const _adapter = adapter(...args)
    return {
      async getAdapter(options) {
        const _getAdapter = await _adapter.getAdapter(options)
        return {
          async getSession(...args) {
            try {
              return await _getAdapter.getSession(...args)
            } catch (error) {
              throw new GetSessionError(error)
            }
          },
          async createSession(...args) {
            try {
              return await _getAdapter.createSession(...args)
            } catch (error) {
              throw new CreateSessionError(error)
            }
          },
          async updateSession(...args) {
            try {
              return await _getAdapter.updateSession(...args)
            } catch (error) {
              throw new UpdateSessionError(error)
            }
          },
          async deleteSession(...args) {
            try {
              return await _getAdapter.deleteSession(...args)
            } catch (error) {
              throw new DeleteSessionError(error)
            }
          },
          async createUser(...args) {
            try {
              return await _getAdapter.createUser(...args)
            } catch (error) {
              throw new CreateUserError(error)
            }
          },
          async getUser(...args) {
            try {
              return await _getAdapter.getUser(...args)
            } catch (error) {
              throw new GetUserByIdError(error)
            }
          },
          async getUserByEmail(...args) {
            try {
              return await _getAdapter.getUserByEmail(...args)
            } catch (error) {
              throw new GetUserByEmailError(error)
            }
          },
          async getUserByProviderAccountId(...args) {
            try {
              return await _getAdapter.getUserByProviderAccountId(...args)
            } catch (error) {
              throw new GetUserByProviderAccountIdError(error)
            }
          },
          async deleteUser(...args) {
            try {
              return await _getAdapter.deleteUser?.(...args)
            } catch (error) {
              throw new DeleteUserError(error)
            }
          },
          async updateUser(...args) {
            try {
              return await _getAdapter.updateUser(...args)
            } catch (error) {
              throw new UpdateUserError(error)
            }
          },
          async createVerificationRequest(...args) {
            try {
              return await _getAdapter.createVerificationRequest?.(...args)
            } catch (error) {
              throw new CreateVerificationRequestError(error)
            }
          },
          async getVerificationRequest(...args) {
            try {
              return (
                (await _getAdapter.getVerificationRequest?.(...args)) ?? null
              )
            } catch (error) {
              throw new GetVerificationRequestError(error)
            }
          },
          async deleteVerificationRequest(...args) {
            try {
              return await _getAdapter.deleteVerificationRequest?.(...args)
            } catch (error) {
              throw new DeleteVerificationRequestError(error)
            }
          },
          async linkAccount(...args) {
            try {
              return await _getAdapter.linkAccount(...args)
            } catch (error) {
              throw new LinkAccountError(error)
            }
          },
          async unlinkAccont(...args) {
            try {
              return await _getAdapter.unlinkAccont?.(...args)
            } catch (error) {
              throw new UnlinkAccountError(error)
            }
          },
        }
      },
    }
  }
}
