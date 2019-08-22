const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const validUrl = require('valid-url')
const shortid = require('shortid')
const db = require('../db')
const buildCreateUrl = require('./create-url')

const mongoServer = new MongoMemoryServer()

beforeAll(done => {
  mongoServer.getConnectionString().then(mongoUri => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true
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

const FAKE_SHORT_CODE = 'aaa'
const FAKE_BASE_URL = 'http://localhost:5000'
let createUrl

beforeEach(() => {
  createUrl = buildCreateUrl({
    saveUrl: db.Url.create,
    isValidUrl: validUrl.isUri,
    createUrlCode: () => FAKE_SHORT_CODE,
    baseUrl: FAKE_BASE_URL
  })
})

it('throws if baseUrl is not a valid uri', () => {
  return expect(createUrl('notvaliduri')).rejects.toThrow(
    '"notvaliduri" is not a valid URL.'
  )
})

it.skip('resolves promise for new url and adds it to db', async () => {
  const date = Date.now()
  const url = await createUrl('https://www.google.com', date)
  expect(url).toEqual({
    longUrl: 'https://www.google.com',
    date: date.toString(),
    urlCode: FAKE_SHORT_CODE,
    shortUrl: `${FAKE_BASE_URL}/${FAKE_SHORT_CODE}`
  })

  // TODO:
  // use findUrl to assert that url was added to the db
})
it.todo('must not be an existing url with same baseUrl')
