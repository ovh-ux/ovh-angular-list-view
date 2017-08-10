import LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import merge from "webpack-merge";
import path from "path";
import webpack from "webpack";
import baseConfig from "./webpack.base.babel";

export default merge(baseConfig, {
    devtool: "#source-map",
    output: {
        path: path.resolve(".", "dist"),
        filename: "ovh-angular-list-view.min.js"
    },
    externals: {
        lodash: "_"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": process.env.NODE_ENV
        }),
        new LodashModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
