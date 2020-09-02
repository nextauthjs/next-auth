import jwt from 'next-auth/jwt'

const secret = process.env.SECRET

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret })
  res.send(JSON.stringify(token, null, 2))
}