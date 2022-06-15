//para fazr o controler tenho que exprtar a rota, ela é criada aqui, importada em routes, e exportada de la

//é aqui que vai as funções de rotas, aqui há controles

const Contato = require('../models/ContatoModel');

exports.index = async(req, res) => {
  const contatos = await Contato.buscaContatos();
  res.render('index', { contatos });
};//render de renderizar o "html" q está na pasta ejs, e posso capturar o obj(informações injetadas) no arquivo index.ejs



