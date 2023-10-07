const { errorUser, errorForbidden } = require('../middlewares/errorCode');
const { errorId } = require('../middlewares/errorCode');
const CardSchema = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  CardSchema.find({}).populate(['owner', 'likes']).then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  CardSchema.findById(req.params.cardId).then((card) => {
    if (!card) {
      throw res.status(errorUser).send({ message: 'Карточка не найдена' });
    }
    if (!card.owner.equals(req.user._id)) {
      throw res.status(errorForbidden).send({ message: 'Доступ запрещен' });
    }
    card.deleteOne().then(() => res.send({ message: 'Карточка удалена' })).catch(next);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(errorId).send({ message: 'Передан не коррекный ID' }));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  CardSchema.create({ name, link, owner: _id }).then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(errorId).send({ message: 'Переданы не валидные данные карточки' }));
      } else {
        next(err);
      }
    });
};

module.exports.setLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw res.status(errorUser).send({ message: 'Карточки не найдены' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(errorId).send({ message: 'Передан не коррекный ID' }));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true }).then((card) => {
    if (!card) {
      throw res.status(errorUser).send({ message: 'Карточки не найдены' });
    }
    res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(errorId).send({ message: 'Передан не коррекный ID' }));
      } else {
        next(err);
      }
    });
};
