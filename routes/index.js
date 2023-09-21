const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

module.exports = router;
