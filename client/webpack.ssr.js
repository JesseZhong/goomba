const path = require("path");

module.exports = {
    mode: "production",

    entry: "./src/ssr/SSRHandler.ts",

    output: {
        path: path.resolve("ssr-build"),
        filename: "index.js",
        library: "index",
        libraryTarget: "umd",

        // Fixes issue with window & document being
        // referenced in non-browser environment, like
        // during SSR. Prevents the 'window is not defined' error.
        globalObject: 'this'
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
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        "noEmit": false
                    }
                }
            },
            {
                // NOTE: Load any SASS files as just files.
                // No need to be loaded properly in SSR.
                test: /\.(png|jpe?g|gif|s[ac]ss)$/i,
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
        "aws-sdk": "SSM"
    },

    // Override the recommended limits.
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};