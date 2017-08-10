import webpackPreviewConfig from "./webpack.preview.babel";

const config = Object.assign({}, webpackPreviewConfig);

delete config.entry.preview;
delete config.plugins;

export default config;
