const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
});

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected established to host')
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = { connectDB, sequelize }

