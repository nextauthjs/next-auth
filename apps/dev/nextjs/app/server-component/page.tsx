import { getSession } from "app/auth"

export default async function Page() {
  return <pre>{JSON.stringify(await getSession(), null, 2)}</pre>
}
