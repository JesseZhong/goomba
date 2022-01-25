const path = require("path");

module.exports = {
    mode: "production",

    entry: "./src/SSRHandler.ts",

    output: {
        path: path.resolve("ssr-build"),
        filename: "index.js",
        library: "index",
        libraryTarget: "umd",
    },

    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js"
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: "file-loader"
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};