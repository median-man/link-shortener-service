const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: String
})

const Url = mongoose.model('Url', urlSchema)

exports.create = async data => {
  return Url.create(data)
}

exports.find = async criteria => {
  return Url.find(criteria)
}
