const User = require('../models/User')
const StatusCodes = require('http-status-codes')
const {BadRequestError} = require('../errors')
const bcrypt = require('bcrypt')
const Transaction = require('../models/Transactions')

const getAllUsers = async (req, res) => {
  try {
    const queryObject = {}
    if (req.user.isAdmin) {
    const { username } = req.query
  
    if (username) {
      queryObject.username = { [Op.like]: username + '%'}
    }
  }
  else {
    queryObject.id = req.user.userId
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  let result = await User.findAll({
    where: queryObject,
    attributes: [
      'username', 'email', 'id' 
    ],
    offset: skip,
    limit: limit
  })
    // console.log(result)

    res.status(StatusCodes.OK).json({result, nbHits: result.length})
  }
  catch(err) {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err})
  }
}

const updateUser = async(req, res) => {
  try {
    const queryObject = {}
    const { 
      body: { username, email, password },
      user: {userId}   
    } = req

    if (!username && !email && !password) {
      throw new BadRequestError('fields cannot be empty')
    }

    if (username) {
      queryObject.username = username
    }
    if (email) {
      queryObject.email = email
    }
    if (password) {
      queryObject.password = password
    }

    const result = await User.update({...queryObject}, {
        where: {
        id: userId
      }
    })

    res.status(StatusCodes.OK).json({result})

  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error})
  }
}

const deleteUser = async(req, res) => {
  try {
    const queryObject = {}
    const { 
      body: {password},
      user: {userId}
    } = req

    if (!password) {
      throw new BadRequestError('Password Required to delete user')
    }

    const user = await User.findByPk(userId)
    const passwordCorrect = await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    const deleteReferences = await Transaction.destroy({
      where: {
        userId: userId
      }
    })
    console.log(deleteReferences)
    const result = await User.destroy({
      where: {
        id: userId
      }
    })
    res.status(StatusCodes.OK).json({result})
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error})
  }
}

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser
}
