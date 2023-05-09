import Layout from '../components/layout'

export default function Page () {
  return (
    <Layout>
      <h1>Client Side Rendering</h1>
      <p>
        This page uses the <strong>useSession()</strong> React Hook in the <strong>&lt;/Header&gt;</strong> component.
      </p>
      <p>
        The <strong>useSession()</strong> React Hook easy to use and allows pages to render very quickly.
      </p>
      <p>
        The advantage of this approach is that session state is shared between pages by using the <strong>Provider</strong> in <strong>_app.js</strong> so
        that navigation between pages using <strong>useSession()</strong> is very fast.
      </p>
      <p>
        The disadvantage of <strong>useSession()</strong> is that it requires client side JavaScript.
      </p>
    </Layout>
  )
}
