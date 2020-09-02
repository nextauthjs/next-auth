import Package from 'next-auth/package.json'

export default (req, res) => {
  res.send(Package.version)
}
