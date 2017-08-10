import { capitalize, hasProperty } from "./util";

export default class {
    constructor ($attrs, $compile, $parse, $q, $sce, $scope, $timeout, orderByFilter, ouiTableConfiguration) {
        "ngInject";

        this.$attrs = $attrs;
        this.$compile = $compile;
        this.$parse = $parse;
        this.$q = $q;
        this.$sce = $sce;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.orderBy = orderByFilter;

        this.config = ouiTableConfiguration;
        this.css = ouiTableConfiguration.cssClasses;

        if (this.config.selectorTemplate && !this.compiledSelectorTemplate) {
            this.compiledSelectorTemplate = this.$compile(`<div>${this.config.selectorTemplate}</div>`);
        }
    }

    $onInit () {
        if (this.$attrs.rows && (!this.rows || !(this.rows instanceof Array))) {
            this.rows = [];
        }

        this.loading = false;
        this.currentSorting = {
            columnName: undefined,
            dir: 0
        };
        this.displayedRows = [];
        this.sortedRows = this.rows;

        // Opened rows (for phone screens)
        this.isRowOpen = {};

        this._pageSize = parseInt(this.pageSize, 10) || this.config.pageSize;
        this.pageMeta = {
            currentOffset: 0,
            currentPage: 1,
            pageSize: this._pageSize
        };

        this.allSelected = false;
        this.selection = [];
    }

    init () {
    // Local data
        if (this.rows) {
            this.$scope.$watchCollection("tableCtrl.rows", () => {
                this.sortedRows = this.rows;

                this.updatePageMeta({
                    currentOffset: 0,
                    pageCount: Math.ceil(this.rows.length / this._pageSize),
                    totalCount: this.rows.length
                });

                this.changePage()
                    .catch(this.handleError.bind(this));
            });
        }

        if (!this.rows && !this.rowsLoader) {
            throw new Error("No data nor data loader found");
        }

        this.changePage({ skipSort: true })
            .catch(this.handleError.bind(this));
    }

    isSelectable () {
        return this.$attrs.onSelectionChange;
    }

    selectionChange () {
        const $selection = this.displayedRows.filter((row, index) => this.selection[index]);
        this.onSelectionChange({ $selection });
        this.allSelected = $selection.length === this.getPageRepeatRange().length;
    }

    allSelectedChange () {
        this.getPageRepeatRange().forEach(index => {
            this.selection[index] = this.allSelected;
        });
        this.onSelectionChange({
            $selection: this.allSelected ? this.displayedRows : []
        });
    }

    hasProperty (obj, prop) {
        return hasProperty(obj, prop);
    }

    handleError () {
        // do nothing.
    }

    getCurrentOffset () {
        return this.pageMeta.currentOffset;
    }

    getCurrentPage () {
        return Math.floor(this.getCurrentOffset() / this.getPageSize()) + 1;
    }

    getPageCount () {
        return this.pageMeta.pageCount;
    }

    getPageSize () {
        return this.pageMeta.pageSize;
    }

    getTotalCount () {
        return this.pageMeta.totalCount;
    }

    previousPage () {
        this.changeOffset(+this.getCurrentOffset() - this.getPageSize());
    }

    nextPage () {
        this.changeOffset(+this.getCurrentOffset() + this.getPageSize());
    }

    changeOffset (newOffset) {
        const oldOffset = this.getCurrentOffset();
        const oldSelection = angular.copy(this.selection);
        const oldAllSelected = this.allSelected;

        this.pageMeta.currentOffset = newOffset;
        this.selection = [];
        this.allSelected = false;
        this.changePage({ skipSort: true })
            .then(() => {
                this.selectionChange();
            })
            .catch(() => {
                this.pageMeta.currentOffset = oldOffset;
                this.selection = oldSelection;
                this.allSelected = oldAllSelected;
            });
    }

    /**
   * Show current data frame according currentOffset, pageSize and currentSorting.
   * Controls the loading state.
   * Possibility to skip sort on page change with local data.
   */
    changePage (config = {}) {
        if (this.loading) {
            return this.$q.reject(false);
        }

        let loadPage;

        if (this.rows) {
            loadPage = this.localLoadData.bind(this, config);
        } else {
            loadPage = this.loadData.bind(this);
        }

        this.loading = true;
        return this.$q.when(loadPage())
            .then(result => {
                this.displayedRows = result.data;
                this.updatePageMeta(result.meta);

                this.loadRowsData(this.displayedRows);

                this.$timeout(() => {
                    this.isRowOpen = {};
                    this.loading = false;
                });
            })
            .catch(this.handleError.bind(this));
    }

    updatePageMeta ({ currentOffset, pageCount, totalCount }) {
        this.pageMeta = {
            currentOffset,
            currentPage: Math.floor(currentOffset / this._pageSize) + 1,
            pageCount,
            totalCount,
            pageSize: this._pageSize
        };
    }

    /**
   * Change page with local data
   */
    localLoadData (config = {}) {
        const deferred = this.$q.defer();

        this.$timeout(() => {
            // Sorting, only executed if sortConfiguration has changed
            if (!config.skipSort) {
                const sortConfiguration = this.getSortingConfiguration();
                this.sortedRows = this.orderBy(this.rows, sortConfiguration.property, sortConfiguration.dir < 0);
            }

            // Pagination
            deferred.resolve({
                data: this.sortedRows.slice(this.getCurrentOffset(), this.getCurrentOffset() + this.getPageSize()),
                meta: this.pageMeta
            });
        });

        return deferred.promise;
    }

    /**
   * Change page with remote data
   */
    loadData () {
        return this.rowsLoader({
            $config: {
                offset: this.getCurrentOffset(),
                pageSize: this.getPageSize(),
                sort: this.getSortingConfiguration()
            }
        });
    }

    loadRowsData (rows) {
        rows.forEach(row => this.loadRowData(row));
    }

    loadRowData (row) {
        if (!this.isRowLoaded(row)) {
            this.$q.when(this.rowLoader({ $row: row }))
                .then(fullRow => Object.assign(row, fullRow));
        }
    }

    /**
   * Check if all data is loaded on this row
   * @param  {object}  row a row
   * @return {Boolean}     true if loaded
   */
    isRowLoaded (row) {
        return this.columns.map(column => this.hasProperty(row, column.name))
            .reduce((a, b) => a && b, true);
    }

    getPageRepeatRange () {
        if (this.getPageCount() === this.getCurrentPage()) {
            return this.getRepeatRange(this.getTotalCount() - (this.getPageCount() - 1) * this.getPageSize());
        }

        return this.getRepeatRange(this.getPageSize());
    }

    getRepeatRange (size) {
    // Generate a range: [0, 1, 2, ..., size - 1]
        return Array(...{ length: size }).map(Number.call, Number);
    }

    sort (column) {
        if (!column.sortable) {
            return;
        }

        const oldOffset = this.getCurrentOffset();
        const oldSorting = angular.copy(this.currentSorting);
        const oldSelection = angular.copy(this.selection);
        const oldAllSelected = this.allSelected;

        if (column.name === this.currentSorting.columnName) {
            this.currentSorting.dir = this.currentSorting.dir === -1 ? 1 : -1;
        } else {
            this.currentSorting = {
                columnName: column.name,
                dir: 1
            };
        }

        this.pageMeta.currentOffset = 0;
        this.selection = [];
        this.allSelected = false;
        this.changePage()
            .then(() => {
                this.selectionChange();
            })
            .catch(() => {
                this.pageMeta.currentOffset = oldOffset;
                this.currentSorting = oldSorting;
                this.selection = oldSelection;
                this.allSelected = oldAllSelected;
            });
    }

    getSortingConfiguration () {
        const selectedColumn = this.getColumn(this.currentSorting.columnName);
        return Object.assign({
            property: selectedColumn && selectedColumn.sortProperty
        }, this.currentSorting);
    }

    getSortableClasses (column) {
        if (column.name !== this.currentSorting.columnName) {
            return {
                [this.css.sortable]: !!column.sortable
            };
        }
        return {
            [this.css.sortable]: !!column.sortable,
            [this.css.sorted]: true,
            [this.css.sortableAsc]: this.currentSorting.dir === 1,
            [this.css.sortableDesc]: this.currentSorting.dir === -1
        };
    }

    getExpandButtonTemplate () {
        return this.$sce.trustAsHtml(this.config.expandButtonTemplate);
    }

    isClosed (index) {
        return !this.isRowOpen[index];
    }

    getClosedClass (index) {
        return {
            [this.css.closed]: this.isClosed(index)
        };
    }

    toggleLine (index) {
        this.isRowOpen[index] = !this.isRowOpen[index];
    }

    getColumn (name) {
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].name === name) {
                return this.columns[i];
            }
        }
        return null;
    }

    getColumnTemplate (column) {
        if (!column.compiledTemplate) {
            column.compiledTemplate = this.$compile(`<div>${column.template}</div>`);
        }
        return column.compiledTemplate;
    }

    setPaginationTemplate (paginationTemplate) {
        if (paginationTemplate) {
            this.paginationTemplate = `<div>${paginationTemplate}</div>`;
        }
    }

    buildColumns (columnElements) {
        this.columns = [];

        angular.forEach(columnElements, columnElement => {
            const column = {};

            angular.forEach(columnElement.attributes, attr => {
                const attrName = attr.name;

                switch (attrName) {
                case "property":
                    column.name = attr.value;
                    column.getValue = this.$parse(attr.value);
                    break;

                case "template":
                    column.template = this.$parse(attr.value)(this.$scope);
                    break;

                case "sortable":
                    column.sortable = attr.value !== undefined;
                    this.defineDefaultSorting(column, attr.value);
                    break;

                case "title":
                    column.title = this.$parse(attr.value)(this.$scope);
                    break;

                default:
                    column[attrName] = attr.value;
                }
            });

            if (!column.title) {
                column.title = capitalize(column.name);
            }

            if (!column.sortProperty) {
                column.sortProperty = column.name;
            }

            if (!column.template && columnElement.innerHTML) {
                column.template = columnElement.innerHTML;
            }

            if (column.template) {
                column.compiledTemplate = this.getColumnTemplate(column);
            }

            this.columns.push(column);
        });
    }

    defineDefaultSorting (column, attrValue) {
        column.sortable = attrValue !== undefined;
        if (attrValue.length) {
            column.defaultSortDir = attrValue === "asc" ? 1 : -1;
            this.currentSorting = {
                columnName: column.name,
                dir: column.defaultSortDir
            };
        }
    }
}
