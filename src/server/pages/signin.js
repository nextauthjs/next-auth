import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ site, providers, callbackUrl }) => {
  const withCallbackUrl = callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
  return render(
    <div className='signin'>
      <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>
      {providers.map(provider => 
        <p><a className='button' data-provider={provider.id} href={`${provider.signinUrl}${withCallbackUrl}`}>Sign in with {provider.name}</a></p>
      )}
    </div>
  )
}
