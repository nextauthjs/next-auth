//@ts-check

// Declare a SimpleWebAuthnBrowser variable as part of "window"

/** @typedef {"authenticate"} WebAuthnAuthenticate */
/** @typedef {"register"} WebAuthnRegister */
/** @typedef {WebAuthnRegister | WebAuthnAuthenticate} WebAuthnOptionsAction */
/**
 * @template {WebAuthnOptionsAction} T
 * @typedef {T extends WebAuthnAuthenticate ?
 *  { options: import("@simplewebauthn/types").PublicKeyCredentialRequestOptionsJSON; action: "authenticate" } :
 *  T extends WebAuthnRegister ?
 *  { options: import("@simplewebauthn/types").PublicKeyCredentialCreationOptionsJSON; action: "register" } :
 * never
 * } WebAuthnOptionsReturn
 */

/**
 * webauthnScript is the client-side script that handles the webauthn form
 *
 * @param {string} authURL is the URL of the auth API
 * @param {string} providerID is the ID of the webauthn provider
 */
export async function webauthnScript(authURL, providerID) {
  /** @type {typeof import("@simplewebauthn/browser")} */
  // @ts-ignore
  const WebAuthnBrowser = window.SimpleWebAuthnBrowser

  /**
   * Fetch webauthn options from the server
   *
   * @template {WebAuthnOptionsAction} T
   * @param {T | undefined} action action to fetch options for
   * @returns {Promise<WebAuthnOptionsReturn<T> | undefined>}
   */
  async function fetchOptions(action) {
    // Create the options URL with the action and query parameters
    const url = new URL(`${authURL}/webauthn-options/${providerID}`)

    if (action) url.searchParams.append("action", action)

    const formFields = getFormFields()
    formFields.forEach((field) => {
      url.searchParams.append(field.name, field.value)
    })

    const res = await fetch(url)
    if (!res.ok) {
      console.error("Failed to fetch options", res)

      return
    }

    return res.json()
  }

  /**
   * Get the webauthn form from the page
   *
   * @returns {HTMLFormElement}
   */
  function getForm() {
    const formID = `#${providerID}-form`
    /** @type {HTMLFormElement | null} */
    const form = document.querySelector(formID)
    if (!form) throw new Error(`Form '${formID}' not found`)

    return form
  }

  /**
   * Get formFields from the form
   *
   * @returns {HTMLInputElement[]}
   */
  function getFormFields() {
    const form = getForm()
    /** @type {HTMLInputElement[]} */
    const formFields = Array.from(
      form.querySelectorAll("input[data-form-field]")
    )

    return formFields
  }

  /**
   * Passkey form submission handler.
   * Takes the input from the form and a few other parameters and submits it to the server.
   *
   * @param {WebAuthnOptionsAction} action action to submit
   * @param {unknown | undefined} data optional data to submit
   * @returns {Promise<void>}
   */
  async function submitForm(action, data) {
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
   *
   * @param {WebAuthnOptionsReturn<WebAuthnAuthenticate>['options']} options
   * @param {boolean} autofill Whether or not to use the browser's autofill
   * @returns {Promise<void>}
   */
  async function authenticationFlow(options, autofill) {
    // Start authentication
    const authResp = await WebAuthnBrowser.startAuthentication(
      options,
      autofill
    )

    // Submit authentication response to server
    return await submitForm("authenticate", authResp)
  }

  /**
   * @param {WebAuthnOptionsReturn<WebAuthnRegister>['options']} options
   */
  async function registrationFlow(options) {
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

    const res = await fetchOptions("authenticate")
    if (!res) {
      console.error("Failed to fetch option for autofill authentication")

      return
    }

    try {
      await authenticationFlow(res.options, true)
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

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault()

        // Fetch options from the server without assuming that
        // the user is registered
        const res = await fetchOptions(undefined)
        if (!res) {
          console.error("Failed to fetch options for form submission")

          return
        }

        // Then execute the appropriate flow
        if (res.action === "authenticate") {
          try {
            await authenticationFlow(res.options, false)
          } catch (e) {
            console.error(e)
          }
        } else if (res.action === "register") {
          try {
            await registrationFlow(res.options)
          } catch (e) {
            console.error(e)
          }
        }
      })
    }
  }

  // On page load, setup the form and attempt to authenticate the user.
  setupForm()
  autofillAuthentication()
}
