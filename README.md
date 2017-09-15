# OVH Angular List-view

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

> Angular directive to generate a table.

## Installation

```bash
yarn add ovh-angular-list-view
```

### Configuration

Add this module dependency:

```javascript
angular.module("yourApp", [
    "oui.list-view"
]);
```

By default, no styles are embedded. You can choose to use the ovh-ui-kit styles by adding it to your dependencies:

```bash
yarn add --dev ovh-ui-kit
```

Then, you can configure the default styles:

```javascript
app.config(ouiTableConfigurationProvider => {
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
    });
});
```

Or just use yours ;)

[Full example](preview/index.js#L12).

## Usage

### Getting started - local data

```html
<oui-table rows="$ctrl.data">
  <column property="firstName"></column>
  <column property="lastName"></column>
  <column property="email"></column>
  <column property="phone"></column>
  <column property="birth"></column>
</oui-table>
```

### Sortable attribute

```html
<oui-table rows="$ctrl.data">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column property="email" sortable></column>
  <column property="phone"></column>
  <column property="birth" sortable></column>
</oui-table>
```

You can define the default sorting configuration by giving a value `asc` or `desc` to the `sortable` attribute.

### Custom columns header names

```html
<oui-table rows="$ctrl.data">
  <column title="'firstName'" property="firstName"></column>
  <column title="$ctrl.lastNameText" property="lastName"></column>
  <column property="email" sortable></column>
  <column property="phone"></column>
  <column property="birth" sortable></column>
</oui-table>
```

By default, the column header takes the capitalized value of `property`.

### Pagination

By default list-view size is limited to 50 items.

You can override this value by configuring it:

```javascript
app.config(ouiTableConfigurationProvider => {
    ouiTableConfigurationProvider.setPageSize(10);
});
```

Or you can use the `page-size` property. It takes precedence over value configured by provider.

```html
<oui-table rows="$ctrl.data" page-size="10">
  <column title="'firstName'" property="firstName"></column>
  <column title="$ctrl.lastNameText" property="lastName"></column>
</oui-table>
```

The default pagination widget will be used if you don't define yours.
In this case, you need to import [ovh-ui-kit](https://github.com/ovh-ux/ovh-ui-kit) in your project and [ovh-angular-list-view.min.css](dist/ovh-angular-list-view.min.css) extra file from this repos.

If you want to make your pagination, here is an example `simple-pagination` directive where `$table` is used to get useful properties directly from [table controller](src/table.controller.js#L104).

```html
<oui-table rows="$ctrl.data" page-size="10">
  <column title="'firstName'" property="firstName"></column>
  <column title="$ctrl.lastNameText" property="lastName"></column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
</oui-table>
```

#### Page size selector

If you use the default pagination (but you can also use this in your custom pagination), you can override the default [page sizes](src/table.provider.js#L6):

```javascript
app.config(ouiTableConfigurationProvider => {
    ouiTableConfigurationProvider.setPageSizes([10, 25, 50, 100]);
});
```

### Custom cell templates

```html
<oui-table rows="$ctrl.data">
  <column title="'Name'">
    {{$row.firstName}} {{$row.lastName}}
  </column>
  <column property="email"></column>
  <column property="phone"></column>
  <column property="birth"></column>
</oui-table>
```

:warning: Issue: sometimes, the template is not rendered.

Workaround: use a custom element to hide complexity or use the `template` property ([learn more](preview/preview.md#L141)).

### Remote data

```html
<oui-table rows-loader="$ctrl.loadData($config)">
  <column property="firstName"></column>
  <column property="lastName"></column>
  <column property="email"></column>
  <column property="phone"></column>
  <column property="birth"></column>
</oui-table>
```

```javascript
class YourController {
  loadData ({ offset, pageSize, sort }) {
    // Make what you want here
    return fetch("/path/to/you/api", {
      method: "POST",
      body: { offset, pageSize, sort }
    }).then(response => response.json());
  }
}
```

Your method must:

 * return a promise or a compatible object
 * this promise must resolve a value of this shape:

```javascript
{
    data: page, // your data (an array)
    meta: {
        currentOffset, // page offset (from 0)
        pageCount, // number of pages
        totalCount, // number of items
        pageSize // page size (optional)
    }
}
```

[Example](preview/index.controller.js#L28).

### Filtering

The filtering UI must entirely take place outside of the table. You have to do it on your own.

**The 1st step is to add an id to your table!**

Therefore, there exist some differences between local and remote method.

#### Local filtering

```html
<label for="searchTextExample">Find: </label>
<input id="searchTextExample"
  name="searchTextExample"
  type="search"
  data-ng-change="$ctrl.onSearchText()"
  data-ng-model="$ctrl.searchText"
  data-ng-model-options="{ debounce: 400 }">
<oui-table rows="data" id="listView">
  <column property="firstName"></column>
  <column property="lastName"></column>
</oui-table>
```

The controller just have to broadcast an event `oui-table:[id]:refresh` with an object containing the search text in a `searchText` property.

```javascript
class YourController {
    onSearchText () {
        this.scope.$broadcast("oui-table:listView:refresh", {
            searchText: this.searchText
        });
    }
}
```

The search is made in all properties specified in `column` tags.

#### Remote filtering

```html
<label for="searchTextExample">Find: </label>
<input id="searchTextExample"
  name="searchTextExample"
  type="search"
  data-ng-change="$ctrl.onSearchText()"
  data-ng-model="$ctrl.searchText"
  data-ng-model-options="{ debounce: 400 }">
<oui-table row-loader="$ctrl.loadRow($row)" id="listView">
  <column property="firstName"></column>
  <column property="lastName"></column>
</oui-table>
```

The event emission does not changed compared to local data and your search text is passed to your loading data function as `searchText` attribute so that you can use it for your own loading logic.

[Example](preview/index.controller.js#L28).

In addition, please note that you also have the possibilty to give custom filter parameters which are passed the same way as `searchText` to your loading function.

### Remote partial data

Sometimes you will have to get remote data, but you want to fill other cell from separate API calls or by calculating these new values.

You can use `row-loader`. It take the current row as argument and must return a promise that resolves to the transformed row.

```html
<oui-table rows-loader="$ctrl.loadPartialData($config)"
  row-loader="$ctrl.loadRow($row)">
  <column property="firstName"></column>
  <column property="lastName"></column>
  <column property="email"></column>
  <column property="phone"></column>
  <column property="birth"></column>
</oui-table>
```

[Example](preview/index.controller.js#L90).

### Clickable row

You can specify an action on a row click by defining an `on-row-click` handler on `oui-table`.
Because you are sensible to accessibility, you can also define a `row-label` which will give you an `arial-label` on each clickable row.

```html
<oui-table rows="$ctrl.data"
  on-row-click="$ctrl.runAction($row)"
  row-label="$row.firstName + ' ' + $row.lastName">
  <column property="firstName"></column>
  <column property="lastName"></column>
  <column property="email"></column>
  <column property="phone"></column>
  <column property="birth"></column>
</oui-table>
```

## Run in development mode

Clone this repository and:

```bash
yarn install
yarn start
```

If you want to run the tests: `yarn unit`

## Test driven development

```bash
yarn tdd
```

## Known issues

 * When the inline templates (in html) used for custom cells and pagination are too complex, they are not rendered.

## Related links

 * Contribute: https://github.com/ovh-ux/ovh-ux-guidelines/blob/master/.github/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-list-view/issues

