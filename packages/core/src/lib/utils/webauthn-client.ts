import type {
  WebAuthnAction,
  WebAuthnOptionsResponseBody,
} from "../../providers/webauthn.js"

/** The client-side script that handles the WebAuthn form */
export async function webauthnScript(
  /** The URL of the auth API */
  authURL: string,
  /** The ID of the webauthn provider */
  providerID: string
) {
  // @ts-expect-error
  const WebAuthnBrowser = window.SimpleWebAuthnBrowser

  /** Fetch WebAuthn options from the server */
  async function fetchOptions<T extends WebAuthnAction>(
    /** action to fetch options for */
    action: T | undefined
  ): Promise<WebAuthnOptionsResponseBody<T>> {
    // Create the options URL with the action and query parameters
    const url = new URL(`${authURL}/webauthn-options/${providerID}`)

    if (action) url.searchParams.append("action", action)

    const formFields = getFormFields()
    formFields.forEach((field) =>
      url.searchParams.append(field.name, field.value)
    )

    const res = await fetch(url)
    if (res.ok) return res.json()
    throw new Error("Failed to fetch options")
  }

  /** Get the WebAuthn form from the page */
  function getForm(): HTMLFormElement {
    const formID = `#${providerID}-form`
    const form = document.querySelector<HTMLFormElement>(formID)
    if (form) return form
    throw new Error(`Form '${formID}' not found`)
  }

  /** Get formFields from the form */
  function getFormFields(): HTMLInputElement[] {
    const form = getForm()
    const formFields = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[data-form-field]")
    )

    return formFields
  }

  /**
   * Passkey form submission handler.
   * Takes the input from the form and a few other parameters and submits it to the server.
   */
  async function submitForm(
    /** action to submit */
    action: WebAuthnAction,
    /** optional data to submit */
    data: unknown | undefined
  ) {
    const form = getForm()

    // If a POST request, create hidden fields in the form
    // and submit it so the browser redirects on login
    if (action) {
      const actionInput = document.createElement("input")
      actionInput.type = "hidden"
      actionInput.name = "action"
      actionInput.value = action
      form.appendChild(actionInput)
    }

    if (data) {
      const dataInput = document.createElement("input")
      dataInput.type = "hidden"
      dataInput.name = "data"
      dataInput.value = JSON.stringify(data)
      form.appendChild(dataInput)
    }

    return form.submit()
  }

  /**
   * Executes the authentication flow by fetching options from the server,
   * starting the authentication, and submitting the response to the server.
   */
  async function authenticationFlow(
    options: WebAuthnOptionsResponseBody<"authenticate">,
    /** Whether or not to use the browser's autofill */
    autofill: boolean
  ) {
    // Start authentication
    const authResp = await WebAuthnBrowser.startAuthentication(
      options,
      autofill
    )

    // Submit authentication response to server
    return await submitForm("authenticate", authResp)
  }

  async function registrationFlow(
    options: WebAuthnOptionsResponseBody<"register">
  ) {
    // Check if all required formFields are set
    const formFields = getFormFields()
    formFields.forEach((field) => {
      if (field.required && !field.value) {
        throw new Error(`Missing required field: ${field.name}`)
      }
    })

    // Start registration
    const regResp = await WebAuthnBrowser.startRegistration(options)

    // Submit registration response to server
    return await submitForm("register", regResp)
  }

  /**
   * Attempts to authenticate the user when the page loads
   * using the browser's autofill popup.
   *
   * @returns {Promise<void>}
   */
  async function autofillAuthentication() {
    // if the browser can't handle autofill, don't try
    if (!WebAuthnBrowser.browserSupportsWebAuthnAutofill()) return
    try {
      const res = await fetchOptions("authenticate")
      await authenticationFlow(res, true)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Sets up the passkey form by overriding the form submission handler
   * so that it attempts to authenticate the user when the form is submitted.
   * If the user is not registered, it will attempt to register them instead.
   */
  async function setupForm() {
    const form = getForm()

    // If the browser can't do WebAuthn, hide the form
    if (!WebAuthnBrowser.browserSupportsWebAuthn()) {
      form.style.display = "none"

      return
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      try {
        // Fetch options from the server without assuming that the user is registered
        const res = await fetchOptions(undefined)
        // Then execute the appropriate flow
        if (res.action === "authenticate") await authenticationFlow(res, false)
        else await registrationFlow(res)
      } catch (e) {
        console.error(e)
      }
    })
  }

  // On page load, setup the form and attempt to authenticate the user.
  setupForm()
  autofillAuthentication()
}
