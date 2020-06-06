//webpack.config.js
let htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        })
    ]
}