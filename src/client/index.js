'use strict'

import fetch from 'isomorphic-unfetch'

export default class {

  static async session() {
    return new Promise(resolve => {
      fetch('http://localhost:3000/api/auth/session')
      .then(r => r.json())
      .then(data =>{
        console.log('session', data)
        resolve(data)
      })
    })
  }

}