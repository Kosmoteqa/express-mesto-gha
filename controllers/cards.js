const { errorUser } = require('../middlewares/errorCode');
const { errorId } = require('../middlewares/errorCode');
const { notFoundCode } = require('../middlewares/errorCode');
const CardSchema = require('../models/card');

module.exports.getAllCards = (req, res) => {
  CardSchema.find({}).populate(['owner', 'likes']).then((cards) => {
    return res.send(cards);
  })
    .catch(() => {
      res.status(notFoundCode).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCardById = (req, res) => {
  CardSchema.findById(req.params.cardId).then((card) => {
    if (!card) {
      return res.status(errorUser).send({ message: 'Карточка не найдена' });
    }
    return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorId).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(notFoundCode).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  CardSchema.create({ name, link, owner: _id }).then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorId).send({ message: 'Переданы не валидные данные карточки' });
      }
      return res.status(notFoundCode).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.setLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(errorUser).send({ message: 'Карточки не найдены' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorId).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(notFoundCode).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true }).then((card) => {
    if (!card) {
      return res.status(errorUser).send({ message: 'Карточки не найдены' });
    }
    return res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorId).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(notFoundCode).send({ message: 'Произошла ошибка на сервере' });
    });
};
