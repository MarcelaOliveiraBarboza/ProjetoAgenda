//aqui faz o routeamento, vê quais são as rotas e chama um controlador que dicidirá qual view utilizará

//middlewares: depois de passarmos qual o paramentro de rota, os outros parametros são middlewares

// ao  inves de application.get, usa-se route.get

const express = require('express');
const route = express.Router();//para buscar o expresses de rotas, respostavel por tratar as rotas 

const homeController = require('./src/controllers/homeController');//importou o homeController
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middleware');

//ROTAS DA HOME:
route.get('/', homeController.index);

//ROTAS DE LOGIN:
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//ROTAS DE CONTATO:
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;//para exportar todas route