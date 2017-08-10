import express from "express";
import fs from "fs";
import minimist from "minimist";
import opn from "opn";
import path from "path";
import portScanner from "portscanner";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const argv = minimist(process.argv.slice(2));
const webpackConfig = require(path.resolve(argv.c)).default;

const app = express();
const compiler = webpack(webpackConfig);

const defaultPort = process.env.PORT || 3000;

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

const hotMiddleware = webpackHotMiddleware(compiler);

compiler.plugin("compilation", compilation => {
    compilation.plugin("html-webpack-plugin-after-emit", (data, cb) => {
        hotMiddleware.publish({ action: "reload" });
        cb();
    });
});

app.use(devMiddleware);
app.use(hotMiddleware);

portScanner.findAPortNotInUse(defaultPort, 6000)
    .then(port => {
        app.set("port", port);
        app.listen(port, err => {
            const url = `http://localhost:${port}`;
            if (err) {
                console.log(err);
                return;
            }
            fs.writeFileSync(".preview-host", url);
            console.log("* Environment: %s", app.get("env"));
            console.log("* Listening on %s", url);
            opn(url);
        });
    });
