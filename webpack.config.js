const path = require("path");

module.exports = {
    entry: "./index.js", // Entry point (Main React component)
    output: {
        filename: "modal.bundle.js", // Output file name
        path: path.resolve(__dirname, "dist"), // Output directory
        publicPath: "/dist/", // Public URL path
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Process JS and JSX files
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"], // Compile React and modern JS
                    },
                },
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 3000, // Runs a local dev server on port 3000
    },
    resolve: {
        extensions: [".js", ".jsx"], // Resolve JS and JSX imports
    },
};
