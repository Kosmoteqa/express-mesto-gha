const CardSchema = require('../models/card');

module.exports.getAllCards = (req, res) => {
  CardSchema.find({}).populate(['owner', 'likes']).then((cards) => {
    if (!cards) {
      return res.status(404).send({ message: 'Карточки не найдены' });
    }
    return res.send(cards);
  })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCardById = (req, res) => {
  CardSchema.findById(req.params.cardId).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  CardSchema.create({ name, link, owner: _id }).then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы не валидные данные карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.setLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточки не найдены' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  CardSchema.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true }).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточки не найдены' });
    }
    return res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};
