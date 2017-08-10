import Cell from "./cell.directive.js";
import Pagination from "./pagination.directive.js";
import Selector from "./selector.directive.js";
import Table from "./table.directive.js";
import TableProvider from "./table.provider.js";

angular.module("oui.list-view", [])
    .directive("ouiTable", Table)
    .directive("ouiTableCell", Cell)
    .directive("ouiTableSelector", Selector)
    .directive("ouiTablePagination", Pagination)
    .provider("ouiTableConfiguration", TableProvider);
