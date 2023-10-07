const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorUser, errorUnauthorized, errorConflict } = require('../middlewares/errorCode');
const { errorId } = require('../middlewares/errorCode');
const UserSchema = require('../models/user');

module.exports.getAllUsers = (req, res, next) => {
  UserSchema.find({}).then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  UserSchema.findById(req.params.userId).then((user) => {
    if (!user) {
      throw res.status(errorUser).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => {
      UserSchema.create({
        name, about, avatar, email, password: hashPassword
      }).then((user) => res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
        .catch((err) => {
          if (err.code === 11000) {
            next(res.status(errorConflict).send({ message: 'Переданы не валидные данные пользователя' }));
          } else if (err.name === 'ValidationError') {
            next(res.status(errorId).send({ message: 'Переданы не валидные данные пользователя' }));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  UserSchema.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw res.status(errorUser).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(errorId).send({ message: 'Переданы не коррекныые данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  UserSchema.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw res.status(errorUser).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(errorId).send({ message: 'Переданы не коррекныые данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  UserSchema.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw res.status(errorUnauthorized).send({ message: 'Пользователь не найден' });
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return next(res.status(errorUnauthorized).send({ message: 'Пользователь не найден' }));
      }
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      return res.send({ token });
    });
  })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  UserSchema.findById(req.user._id).then((user) => {
    if (!user) {
      throw res.status(errorUser).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  })
    .catch(next);
};
