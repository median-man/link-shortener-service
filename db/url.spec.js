const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const Url = require('./url')

const mongoServer = new MongoMemoryServer()

beforeAll(done => {
  mongoServer.getConnectionString().then(mongoUri => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
      useCreateIndex: true
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

test('longUrl must be unique', async () => {
  const document = { longUrl: 'https://www.google.com' }
  await Url.create(document)

  return expect(Url.create(document)).rejects.toThrow('Duplicate key error')
})
