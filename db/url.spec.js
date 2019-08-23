const { createTestDb } = require('../__test__/fixtures')
const Url = require('./url')

const testDb = createTestDb()

beforeAll(testDb.connect)
afterAll(testDb.close)

test('longUrl must be unique', async () => {
  const document = { longUrl: 'https://www.google.com' }
  await Url.create(document)

  return expect(Url.create(document)).rejects.toThrow('Duplicate key error')
})
