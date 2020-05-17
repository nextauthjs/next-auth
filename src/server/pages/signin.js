import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ req, csrfToken, providers, callbackUrl }) => {
  const withCallbackUrl = callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
  const { email } = req.query
  return render(
    <div className='signin'>
      {providers.map((provider, i) =>
        <p key={provider.id}>
          {provider.type === 'oauth' && <a className='button' data-provider={provider.id} href={`${provider.signinUrl}${withCallbackUrl}`}>Sign in with {provider.name}</a>}
          {provider.type === 'email' &&
            <form action={provider.signinUrl} method='POST'>
              {i > 0 && <hr />}
              <input type='hidden' name='csrfToken' value={csrfToken} />
              <input autoFocus type='text' name='email' value={email} placeholder='email@example.com' />
              <button type='submit'>Sign in with {provider.name}</button>
              {(i + 1) < providers.length && <hr />}
            </form>}
        </p>
      )}
    </div>
  )
}
