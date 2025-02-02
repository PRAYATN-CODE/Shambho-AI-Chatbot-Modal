// webpack.config.mjs
import path from 'path';

export default {
    entry: './src/index.js',  // entry point
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
