const cardRouter = require('express').Router();
const {
  getAllCards, deleteCardById, createCard, setLike, deleteLike
} = require('../controllers/cards');

cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', setLike);
cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;
