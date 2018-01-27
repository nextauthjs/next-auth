/**
 * next-auth.functions.js Example
 *
 * This file defines functions NextAuth to look up, add and update users.
 *
 * It returns a Promise with the functions matching these signatures:
 *
 * {
 *   find: ({
 *     id,
 *     email,
 *     emailToken,
 *     provider,
 *     poviderToken
 *   } = {}) => {},
 *   update: (user) => {},
 *   insert: (user) => {},
 *   serialize: (user) => {},
 *   deserialize: (id) => {}
 * }
 *
 * Each function returns Promise.resolve() - or Promise.reject() on error.
 *
 * This specific example supports both MongoDB and NeDB, but can be refactored
 * to work with any database.
 *
 * Environment variables for this example:
 *
 * MONGO_URI=mongodb://localhost:27017/my-database
 *
 * If you wish, you can put these in a `.env` to seperate your environment 
 * specific configuration from your code.
 **/

// Load environment variables from a .env file if one exists
require('dotenv').load()

// This config file uses MongoDB for User accounts, as well as session storage.
// This config includes options for NeDB, which it defaults to if no DB URI 
// is specified. NeDB is an in-memory only database intended here for testing.
const MongoClient = require('mongodb').MongoClient
const NeDB = require('nedb')
const MongoObjectId = (process.env.MONGO_URI) ? require('mongodb').ObjectId : (id) => { return id }

// Use Node Mailer SMTP Transport for email sign in
const nodemailer = require('nodemailer')
const nodemailerSmtpTransport = require('nodemailer-smtp-transport')

module.exports = () => {
  return new Promise((resolve, reject) => {
    if (process.env.MONGO_URI) { 
      // Connect to MongoDB Database and return user connection
      MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
        if (err) return reject(err)
        const dbName = process.env.MONGO_URI.split('/').pop().split('?').shift()
        const db = mongoClient.db(dbName)
        return resolve(db.collection('users'))
      })
    } else {
      // If no MongoDB URI string specified, use NeDB, an in-memory work-a-like.
      // NeDB is not persistant and is intended for testing only.
      let collection = new NeDB({ autoload: true })
      collection.loadDatabase(err => {
        if (err) return reject(err)
        resolve(collection)
      })
    }  
  })
  .then(usersCollection => {
    return Promise.resolve({
      // If a user is not found find() should return null (with no error).
      find: ({id, email, emailToken, provider} = {}) => {
        let query = {}
 
        // Find needs to support looking up a user by ID, Email, Email Token,
        // and Provider Name + Users ID for that Provider
        if (id) {
          query = { _id: MongoObjectId(id) }
        } else if (email) {
          query = { email: email }
        } else if (emailToken) {
          query = { emailToken: emailToken }
        } else if (provider) {
          query = { [`${provider.name}.id`]: provider.id }                
        }

        return new Promise((resolve, reject) => {
          usersCollection.findOne(query, (err, user) => {
            if (err) return reject(err)
            return resolve(user)
          })
        })
      },
      insert: (user) => {
        return new Promise((resolve, reject) => {
          usersCollection.insert(user, (err, response) => {
            if (err) return reject(err)

            // Mongo Client automatically adds an id to an inserted object, but 
            // if using a work-a-like we may need to add it from the response.
            if (!user._id && response._id) user._id = response._id
  
            return resolve(user)
          })
        })
      },
      update: (user) => {
        return new Promise((resolve, reject) => {
          usersCollection.update({_id: user._id}, user, {}, (err) => {
            if (err) return reject(err)
            return resolve(user)
          })
        })
      },
      remove: (id) => {
        return new Promise((resolve, reject) => {
          usersCollection.remove({_id: id}, (err) => {
            if (err) return reject(err)
            return resolve(true)
          })
        })
      },
      // Seralize turns the value of the ID key from a User object
      serialize: (user) => {
        // Supports serialization from Mongo Object *and* deserialize() object
        if (user.id) {
          return Promise.resolve(user.id) 
        } else if (user._id) {
          return Promise.resolve(user._id) 
        } else {
          return Promise.reject(new Error("Unable to serialise user"))
        }
      },
      // Deseralize turns a User ID into a normalized User object that is
      // exported to clients. It should not return private/sensitive fields.
      deserialize: (id) => {
        return new Promise((resolve, reject) => {
          usersCollection.findOne({ _id: MongoObjectId(id) }, (err, user) => {
            if (err) return reject(err)

            // If user not found (e.g. account deleted) return null object
            if (!user) return resolve(null)

            return resolve({
              id: user._id,
              name: user.name,
              email: user.email,
              emailVerified: user.emailVerified,
              admin: user.admin || false
            })
          })
        })
      },
      // Define method for sending links for signing in over email.
      sendSignInEmail: ({
        email = null,
        url = null
        } = {}) => {
        nodemailer
        .createTransport(nodemailerSmtpTransport({
          host: process.env.EMAIL_SERVER,
          port: process.env.EMAIL_PORT || 25,
          secure: true,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        }))
        .sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: 'Sign in link',
          text: `Use the link below to sign in:\n\n${url}\n\n`,
          html: `<p>Use the link below to sign in:</p><p>${url}</p>`
        }, (err) => {
          if (err) {
            console.error('Error sending email to ' + email, err)
          }
        })
        if (process.env.NODE_ENV === 'development')  {
          console.log('Generated sign in link ' + url + ' for ' + email)
        }   
      },
    })
  })
}