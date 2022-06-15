//models são classes
//schema é a modelagem

const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },//true pois o titulo precisa ser enviado/requerido
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);//model criado

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function () {
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () { //validação dos campos
    this.cleanUp();

    //email precisa ser válido(instalou no terminal: npm i validator) e importou ele em require ali encima:
    //se não for um email valido, haverá o erros: email inválido
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
    }
};

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }//se a chave for diferente de uma string, fará ela ter uma sring vazia

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
};

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });//-> encontre o contato por id, e atualize seus dados
};//se o contato tiver um id string, ser validado pela função valida e não ter erros, ele será criado

//METÓDOS ESTÁTICOS(q não vão para o prototype e não tem acesso a palvvra this):
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContatos = async function () {
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1 });
    return contatos;
};//busca de contatos por ordem de criação decrescente

Contato.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id });
    return contato;
};


module.exports = Contato;
