const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')
const nodeExternals = require('webpack-node-externals');
const {
    NODE_ENV = 'production',
} = process.env;


module.exports = {
    entry: './src/Server/ServerIndex.ts',
    mode: NODE_ENV,
    target: 'node',
    sourceMap: true,
    //devtool: 'inline-source-map',
    module: {
        
        rules: [{
            test: /\.ts$/,
            use: [
                'ts-loader',
            ]
        }]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './Index/ServerIndex.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        // alias: {
        //     jquery: "jquery/src/jquery"
        // }
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd()
        })
        
    ]
}