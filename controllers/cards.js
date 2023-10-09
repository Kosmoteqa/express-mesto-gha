const NotFound = require('../errors/notFound');
const CardSchema = require('../models/card');
const Forbidden = require('../errors/forbidden');
const BadReq = require('../errors/badReq');

module.exports.getAllCards = (req, res, next) => {
  CardSchema.find({}).populate(['owner', 'likes']).then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  CardSchema.findById(req.params.cardId).then((card) => {
    if (!card) {
      throw new NotFound('Карточка не найдена');
    }
    if (!card.owner.equals(req.user._id)) {
      throw new Forbidden('Доступ запрещен');
    }
    card.deleteOne().then(() => res.send({ message: 'Карточка удалена' })).catch(next);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReq('Передан не коррекный ID'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  CardSchema.create({ name, link, owner: _id }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReq('Переданы не валидные данные карточки'));
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
        throw new NotFound('Карточки не найдены');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReq('Передан не коррекный ID'));
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
      throw new NotFound('Карточки не найдены');
    }
    res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReq('Передан не коррекный ID'));
      } else {
        next(err);
      }
    });
};
