import { unstable_getServerSession } from "next-auth/next"
import Layout from "../components/layout"
import { authOptions } from './api/auth/[...nextauth]';

export default function Page() {
  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  // This is possible because of the shared context configured in `_app.js` that
  // is used by `useSession()`.

  return (
    <Layout>
      <h1>Server Side Rendering</h1>
      <p>
        This page uses the <strong>unstable_getServerSession()</strong> method
        in <strong>getServerSideProps()</strong>.
      </p>
      <p>
        Using <strong>unstable_getServerSession()</strong> in{" "}
        <strong>getServerSideProps()</strong> is currently the recommended
        approach, although the API may still change, if you need to support
        Server Side Rendering with authentication.
      </p>
      <p>
        Using <strong>getSession()</strong> is still recommended on the client.
      </p>
      <p>
        The advantage of Server Side Rendering is this page does not require
        client side JavaScript.
      </p>
      <p>
        The disadvantage of Server Side Rendering is that this page is slower to
        render.
      </p>
    </Layout>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}
