const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./routes')

const {PORT = 3000} = process.env
const app = express()
mongoose.connect('mongodb://localhost:27017/mestodb')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя из монго
  };

  next();
});
app.use(router)

app.listen(PORT, () => {
  console.log('app started')
})

