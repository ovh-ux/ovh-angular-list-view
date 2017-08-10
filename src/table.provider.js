export default class {

    constructor () {
        this.pageSize = 50;
        this.expandButtonTemplate = "<span>&gt;</span>";
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

    setPageSize (pageSize) {
        this.pageSize = pageSize;
        return this;
    }

    $get () {
        return {
            selectorTemplate: this.selectorTemplate,
            cssClasses: this.classes,
            expandButtonTemplate: this.expandButtonTemplate,
            pageSize: this.pageSize
        };
    }
}
