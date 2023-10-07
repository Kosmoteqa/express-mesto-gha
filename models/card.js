const mongoose = require('mongoose');
const { URLREGEX } = require('../middlewares/validation');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => URLREGEX.test(v),
      message: 'Не вылидный адрес'
    },
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,

  }
});

module.exports = mongoose.model('card', cardSchema);
