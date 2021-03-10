import { h } from 'preact' // eslint-disable-line no-unused-vars

export default function signout ({ baseUrl, basePath, csrfToken, locale, texts }) {
  return (
    <div className='signout'>
      <h1>{texts.heading}</h1>
      {locale &&
        <p>Locale: {locale || 'N/A'}</p>}
      <form action={`${baseUrl}${basePath}/signout`} method='POST'>
        <input type='hidden' name='csrfToken' value={csrfToken} />
        <button type='submit'>{texts.submit}</button>
      </form>
    </div>
  )
}
