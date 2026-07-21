import type { FetcherWithComponents, FormMethod } from "@remix-run/react"
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  type MutableRefObject,
} from "react"
import type {
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
} from "next-auth/react"
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"
import { useFetcher } from "@remix-run/react"

export function RemixAuthJsFormComp(
  {
    fetcher,
    action,
    providerId,
    children,
    basePath = "/auth",
    method = "post",
  }: React.PropsWithChildren<{
    fetcher?: FetcherWithComponents<any>
    action: string
    providerId?: string
    basePath?: string
    method?: FormMethod
  }>,
  ref?: ForwardedRef<HTMLFormElement>
) {
  const form = useRef<HTMLFormElement>(null)
  const csrfFetcher = useFetcher()
  const pathname = `${basePath}/${action}${providerId ? `/${providerId}` : ""}`
  const submitting = useRef(false)
  const defaultFetcher = useFetcher()
  const actionFetcher = fetcher ?? defaultFetcher
  const csrfToken = csrfFetcher.data?.csrfToken
  useEffect(() => {
    if (
      (method.toLowerCase() !== "post" || csrfToken) &&
      csrfFetcher.state === "idle" &&
      actionFetcher.state === "idle" &&
      submitting.current &&
      form.current
    ) {
      const formData = new FormData(form.current)
      formData.append("csrfToken", csrfToken)
      formData.append("blockHtmlReturn", "true")
      actionFetcher.submit(formData, {
        method,
        action: pathname,
      })
      submitting.current = false
    }
  }, [actionFetcher, csrfFetcher.state, csrfToken, method, pathname])

  return (
    <actionFetcher.Form
      ref={(element: any) => {
        if (element) {
          ;(form as MutableRefObject<HTMLFormElement>).current = element
        }
        if (typeof ref === "function") {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      }}
      method="get"
      action={pathname}
      onSubmit={(e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (!submitting.current && method.toLowerCase() === "post") {
          csrfFetcher.load(`${basePath}/csrf`)
        }
        submitting.current = true
      }}
    >
      {children}
    </actionFetcher.Form>
  )
}

export const RemixAuthJsForm = forwardRef(RemixAuthJsFormComp)

function SignInFormComp<
  P extends RedirectableProviderType | undefined = undefined
>(
  {
    fetcher,
    providerId,
    options = {},
    authorizationParams = {},
    basePath,
    children,
  }: React.PropsWithChildren<{
    fetcher?: FetcherWithComponents<any>
    providerId?: LiteralUnion<
      P extends RedirectableProviderType
        ? P | BuiltInProviderType
        : BuiltInProviderType
    >
    options?: SignInOptions
    authorizationParams?: SignInAuthorizationParams
    basePath?: string
  }>,
  ref?: ForwardedRef<HTMLFormElement>
) {
  const params = new URLSearchParams(authorizationParams)
  return (
    <RemixAuthJsForm
      fetcher={fetcher}
      providerId={providerId}
      basePath={basePath}
      action="signin"
      method="post"
      ref={ref}
    >
      {Object.entries(options).map(
        ([key, value]: [
          string,
          string | number | readonly string[] | undefined
        ]) => (
          <input type="hidden" name={`${key}`} value={value} key={key} />
        )
      )}
      {Object.entries(params).map(([key, value]) => (
        <input type="hidden" name={`${key}`} value={value} key={key} />
      ))}
      {children}
    </RemixAuthJsForm>
  )
}
export const SignInForm = forwardRef(SignInFormComp)

function SignOutFormComp(
  {
    fetcher,
    options = {},
    basePath,
    children,
  }: React.PropsWithChildren<{
    fetcher?: FetcherWithComponents<any>
    options?: SignOutParams
    basePath?: string
  }>,
  ref?: ForwardedRef<HTMLFormElement>
) {
  return (
    <RemixAuthJsForm
      fetcher={fetcher}
      basePath={basePath}
      action="signout"
      method="post"
      ref={ref}
    >
      {Object.entries(options).map(
        ([key, value]: [
          string,
          string | number | readonly string[] | undefined
        ]) => (
          <input type="hidden" name={`${key}`} value={value} key={key} />
        )
      )}
      {children}
    </RemixAuthJsForm>
  )
}
export const SignOutForm = forwardRef(SignOutFormComp)
