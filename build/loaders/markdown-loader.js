import marked from "marked";
import utils from "loader-utils";
import Renderer from "./markdown-renderer";

module.exports = function loader (data) {
    this.cacheable && this.cacheable();
    const query = utils.getOptions(this.query) || {};
    const options = Object.assign({
        renderer: new Renderer(),
        gfm: true,
        tables: true
    }, query.options || {});
    marked.setOptions(options);
    return marked(data);
};
