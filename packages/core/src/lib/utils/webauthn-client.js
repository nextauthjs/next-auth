// This is the JS version of webauthn-client.ts. It is inlined in the HTML file so it needs to be JS.
// TODO: Generate programatically from webauthn-client.ts

// @ts-check

/**
 * @typedef {import("../../providers/webauthn.js").WebAuthnAction} WebAuthnAction
 * @typedef {import("../../providers/webauthn.js").WebAuthnOptionsResponseBody} WebAuthnOptionsResponseBody
 * @typedef {import("../../providers/webauthn.js").WebAuthnRegister} WebAuthnRegister
 * @typedef {import("../../providers/webauthn.js").WebAuthnAuthenticate} WebAuthnAuthenticate
 */

/**
 * The client-side script that handles the WebAuthn form.
 * 
 * @param {string} authURL - The URL of the auth API.
 * @param {string} providerID - The ID of the webauthn provider.
 */
export async function webauthnScript(authURL, providerID) {
  // @ts-expect-error
  const WebAuthnBrowser = window.SimpleWebAuthnBrowser;

  /**
   * Fetch WebAuthn options from the server.
   * 
   * @template {string | undefined} T
   * @param {T} action - Action to fetch options for.
   * @returns {Promise<T extends "authenticate" ? WebAuthnAuthenticate : T extends "register" ? WebAuthnRegister : WebAuthnAuthenticate | WebAuthnRegister>}
   */
  async function fetchOptions(action) {
    const url = new URL(`${authURL}/webauthn-options/${providerID}`);

    if (action) url.searchParams.append("action", action);

    const formFields = getFormFields();
    formFields.forEach((field) =>
      url.searchParams.append(field.name, field.value)
    );

    const res = await fetch(url);
    if (res.ok) return res.json();
    throw new Error("Failed to fetch options");
  }

  /**
   * Get the WebAuthn form from the page.
   * 
   * @returns {HTMLFormElement}
   */
  function getForm() {
    const formID = `#${providerID}-form`;
    /** @type {HTMLFormElement | null} */
    const form = document.querySelector(formID);
    if (form) return form;
    throw new Error(`Form '${formID}' not found`);
  }

  /**
   * Get formFields from the form.
   * 
   * @returns {HTMLInputElement[]}
   */
  function getFormFields() {
    const form = getForm();
    /** @type {HTMLInputElement[]} */
    const formFields = Array.from(form.querySelectorAll("input[data-form-field]"));

    return formFields;
  }

  /**
   * Passkey form submission handler.
   * 
   * @param {WebAuthnAction} action - Action to submit.
   * @param {unknown} data - Optional data to submit.
   */
  async function submitForm(action, data) {
    const form = getForm();

    if (action) {
      const actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      actionInput.value = action;
      form.appendChild(actionInput);
    }

    if (data) {
      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = JSON.stringify(data);
      form.appendChild(dataInput);
    }

    return form.submit();
  }

  /**
   * Executes the authentication flow.
   * 
   * @param {WebAuthnAuthenticate} options
   * @param {boolean} autofill - Whether or not to use the browser's autofill.
   */
  async function authenticationFlow(options, autofill) {
    const authResp = await WebAuthnBrowser.startAuthentication(options, autofill);
    return await submitForm("authenticate", authResp);
  }

  /**
   * Executes the registration flow.
   * 
   * @param {WebAuthnRegister} options
   */
  async function registrationFlow(options) {
    const formFields = getFormFields();
    formFields.forEach((field) => {
      if (field.required && !field.value) {
        throw new Error(`Missing required field: ${field.name}`);
      }
    });

    const regResp = await WebAuthnBrowser.startRegistration(options);
    return await submitForm("register", regResp);
  }

  /**
   * Attempts to authenticate the user using the browser's autofill popup on page load.
   */
  async function autofillAuthentication() {
    if (!WebAuthnBrowser.browserSupportsWebAuthnAutofill()) return;
    try {
      const res = await fetchOptions("authenticate");
      await authenticationFlow(res, true);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sets up the passkey form by overriding the form submission handler.
   */
  async function setupForm() {
    const form = getForm();

    if (!WebAuthnBrowser.browserSupportsWebAuthn()) {
      form.style.display = "none";
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const res = await fetchOptions(undefined);
        if (res.action === "authenticate") await authenticationFlow(res, false);
        else await registrationFlow(res);
      } catch (e) {
        console.error(e);
      }
    });
  }

  setupForm();
  autofillAuthentication();
}
