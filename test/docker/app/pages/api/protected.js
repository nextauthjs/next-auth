import { getSession } from 'next-auth/client'

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    res.send({ content: 'Protected content.' })
  } else {
    res.send({ content: 'Unprotected content.' })
  }
}
