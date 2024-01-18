require('dotenv').config()
require('express-async-errors')
const express = require('express')
const { sequelize, connectDB } = require('./database/connectdb')
const authRouter = require('./routes/auth')
const authMiddleware = require('./middleware/authentication')

const app = express()

app.use(express.json())

app.use('/', authRouter)
app.use('/api/v1', authMiddleware, eventsRouter)
const port = process.env.PORT || 8000

const start = async () => {
  try {
    await connectDB()
    await sequelize.sync()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}.....`)
    })
  }
  catch (error) {
    console.log(error)
  }
}

start()
