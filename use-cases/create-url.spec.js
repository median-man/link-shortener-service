const validUrl = require('valid-url')
const { createTestDb } = require('../__test__/fixtures')
const db = require('../db')
const buildCreateUrl = require('./create-url')

const testDb = createTestDb()

beforeAll(() => testDb.connect())
afterAll(() => testDb.close())

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

afterEach(testDb.drop)

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
  const url = await db.Url.find({ longUrl })
  expect(url[0]).toMatchObject({
    longUrl,
    date: date.toString(),
    urlCode: FAKE_SHORT_CODE,
    shortUrl: `${FAKE_BASE_URL}/${FAKE_SHORT_CODE}`
  })
})
