const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

function createTestDb() {
  const mongoServer = new MongoMemoryServer()

  function connect() {
    return new Promise(resolve => {
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
          resolve()
        })
      })
    })
  }

  async function close() {
    await mongoose.disconnect()
    await mongoServer.stop()
  }

  function drop() {
    return mongoose.connection.dropDatabase()
  }

  return { connect, close, drop }
}

module.exports = createTestDb
