// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/App.jsx',  // Entry point for the app
    output: {
        filename: 'modal.bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory (dist)
        library: 'ModalApp',  // Expose the library globally as ModalApp
        libraryTarget: 'umd', // Universal Module Definition for compatibility
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Match .js and .jsx files
                exclude: /node_modules/, // Don't transpile files from node_modules
                use: {
                    loader: 'babel-loader',  // Use Babel for JSX transpiling
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],  // Support modern JavaScript and React
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve .js and .jsx files
    },
    externals: {
        react: 'React', // Externalize React
        'react-dom': 'ReactDOM', // Externalize ReactDOM
    },
};
