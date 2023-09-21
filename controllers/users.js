const UserSchema = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  UserSchema.find({}).then((users) => {
    if (!users) {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    return res.send(users);
  })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.getUserById = (req, res) => {
  UserSchema.findById(req.params.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан не коррекный ID' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserSchema.create({ name, about, avatar }).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы не валидные данные пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  UserSchema.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы не коррекныые данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  UserSchema.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы не коррекныые данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};
