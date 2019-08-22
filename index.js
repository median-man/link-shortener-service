const express = require('express')
const config = require('config')
const db = require('./db')

const app = express()

app.use(express.json({ extended: false }))

const port = config.get('PORT')

db.connect()

app.listen(port, () => console.log(`server listening on port ${port}`))
