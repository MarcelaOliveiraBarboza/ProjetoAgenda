//toda essa aplicação é usada em modo MVC: models, views e controllers

//npm i helmet e npm i csurf: para ser instalado

/*
O Helmet é para segurança da aplicação, portanto, caso você esteja com um sistema ainda em desenvolvimento, usando urls como "127.0.0.1", "localhost" ou até um servidor com IP externo, sem usar SSL (https), é recomendável desativá-lo. Ele pode bloquear importação de scripts e arquivos de CSS.

Caso ocorra erros ao importar o bundle.js, arquivos de CDN (como bootstrap, por exemplo) ou CSS, basta desativar o helmet para correção.

Isso só ocorrerá em sistemas sem SSL (sem https na URL). */

//CSRF: geralmente em um site tem a parte visual com diferentes rotas, e ele impede que links externos postem algo, e oq faz junto dessa seguraça esta no input de index.ejs



require('dotenv').config();//para minha senha não ficar publica quando postar o codigo no gitHub, por isso o arquivo .env, lá está com minha senha mas não está publica, não será baixada

const express = require('express'); //não precisa de caminho pois ele está na raiz do node_modules
const app = express(); //ambos usados para carregar o express


const mongoose = require('mongoose'); //para chamar ele, moongose modela a base de dados e garante q os dados estejam certos

mongoose.connect(process.env.CONNECTIONSTRING, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        //useFindAndModify: false
    })//para conecta-lo na base de dados, e o obj está prevenindo possiveis erros
    .then(() => {
        app.emit('pronto')//emite sinal para ser executado primeiro
    })
    .catch(e => console.log(e));


const session = require('express-session');//session identifica um usuario por meio do cookie pelo id, fazendo o cliente ser confiavel
const MongoStore = require('connect-mongo');//para seções serem salvas na base de dados
const flash = require('connect-flash');//ajuda a mandar feedbacks para usuários
//os tres para configurar o sessions e flash

const routes = require('./routes');//rotas da aplicação
const path = require('path');


//ajudam a ser mais seguro:
const helmet = require('helmet');
const csrf = require('csurf'); 


//middlewares são funções executadas na rota:
const { middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware');


app.use(helmet());//para ele ser usado

app.use(express.urlencoded({ extended: true }));//para usar o req.body; diz q pode postar formulários dentro da alicação
app.use(express.json());

//arqvs estáticos devem ser acessdos diretamente(img, css, java):
app.use(express.static(path.resolve(__dirname, 'public')))//caminho absoluto da pasta de conteudo static

//configuração da seção:
const sessionOptions = session({
    secret: 'dcdnkcndsksc',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),//Lembrando que process.env.CONNECTIONSTRING é a minha URL de conexão do MongoDB.
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,//tempo de duração do cookie(7 dias em milessimos de segundos)
        httpOnly: true
    }
});
app.use(sessionOptions);//para a coisa acima ser usada
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));//caminho absoluto da pasta views
app.set('view engine', 'ejs')//ejs renderiza o view(e instala no terminal = npm i ejs)

app.use(csrf());//para o csurf


//meus middlewares:
app.use(middlewareGlobal);//agora obrigatóriamente todas as rotas e requisões passaram por esse middleware
app.use(checkCsrfError);
app.use(csrfMiddleware);


app.use(routes);//para o express usar as rotas 

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000')//cria um link q abrira na pagina com hello world

        console.log('Servidor executando na porta 3000')
    });
});//isso fará a conexão ser executada primeiro



//depois no terminal: node server.js, para executar o código
//e Ctrl C no terminal encerra.