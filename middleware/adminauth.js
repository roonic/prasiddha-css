const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const adminAuth = async(req, res, next) => {
  try {
    // check if user is admin
    const isAdmin = req.user.isAdmin
    if (!isAdmin) {
      throw new UnauthenticatedError('Authentication invalid')
    }
    next()
  } 
  catch (error) {
    console.log(error)
  }
}

module.exports = adminAuth

