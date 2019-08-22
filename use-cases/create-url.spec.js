const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const db = require('../db')
const buildCreateUrl = require('./create-url')

const mongoServer = new MongoMemoryServer()

beforeAll(done => {
  mongoServer.getConnectionString().then(mongoUri => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    }

    mongoose.connect(mongoUri, mongooseOpts)

    mongoose.connection.on('error', error => {
      if (error.message.code === 'ETIMEDOUT') {
        console.log(error)
        mongoose.connect(mongoUri, mongooseOpts)
      }
      console.log(error)
    })

    mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`)
      done()
    })
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

it('throws if baseUrl is not a valid uri', () => {
  const createUrl = buildCreateUrl({ saveUrl: db.Url.create })
  return expect(createUrl('notvaliduri')).rejects.toThrow(
    '"notvaliduri" is not a valid URL.'
  )
})

it.todo('resolves promise for new url and adds it to db')
it.todo('must not be an existing url with same baseUrl')
