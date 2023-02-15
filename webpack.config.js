const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { QuadraticBezierCurve } = require("three");

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        static: "./src/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            cache: false,
            template: "./src/index.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/assets/",
                    to: "./assets/"
                }
            ]
        }),
    ],
    mode: "development",
}