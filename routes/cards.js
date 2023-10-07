const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, deleteCardById, createCard, setLike, deleteLike
} = require('../controllers/cards');
const { URLREGEX } = require('../middlewares/validation');

cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
  })
}), deleteCardById);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URLREGEX)
  })
}), createCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
  })
}), setLike);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
  })
}), deleteLike);

module.exports = cardRouter;
