const router = require('express').Router();
const NotFound = require('../errors/notFound');
const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Путь не найден'));
});

module.exports = router;
