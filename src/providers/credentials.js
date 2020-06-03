export default options => {
  return {
    id: 'credentials',
    type: 'credentials',
    name: 'Credentials',
    verificationCallback,
    ...options
  }
}

const verificationCallback = ({ recipient, url, token, site, provider }) => {
  return new Promise((resolve, reject) => {
    console.log('verificationCallback')
  })
}
