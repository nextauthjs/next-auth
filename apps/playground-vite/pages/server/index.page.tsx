import type { Session } from 'next-auth'

export function Page ({ session }: { session: Session }) {
  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <>
      <h1>Server Side Rendering</h1>
      <p>
        This page uses the <strong>unstable_getServerSession()</strong> method
        in <strong>onBeforeRender()</strong> of <a href="https://vite-plugin-ssr.com/data-fetching" target="_blank">vite-plugin-ssr</a>.
      </p>
      <p>
        Using <strong>unstable_getServerSession()</strong> in{' '}
        <strong>onBeforeRender()</strong> is the recommended approach if you
        need to support Server Side Rendering with authentication.
      </p>
      <p>
        The advantage of Server Side Rendering is this page does not require
        client side JavaScript.
      </p>
      <p>
        The disadvantage of Server Side Rendering is that this page is slower to
        render.
      </p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  )
}
