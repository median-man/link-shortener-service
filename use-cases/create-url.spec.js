const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const validUrl = require('valid-url')
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
const longUrl = 'https://www.google.com'
const date = Date.now()
let createUrl

beforeEach(() => {
  createUrl = buildCreateUrl({
    saveUrl: db.Url.create,
    isValidUrl: validUrl.isUri,

    // mock shortid because it creates random ids
    createUrlCode: () => FAKE_SHORT_CODE,
    baseUrl: FAKE_BASE_URL
  })
})

afterEach(async () => {
  await mongoose.connection.dropDatabase()
})

test('throws if baseUrl is not a valid uri', () => {
  return expect(createUrl('notvaliduri')).rejects.toThrow(
    '"notvaliduri" is not a valid URL.'
  )
})

test('resolves promise for new url', async () => {
  const url = await createUrl(longUrl, date)
  expect(url).toEqual({
    longUrl,
    date: date.toString(),
    urlCode: FAKE_SHORT_CODE,
    shortUrl: `${FAKE_BASE_URL}/${FAKE_SHORT_CODE}`
  })
})

test('adds url to database', async () => {
  await createUrl(longUrl, date)
  const url = await db.Url.find({longUrl})
  expect(url[0]).toMatchObject({
    longUrl,
    date: date.toString(),
    urlCode: FAKE_SHORT_CODE,
    shortUrl: `${FAKE_BASE_URL}/${FAKE_SHORT_CODE}`
  })
})

test.todo('must not be an existing url with same baseUrl')
