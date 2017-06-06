const Hapi = require('hapi')
const Inert = require('inert');
const fs = require('fs-promise')
const hashAvatar = require('hash-avatar')

const app = new Hapi.Server()

app.connection({ port: 3000 })

const routes = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (req, res) => {
        res('You need to supply an uid. Available:\nGET /:uid\n\ne.g. GET /bukinoshita')
        .type('text/plain')
      }
    }
  },
  {
    method: 'GET',
    path: '/{uid}',
    config: {
      handler: (req, res) => {
        const { uid } = req.params

        res(hashAvatar(uid))
      }
    }
  }
]

app.register([ Inert ], (err) => {
  if (err) console.log(err)
  app.route(routes)
})

app.on('response', ({ payload, info, method, url, response }) => {
  console.log(`Payload: ${JSON.stringify(payload)}`)
  console.log(`${info.remoteAddress}: ${method.toUpperCase()} ${url.path} --> ${response.statusCode}`)
})

app.start((err) => {
  if (err) throw err
})

module.exports = app
