//models são classes
//schema é a modelagem
//instalado no terminal: pm i bcryptjs; para as senhas na base de dados não ficar a mostrae sim criptografada

const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },//true pois o email precisa ser enviado/requerido
  password: { type: String, required: true }//true pois a senha precisa ser enviado/requerido
});

const LoginModel = mongoose.model('Login', LoginSchema);//model criado

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];//se haver erros, não haverá cadastro
    this.user = null;
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return;//se haver quantd maior q 0 de erros, retorna

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(this.user) this.errors.push('Usuário já existe.');
  }//não deixa o mesmo usuário se registrar novamente

  valida() {//validação dos campos
    this.cleanUp();

    //email precisa ser válido(instalou no terminal: npm i validator) e importou ele em require ali encima:
    //se não for um email valido, haverá o erros: email inválido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    //a senha precisa ter entre 3 e 10 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }//se a chave for diferente de uma string, fará ela ter uma sring vazia

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;