import webpack from "webpack";

const path = require("path");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/js/main.js"),
    },

    output: {
        filename: "[name].js",
        chunkFilename: "[name].js",
        publicPath: "/",
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true,
                },
            },
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: require.resolve("babel-loader"),
                    query: {
                        presets: [["@babel/preset-env", { modules: false }]],
                    },
                },
            },
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            "window.jQuery": "jquery",
            "window.$": "jquery",
            jQuery: "jquery",
            $: "jquery",
        }),
    ],

    resolve: {
        alias: {
            jquery: "jquery/dist/jquery.min.js",
            "%components%": path.resolve(__dirname, "src/js/components"),
        },
    },
};
