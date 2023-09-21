const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, createUser, editProfile, editAvatar
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', editProfile);
userRouter.patch('/me/avatar', editAvatar);

module.exports = userRouter;
