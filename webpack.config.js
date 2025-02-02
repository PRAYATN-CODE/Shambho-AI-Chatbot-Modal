// webpack.config.mjs
import path from 'path';

export default {
    entry: './src/index.jsx',  // Update the entry point to `index.jsx`
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,  // Allow both .js and .jsx files
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],  // Resolve both .js and .jsx extensions
    },
    devServer: {
        contentBase: './dist',
        open: true,
    },
};
