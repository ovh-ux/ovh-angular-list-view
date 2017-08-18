export default class {

    constructor () {
        this.pageSize = 50;
        this.expandButtonTemplate = "<span>&gt;</span>";
        this.pageSizes = [
            25, 50, 100, 300
        ];
        this.words = {
            resultsPerPage: "Results per page",
            page: "page",
            of: "of",
            results: "results",
            next: "next",
            previous: "previous"
        };
    }

    /**
     * Example of list of CSS classes:
     * - table: oui-table
     * - thead: oui-table__headers
     * - tr: oui-table__row
     * - th: oui-table__header
     * - tbody: oui-table__body
     * - td: oui-table__cell
     *
     * Sorting classes
     * - sortable(sortable, sorting not active): oui-table__cell_sortable oui-table__cell_sortable-asc
     * - sorted(sortable, sorting is active): oui-table__cell_sorted
     * - sortableAsc(ascendant sorting is active): oui-table__cell_sortable-asc
     * - sortableDesc(descendant sorting is active): oui-table__cell_sortable-desc
     *
     * Empty placeholder
     * - emptyTable: oui-table-empty
     *
     * Responsive modifiers
     * - closed(open row on phone screens): oui-table__row_closed
     *
     * Selection
     * - thSelector: oui-table__header_selector
     * - tdSelector: oui-table__cell_selector
     */
    setCssConfig (classes) {
        this.classes = classes;
        return this;
    }

    /**
     * Set custom template for row selector.
     * @param {String} selectorTemplate template
     */
    setSelectorTemplate (selectorTemplate) {
        this.selectorTemplate = selectorTemplate;
        return this;
    }

    /**
     * Button template for expand button (phone screen only)
     * @param {String} expandButtonTemplate template
     */
    setExpandButtonTemplate (expandButtonTemplate) {
        this.expandButtonTemplate = expandButtonTemplate;
        return this;
    }

    /**
     * St the default page size
     * @param {Number} pageSize the default page size
     */
    setPageSize (pageSize) {
        this.pageSize = pageSize;
        return this;
    }

    /**
     * Set the choices of page sizes
     * @param {Array<Number>} pageSizes a list of page sizes
     */
    setPageSizes (pageSizes) {
        this.pageSizes = pageSizes;
        return this;
    }

    /**
     * Set words
     * @param {Object} text map for words
     */
    setWords (words) {
        Object.assign(this.words, words);
        return this;
    }

    $get () {
        return {
            cssClasses: this.classes,
            expandButtonTemplate: this.expandButtonTemplate,
            pageSize: this.pageSize,
            pageSizes: this.pageSizes,
            selectorTemplate: this.selectorTemplate,
            words: this.words
        };
    }
}
