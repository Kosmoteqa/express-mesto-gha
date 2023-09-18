const { getAllCards, deleteCardById, createCard } = require('../controllers/cards')

const cardRouter = require('express').Router()

cardRouter.get('/', getAllCards)
cardRouter.delete('/:cardId', deleteCardById)
cardRouter.post('/', createCard)

module.exports = cardRouter