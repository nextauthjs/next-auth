import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ req, csrfToken, providers, callbackUrl }) => {
  const withCallbackUrl = callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
  const { email } = req.query

  // We only want to render providers
  const providersToRender = providers.filter(provider => {
    if (provider.type === 'oauth' || provider.type === 'email') {
      // Always render oauth and email type providers
      return true
    } else if (provider.type === 'credentials' && provider.credentials) {
      // Only render credentials type provider if credentials are defined
      return true
    } else {
      // Don't render other provider types
      return false
    }
  })

  return render(
    <div className='signin'>
      {providersToRender.map((provider, i) =>
        <div key={provider.id} className='provider'>
          {provider.type === 'oauth' &&
            <a className='button' data-provider={provider.id} href={`${provider.signinUrl}${withCallbackUrl}`}>Sign in with {provider.name}</a>
          }
          {(provider.type === 'email' || provider.type === 'credentials') && (i > 0)
            && providersToRender[i - 1].type !== 'email' && providersToRender[i - 1].type !== 'credentials' && 
            <hr />
          }
          {provider.type === 'email' &&
            <form action={provider.signinUrl} method='POST'>
              <input type='hidden' name='csrfToken' value={csrfToken} />
              <label for={`input-email-for-${provider.id}-provider`}>Email</label>
              <input id={`input-email-for-${provider.id}-provider`} autoFocus type='text' name='email' value={email} placeholder='email@example.com' />
              <button type='submit'>Sign in with {provider.name}</button>
            </form>}
          {provider.type === 'credentials' &&
            <form action={provider.callbackUrl} method='POST'>
              <input type='hidden' name='csrfToken' value={csrfToken} />
              {Object.keys(provider.credentials).map(credential => {
                return (
                  <div>
                    <label
                      for={`input-${credential}-for-${provider.id}-provider`}
                      >{provider.credentials[credential].label || credential}
                    </label>
                    <input
                      name={credential}
                      id={`input-${credential}-for-${provider.id}-provider`}
                      type={provider.credentials[credential].type || 'text'}
                      value={provider.credentials[credential].value || ''}
                      placeholder={provider.credentials[credential].placeholder || ''} />
                  </div>
                  )
              })}
              <button type='submit'>Sign in with {provider.name}</button>
            </form>
          }
          {(provider.type === 'email' || provider.type === 'credentials') && ((i + 1) < providersToRender.length) && 
            <hr/>
          }
        </div>
      )}
    </div>
  )
}
