import webpack, { Configuration } from 'webpack';
import path from 'path';
//import nodeExternals from 'webpack-node-externals'

var outputPath = path.join(__dirname, '/../public')
let listeners: Map<string, ((percentage: number, msg: string, ...args)=>void)> = new Map();
let clientWebpackConfig: Configuration = {
    devtool: 'source-map',
    // entry is where, say, your app starts - it can be called main.ts, index.ts, app.ts, whatever
    entry: {
        //  tensorflowJs: '@tensorflow/tfjs',
        // client: './src/Index/clientIndex.ts'
        // editor: './src/Index/clientEditorIndex.ts',
        clientIndex: './src/Client/clientIndex.ts'
        // vendor: 'jquery'
    },
    // This forces webpack not to compile TypeScript for one time, but to stay running, watch for file changes in project directory and re-compile if needed
    watch: true,
    // Is needed to have in compiled output imports Node.JS can understand. Quick search gives you more info

    // Prevents warnings from TypeScript compiler
    cache: {
        type: 'memory'
    },
    target: 'web',
    module: {
        rules: [{
            test: /.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
        }]
    },
    // externals: [

    // ],
    externals: { '@tensorflow/tfjs': 'tf' },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        // fallback: {
        //     "fs": false,
        //     "tls": false,
        //     "net": false,
        //     "path": false,
        //     "zlib": false,
        //     "http": false,
        //     "https": false,
        //     "stream": false,
        //     "buffer": false,
        //     "crypto": false,
        //     "crypto-browserify": false// require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        // } 


        // fallback: {
        //     "crypto": require.resolve("crypto-browserify") ,
        //     "buffer": require.resolve("buffer/"),
        //     "http": require.resolve("stream-http") 
        // }
        // alias: {
        //     jquery: 'jquery/src/jquery'
        // }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            '$': "jquery",
            'jQuery': "jquery",
            "window.jQuery": "jquery",
            "p5": "p5"
        }),
        new webpack.ProgressPlugin({
            //   /**
            //  * Show active modules count and one active module in progress message
            //  * Default: true
            //  */
            // activeModules?: boolean;
            // /**
            //  * Show entries count in progress message
            //  * Default: false
            //  */
            // entries?: boolean;
            // /**
            //  * Function that executes for every progress step
            //  */
            // handler?: Handler;
            // /**
            //  * Show modules count in progress message
            //  * Default: true
            //  */
            // modules?: boolean;
            // /**
            //  * Minimum modules count to start with, only for mode = modules
            //  * Default: 500
            //  */
            // modulesCount?: number;
            // /**
            //  * Collect profile data for progress steps
            //  * Default: false
            //  */
            // profile?: boolean | null;
            //   percentBy: 'dependencies',
            handler: (percentage: number, msg: string, ...args) => {
                listeners.forEach((value: (p: number, m: string, a: any[])=>void)=>{
                    value(percentage, msg, args);
                })
                
            }
        })
        // new CircularDependencyPlugin(
        //     {
        //         exclude: /a\.js|node_modules/,
        //         failOnError: true,
        //         allowAsyncCycles: false,
        //         cwd: process.cwd()
        //     }
        // )
    ],
    output: {
        path: path.join(__dirname, '/../public'),
        filename: '[name].js',

        chunkFilename: '[id].[chunkhash].js'
    },


};
let listenerCount: number = 0;
function webpackBuildListener(listener: (percentage: number, msg: string, ...args)=>void): string{
   let id = `buildListener${listenerCount++}`;
    listeners.set(id, listener);
    return id;
}
function removeWebpackBuildListener(id: string){
    listeners.delete(id);

}


export { clientWebpackConfig, webpackBuildListener, removeWebpackBuildListener }