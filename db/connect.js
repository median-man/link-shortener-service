const mongoose = require('mongoose')
const config = require('config')
const mongoUri = config.get('mongoURI')

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
  } catch (error) {
    console.error(`There was an error connecting to MongoDB at ${mongoUri}.`)
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
