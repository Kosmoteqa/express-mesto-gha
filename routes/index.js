const cardRouter = require('./cards')
const userRouter = require('./users')

const router = require('express').Router()

router.use('/users', userRouter)
router.use('/cards', cardRouter)
router.use('*', (req,res) => {
  res.status(404).send({message: 'Путь не найден'})
})

module.exports = router