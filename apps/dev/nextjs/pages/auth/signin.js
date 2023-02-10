import { useEffect, useState } from "react"
import "./style.css"

export default function() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [credentialId, setCredentialId] = useState()
  const [challenge, setChallenge] = useState(new Uint8Array(32))
  const [loginResponse, setLoginResponse] = useState()

  const isWebAuthnSupported = () => {
    return !!window.PublicKeyCredential
  }

  const isPlatformAuthenticatorSupported = () => {
    if (!isWebAuthnSupported()) {
      throw new Error("WebAuthn API is not available")
    }

    if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return false
    } else {
      return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    }
  }

  useEffect(() => {
    isPlatformAuthenticatorSupported()
  }, [])

  const registerDevice = () => {
    const publicKey = {
      challenge,
      rp: {
        name: ".domino",
        icon: "https://next-auth.js.org/img/logo/logo-sm.png",
      },
      user: {
        id: new Uint8Array(16),
        name: email,
        displayName: name,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        userVerification: "required",
      },
      status: "ok",
    }
    navigator.credentials
      .create({ publicKey })
      .then((newCredentialInfo) => {
        console.log("** REGISTRATION SUCCESS", newCredentialInfo)
        setCredentialId(newCredentialInfo.id)
      })
      .catch((error) => {
        console.log("FAIL", error)
      })
  }

  const login = () => {
    const publicKey = {
      challenge: challenge,
      allowCredentials: [
        { type: "public-key", id: Buffer.from(credentialId, "base64") },
      ],
      userVerification: "required",
      status: "ok",
    }

    navigator.credentials
      .get({ publicKey })
      .then((getAssertionResponse) => {
        console.log("** ASSERTION RECEIVED", getAssertionResponse)
        console.log(getAssertionResponse.response.authenticatorData.toString('base64'))
        console.log(getAssertionResponse.response.clientDataJSON.toString('base64'))
        console.log(getAssertionResponse.response.signature.toString('base64'))
      })
      .catch((error) => {
        console.log("FAIL", error)
      })
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <div
        style={{
          marginTop: "10vh",
          backgroundColor: "#0d1117",
          padding: "3rem",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img src="https://next-auth.js.org/img/logo/logo-sm.png" width="64" />
        <div>WebAuthn Auth.js Demo</div>
      </div>
      <div
        style={{
          backgroundColor: "#0d1117",
          padding: "3rem",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ margin: "0" }}>Step 1</h2>

        <label htmlFor="email">
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="email"
          placeholder="user@company.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="displayName">
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="displayName"
          placeholder="Joe"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button
          type="button"
          onClick={() => registerDevice()}
          disabled={!email || !name}
        >
          Register
        </button>
        {credentialId && (
          <pre
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              whiteSpace: "break-spaces",
            }}
          >
            Credential Id: {credentialId}
          </pre>
        )}
      </div>
      <div
        style={{
          backgroundColor: "#0d1117",
          padding: "3rem",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h2>Step 2</h2>
        <button type="button" onClick={() => login()} disabled={!credentialId}>
          Login
        </button>
        {loginResponse && (
          <pre
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              whiteSpace: "break-spaces",
            }}
          >
            Credential Id: {credentialId}
          </pre>
        )}
      </div>
    </div>
  )
}
