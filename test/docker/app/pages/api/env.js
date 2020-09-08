export default (req, res) => {
  res.send(JSON.stringify(process.env, null, 2))
}
