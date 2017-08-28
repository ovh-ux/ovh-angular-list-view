import _ from "lodash";
import autoprefixer from "autoprefixer";
import FriendlyErrorsPlugin from "friendly-errors-webpack-plugin";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";
import path from "path";
import RemcalcPlugin from "less-plugin-remcalc";
import webpack from "webpack";
import baseConfig from "./webpack.base.babel";

const client = path.join(__dirname, "preview-client");
const config = _.cloneDeep(baseConfig);

Object.keys(config.entry).forEach(name => {
    config.entry[name] = [client].concat(config.entry[name]);
});

export default merge(config, {
    devtool: "#cheap-module-source-map",
    entry: {
        preview: ["./preview/index.js"]
    },
    resolveLoader: {
        alias: {
            "markdown-loader": path.join(__dirname, "loaders", "markdown-loader")
        }
    },
    module: {
        rules: [{
            test: /\.md$/,
            use: [{
                loader: "html-loader",
                options: {
                    interpolate: true
                }
            },
                "markdown-loader"
            ]
        }, {
            test: /\.less$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        plugins: () => [
                            autoprefixer({
                                browsers: ["last 2 versions", "ie 11"]
                            })
                        ]
                    }
                }, {
                    loader: "less-loader",
                    options: {
                        sourceMap: true,
                        plugins: [RemcalcPlugin]
                    }
                }
            ]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            templateContent: parameters => {
                const templatePath = path.join(__dirname, "..", "index.html");
                const fn = _.template(fs.readFileSync(templatePath));
                return fn({ assets: parameters.htmlWebpackPlugin.files });
            }
        })
    ]
});
