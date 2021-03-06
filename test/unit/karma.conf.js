// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

import webpackConfig from "../../build/webpack.test.babel";

export default config => {
    config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
        browsers: ["PhantomJS"],
        frameworks: ["chai", "mocha", "sinon-chai"],
        client: {
            chai: {
                includeStack: true
            }
        },
        reporters: ["spec", "coverage"],
        files: [
            require.resolve("angular"), // eslint-disable-line no-undef
            require.resolve("angular-mocks"), // eslint-disable-line no-undef
            "./index.js"
        ],
        preprocessors: {
            // eslint-disable-next-line no-undef
            [require.resolve("angular")]: ["webpack", "sourcemap"],
            // eslint-disable-next-line no-undef
            [require.resolve("angular-mocks")]: ["webpack", "sourcemap"],
            "./index.js": ["webpack", "sourcemap"]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: "../../coverage/",
            reporters: [{
                type: "text"
            }, {
                type: "lcov",
                subdir: "report-lcov"
            }, {
                type: "html",
                subdir: "report-html"
            }]
        }
    });
};
