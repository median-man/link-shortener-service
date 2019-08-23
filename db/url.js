const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: { type: String, index: true, unique: true },
  shortUrl: String,
  date: String
})

const Url = mongoose.model('Url', urlSchema)

exports.create = async data => {
  try {
    // force query to execute to catch errors
    const url = await Url.create(data)
    return url
  } catch (error) {
    if (error.code === 11000) throw new Error('Duplicate key error')
    throw error
  }
}

exports.find = async criteria => {
  return Url.find(criteria)
}
