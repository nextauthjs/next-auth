export interface VerifyRequestServerPageParams {
  baseUrl: string
}

export default function VerifyRequest({ baseUrl }: VerifyRequestServerPageParams) {
  return (
    <div className="verify-request">
      <h1>Check your email</h1>
      <p>A sign in link has been sent to your email address.</p>
      <p>
        <a className="site" href={baseUrl}>
          {baseUrl.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  )
}
