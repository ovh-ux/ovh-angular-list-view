import marked from "marked";

export default class extends marked.Renderer {
    heading (text, level, raw) {
        const id = raw.toLowerCase().replace(/[^\w]+/g, "-");
        return `
      <h${level} id="${id}" class="oui-heading${level}">${text}</h${level}>
    `;
    }
}
