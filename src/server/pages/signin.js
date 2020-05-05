import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ providers, callbackUrl }) => {
  return render(
    <div className="signin">
      {providers.map(provider => 
        <p data-provider={provider.id}><a href={`${provider.signinUrl}?callbackUrl=${callbackUrl}`}>Sign in with {provider.name}</a></p>
      )}
    </div>
  )
}
