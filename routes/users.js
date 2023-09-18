const { getAllUsers, getUserById, createUser } = require('../controllers/users')

const userRouter = require('express').Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:userId', getUserById)
userRouter.post('/', createUser)

module.exports = userRouter