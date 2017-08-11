import _ from "lodash";
import allData from "docs/data.json";

describe("Table controller", () => {
    beforeEach(angular.mock.module("oui.list-view"));

    let controller;
    let element;
    let $scope;
    let timeout;

    const oneLineData = [{
        foo: "foo",
        bar: "bar"
    }, {
        foo: "baz",
        bar: "qux"
    }];

    beforeEach(() => {
        angular.module("oui.list-view").config(ouiTableConfigurationProvider => {
            ouiTableConfigurationProvider.setCssConfig({
                tablePanel: "oui-table-panel",
                table: "oui-table oui-table_responsive",
                thead: "oui-table__headers",
                tbody: "oui-table__body",
                tr: "oui-table__row",
                th: "oui-table__header",
                td: "oui-table__cell",
                sortable: "oui-table__cell_sortable oui-table__cell_sortable-asc",
                sorted: "oui-table__cell_sorted",
                sortableAsc: "oui-table__cell_sortable-asc",
                sortableDesc: "oui-table__cell_sortable-desc",
                closed: "oui-table__row_closed",
                emptyTable: "oui-table-empty",
                thSelector: "oui-table__header_selector",
                tdSelector: "oui-table__cell_selector"
            }).setPageSize(10);
        });
    });

    describe("With local data", () => {
        beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
            $scope = $rootScope.$new();
            timeout = $timeout;
            element = angular.element(`
                <oui-table rows="rowData">
                    <column property="foo" sortable></column>
                </oui-table>
            `);
            $compile(element)($scope);
            $scope.$digest();
            controller = element.controller("ouiTable");
        }));

        it("should update rows", () => {
            expect(controller.loading).to.be.true;
            setRowData(oneLineData);
            expect(controller.loading).to.be.false;
            expect(controller.displayedRows).to.deep.equal(oneLineData);
            expect(controller.rows).to.deep.equal(oneLineData);
        });

        it("should have getters returning right values", () => {
            setRowData(oneLineData);
            expect(controller.getPageCount()).to.equal(1);
            expect(controller.getTotalCount()).to.equal(2);
            expect(controller.getCurrentOffset()).to.equal(0);
            expect(controller.getCurrentPage()).to.equal(1);
            expect(controller.getPageSize()).to.equal(10);
        });

        it("should sort data when action is triggered", done => {
            setRowData(oneLineData);
            expect(controller.displayedRows[0].foo).to.equal("foo");
            expect(controller.displayedRows[1].foo).to.equal("baz");

            controller.sort(controller.columns[0]);
            whenDataLoaderFlush(() => {
                expect(controller.displayedRows[0].foo).to.equal("baz");
                expect(controller.displayedRows[1].foo).to.equal("foo");
                done();
            });
        });
    });

    describe("With remote data", () => {
        describe("With no default sort", () => {
            beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
                $scope = $rootScope.$new();
                timeout = $timeout;
                element = angular.element(`
                    <oui-table
                        rows-loader="loadData($config)"></oui-table>
                `);
                $scope.loadData = getDataLoader();
                $compile(element)($scope);
                $scope.$digest();
                controller = element.controller("ouiTable");
            }));

            it("should update rows", done => {
                expect(controller.loading).to.be.true;
                whenDataLoaderFlush(() => {
                    expect(controller.loading).to.be.false;
                    done();
                });
            });

            it("should not sort data", done => {
                whenDataLoaderFlush(() => {
                    expect(controller.displayedRows[0].firstName).to.equal("Raymond");
                    expect(controller.displayedRows[9].firstName).to.equal("Thomas");
                    done();
                });
            });

            it("should have getters returning right values", done => {
                whenDataLoaderFlush(() => {
                    expect(controller.getPageCount()).to.equal(100);
                    expect(controller.getTotalCount()).to.equal(1000);
                    expect(controller.getCurrentOffset()).to.equal(0);
                    expect(controller.getCurrentPage()).to.equal(1);
                    expect(controller.getPageSize()).to.equal(10);
                    done();
                });
            });
        });

        describe("With default sort", () => {
            beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
                $scope = $rootScope.$new();
                timeout = $timeout;
                element = angular.element(`
                    <oui-table
                        rows-loader="loadData($config)">
                        <column property="firstName" sortable="asc"></column>
                    </oui-table>
                `);
                $scope.loadData = getDataLoader();
                $compile(element)($scope);
                $scope.$digest();
                controller = element.controller("ouiTable");
            }));

            it("should update rows", done => {
                expect(controller.loading).to.be.true;
                whenDataLoaderFlush(() => {
                    expect(controller.loading).to.be.false;
                    done();
                });
            });

            it("should have sorted data", done => {
                whenDataLoaderFlush(() => {
                    expect(controller.displayedRows[0].firstName).to.equal("Aaron");
                    expect(controller.displayedRows[9].firstName).to.equal("Alan");
                    done();
                });
            });
        });

        describe("Sorting actions", () => {
            beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
                $scope = $rootScope.$new();
                timeout = $timeout;
                element = angular.element(`
                    <oui-table
                        rows-loader="loadData($config)">
                        <column property="firstName" sortable></column>
                    </oui-table>
                `);
                $scope.loadData = getDataLoader();
                $compile(element)($scope);
                $scope.$digest();
                controller = element.controller("ouiTable");
            }));

            it("should sort data when action is triggered", done => {
                whenDataLoaderFlush(() => {
                    // Initial order
                    expect(controller.displayedRows[0].firstName).to.equal("Raymond");
                    expect(controller.displayedRows[9].firstName).to.equal("Thomas");

                    // Ascending
                    controller.sort(controller.columns[0]);
                    whenDataLoaderFlush(() => {
                        expect(controller.displayedRows[0].firstName).to.equal("Aaron");
                        expect(controller.displayedRows[9].firstName).to.equal("Alan");

                        // Descending
                        controller.sort(controller.columns[0]);
                        whenDataLoaderFlush(() => {
                            expect(controller.displayedRows[0].firstName).to.equal("Willie");
                            expect(controller.displayedRows[9].firstName).to.equal("Wayne");
                            done();
                        });
                    });
                });
            });
        });
    });

    describe("With a customised column title", () => {
        it("should have this column with the right title", angular.mock.inject(($rootScope, $compile, $timeout) => {
            $scope = $rootScope.$new();
            timeout = $timeout;
            element = angular.element(`
                <oui-table rows="rowData">
                    <column title="'Custom title'"></column>
                </oui-table>
            `);
            $scope.loadData = getDataLoader();
            $compile(element)($scope);
            $scope.$digest();
            controller = element.controller("ouiTable");

            expect(controller.columns[0].title).to.equal("Custom title");
        }));
    });

    describe("With selection handler", () => {
        beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
            $scope = $rootScope.$new();
            timeout = $timeout;
            element = angular.element(`
                <oui-table
                    rows-loader="loadData($config)"
                    on-selection-change="onSelectionChange($selection)">
                    <column property="firstName" sortable></column>
                </oui-table>
            `);
            $scope.loadData = getDataLoader();
            $compile(element)($scope);
            $scope.$digest();
            controller = element.controller("ouiTable");
        }));

        it("should trigger callback on single selection", done => {
            whenDataLoaderFlush(() => {
                $scope.onSelectionChange = sinon.spy();

                // Nothing selected
                expect(controller.selection.length).to.equal(0);

                // First element selected
                controller.selection[0] = true;
                controller.selectionChange();
                expect($scope.onSelectionChange).to.have.been.calledWith([allData[0]]);
                expect(controller.allSelected).to.be.false;

                // All page selected, item by item
                for (let i = 1; i < 10; i++) {
                    controller.selection[i] = true;
                }
                controller.selectionChange();
                expect(controller.allSelected).to.be.true;

                // All unselected
                controller.selection = [];
                controller.selectionChange();
                expect($scope.onSelectionChange).to.have.been.calledWith([]);
                expect(controller.allSelected).to.be.false;

                done();
            });
        });

        it("should trigger callback on full page selection", done => {
            whenDataLoaderFlush(() => {
                expect(controller.displayedRows.length).to.equal(10);

                $scope.onSelectionChange = sinon.spy();

                // Nothing selected
                expect(controller.selection.length).to.equal(0);

                // Select all
                controller.allSelected = true;
                controller.allSelectedChange();
                expect($scope.onSelectionChange).to.have.been.calledWith(allData.slice(0, 10));

                // Unselect all
                controller.allSelected = false;
                controller.allSelectedChange();
                expect($scope.onSelectionChange).to.have.been.calledWith([]);

                done();
            });
        });

        it("should have empty selection on page change", done => {
            whenDataLoaderFlush(() => {
                $scope.onSelectionChange = sinon.spy();

                // Nothing selected
                expect(controller.selection.length).to.equal(0);

                // Initial context
                controller.selection[0] = true;
                controller.selection[2] = true;
                controller.selectionChange();
                expect($scope.onSelectionChange).to.have.been.calledWith([
                    allData[0],
                    allData[2]
                ]);

                // Change page
                controller.nextPage();
                whenDataLoaderFlush(() => {
                    expect(controller.selection.length).to.equal(0);

                    done();
                });
            });
        });

        it("should have empty selection on sort", done => {
            whenDataLoaderFlush(() => {
                $scope.onSelectionChange = sinon.spy();

                // Nothing selected
                expect(controller.selection.length).to.equal(0);

                // Initial context
                controller.selection[0] = true;
                controller.selection[2] = true;
                controller.selectionChange();
                expect($scope.onSelectionChange).to.have.been.calledWith([
                    allData[0],
                    allData[2]
                ]);

                // Change page
                controller.sort(controller.columns[0]);
                whenDataLoaderFlush(() => {
                    expect(controller.selection.length).to.equal(0);

                    done();
                });
            });
        });
    });

    function setRowData (data) {
        $scope.rowData = data;
        $scope.$digest();
        timeout.flush();
    }

    function whenDataLoaderFlush (cb) {
        $scope.$digest();
        setTimeout(() => { // timeout defined in user controller
            timeout.flush(); // angular timeout internally defined
            if (cb) {
                cb();
            }
        }, 0);
    }

    function getDataLoader () {
        return function ({ offset, pageSize, sort }) {
            const sortedData = _.sortBy(allData, row => _.get(row, sort.property));
            if (sort.dir === -1) {
                sortedData.reverse();
            }
            const page = sortedData.slice(offset, offset + pageSize);

            // AngularJS independent logic
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        data: page,
                        meta: {
                            currentOffset: offset,
                            pageCount: Math.ceil(allData.length / pageSize),
                            totalCount: allData.length
                        }
                    });
                }, this.delay);
            });
        };
    }
});
