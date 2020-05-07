import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ providers, callbackUrl }) => {
  return render(
    <div className="signin">
      {providers.map(provider => 
        <p><a data-provider={provider.id} href={`${provider.signinUrl}?callbackUrl=${callbackUrl}`}>Sign in with {provider.name}</a></p>
      )}
      <p><small><a href={process.env.SITE_NAME}>{process.env.SITE_NAME}</a></small></p>
    </div>
  )
}
