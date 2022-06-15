//models são classes
//schema é a modelagem

const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, //true pois o titulo precisa ser enviado/requerido
  descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);//model criado

class Home {

}

module.exports = Home;
