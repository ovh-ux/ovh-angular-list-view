import "angular";
import "build/preview-client";

import template from "./preview.md";
import controller from "./index.controller";
import simplePagination from "./simple-pagination.component";

import "./index.less";

const app = angular.module("preview", ["oui.list-view"]);

app.config(ouiTableConfigurationProvider => {
    "ngInject";

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
    })
        .setPageSize(10)
        .setExpandButtonTemplate(`
    <i role="button"
      class="oui-icon oui-icon-chevron-right oui-table__expand-button"></i>
  `)
        .setSelectorTemplate(`<div class="oui-checkbox">
    <input class="oui-checkbox__input"
      id="{{$name}}"
      type="checkbox"
      ng-model="$value"
      ng-change="$onChange()">
    <label class="oui-checkbox__label-container" for="{{$name}}">
      <span class="oui-checkbox__icon">
        <i class="oui-icon oui-icon-checkbox-unchecked" aria-hidden="true"></i>
        <i class="oui-icon oui-icon-checkbox-checked" aria-hidden="true"></i>
        <i class="oui-icon oui-icon-checkbox-checkmark" aria-hidden="true"></i>
      </span>
    </label>
  </div>`);
});

app.component("simplePagination", simplePagination)
    .component("preview", {
        template,
        controller
    });

export default app;
