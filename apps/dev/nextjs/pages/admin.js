import Layout from "components/layout"

export default function Page() {
  return (
    <Layout>
      <h1>
        Admin only page (protected by middleware)
      </h1>
    </Layout>
  )
}
