import autoprefixer from "autoprefixer";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import merge from "webpack-merge";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";
import RemcalcPlugin from "less-plugin-remcalc";
import webpack from "webpack";
import baseConfig from "./webpack.base.babel";

export default merge(baseConfig, {
    devtool: "#source-map",
    output: {
        path: path.resolve(".", "dist"),
        filename: "ovh-angular-list-view.min.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
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
            })
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": process.env.NODE_ENV
        }),
        new LodashModuleReplacementPlugin(),
        new ExtractTextPlugin("ovh-angular-list-view.min.css"),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
