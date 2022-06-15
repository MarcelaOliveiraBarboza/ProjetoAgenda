const path = require('path');//->importei o modulo path

module.exports = {
    mode: 'development', //modo de desenvolvimento
    entry: './frontend/index.js',//arquivo de entrada e seu caminho

    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js'
    }, //saida e o caminho para chegar na pasta de saida

    module: {
        rules: [{//array com obj para as regras
            exclude: /node_modules/,//para o webpack não ficar verificando essa pasta pq ela é muito extensa

            test: /\.js$/, //testar qual arquivo que vai ler

            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            }//oq irá usar

        }, {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader']
        }]
    },

    devtool: 'source-map'// faz mapeamento para erros, e fala diretamento onde está o erros


};//para exportar o obj que é a confg do webpack
