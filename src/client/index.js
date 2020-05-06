import fetch from 'isomorphic-unfetch'

const session = (context) => {
  return new Promise(resolve => {
    if (context)
      return resolve(null)

    // @TODO Get hostname dynamically
    fetch('http://localhost:3000/api/auth/session')
    .then(r => r.json())
    .then(session =>{
      resolve(session)
    })
  })
}

export default {
  session
}
