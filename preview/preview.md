<button type="button" ng-click="$ctrl.redraw()">Redraw</button>
<button type="button" ng-click="$ctrl.changeDataOnFirstLine()">Update first line</button>
<button type="button" ng-click="$ctrl.showPerformances()">Log performance</button>

<div class="inline-component">
  Delay: <input data-label="Delay" data-unit="ms" type="number" ng-model="$ctrl.delay"> ms
</div>

## General case

<!-- Remote data + on-the-fly loading + filtering -->
<!--<label class="oui-label" for="searchText1">Find: </label>
<input id="searchText1" name="searchText1" type="search" class="oui-input oui-input_inline"
  data-ng-change="$ctrl.onSearchText('list1')"
  data-ng-model="$ctrl.searchText"
  data-ng-model-options="{ debounce: 400 }">
<oui-table
  id="list1"
  ng-if="$ctrl.trigger"
  rows-loader="$ctrl.loadPartialData($config)"
  row-loader="$ctrl.loadRow($row)"
  page-size="25">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable>
    <a href="mailto:{{$value}}">{{$ctrl.label}}: {{$value}}</a>
  </column>
  <column property="phone"></column>
  <column property="birth" sortable>
    {{$value|date:short}}
  </column>
</oui-table> -->

<!-- Remote data -->
<!-- <oui-table rows-loader="$ctrl.loadData($config)" ng-if="$ctrl.trigger" page-size="10">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable>
    <a href="mailto:{{$value}}">{{$ctrl.label}}: {{$value}}</a>
  </column>
  <column property="phone"></column>
  <column property="birth" sortable>
    {{$value|date:short}}
  </column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
</oui-table> -->

<!-- Local data + on-the-fly loading + filtering -->
<!-- <label class="oui-label" for="searchText3">Find: </label>
<input id="searchText3" name="searchText3" type="search" class="oui-input oui-input_inline"
  data-ng-change="$ctrl.onSearchText('list3')"
  data-ng-model="$ctrl.searchText"
  data-ng-model-options="{ debounce: 400 }">
<oui-table ng-if="$ctrl.trigger"
  id="list3"
  rows="$ctrl.data"
  row-loader="$ctrl.loadRow($row)"
  page-size="25">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable></column>
  <column property="phone"></column>
  <column property="birth" sortable></column>
  <column title="'Action'" class="oui-table__cell_action">
    <button class="oui-button oui-button_secondary" ng-click="$ctrl.runAction($row)">This is an action</button>
  </column>
</oui-table> -->

<!-- Local data -->
<!-- <oui-table rows="$ctrl.data" ng-if="$ctrl.trigger" page-size="10">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column property="email" sortable></column>
  <column property="phone"></column>
  <column property="birth" sortable></column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
</oui-table> -->

<!-- Custom column names -->
<!-- <oui-table rows="$ctrl.data" ng-if="$ctrl.trigger" page-size="10">
  <column title="'Prénom'" property="firstName" sortable="asc"></column>
  <column title="'Nom'" property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable></column>
  <column title="'Téléphone'" property="phone"></column>
  <column title="'Date de naissance'" property="birth" sortable></column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
</oui-table> -->

<!-- Bug template -->
<!-- <oui-table ng-if="$ctrl.trigger"
  rows="$ctrl.partialData"
  row-loader="$ctrl.loadRow($row)"
  page-size="25">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column title="'Composite column'" property="parents.mother.lastName"
    template="$ctrl.getTemplate()"></column>
  <column property="email" sortable></column>
</oui-table>

<button type="button" ng-click="$ctrl.redraw()">Redraw</button>
<button type="button" ng-click="$ctrl.changeDataOnFirstLine()">Update first line</button>
<button type="button" ng-click="$ctrl.showPerformances()">Log performance</button>

<div class="inline-component">
  Delay: <input data-label="Delay" data-unit="ms" type="number" ng-model="$ctrl.delay"> ms
</div> -->

<!-- ## Empty table

<oui-table
  ng-if="$ctrl.trigger"
  rows="$ctrl.emptyList"
  page-size="10">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable>
    <a href="mailto:{{$value}}">{{$value}}</a>
  </column>
  <column property="phone"></column>
  <column property="birth" sortable>
    {{$value|date:short}}
  </column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
  <empty-placeholder>Aucun résultat</empty-placeholder>
</oui-table>
<button type="button" ng-click="$ctrl.addElement()">Add element</button> -->

<!-- ## Item selection

<oui-table
  ng-if="$ctrl.trigger"
  rows="$ctrl.data"
  page-size="10"
  on-selection-change="$ctrl.onSelectionChange($selection)">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column title="'Mère'" property="parents.mother.lastName" sortable>
    {{row.parents.mother.lastName}}, {{row.parents.mother.firstName}}
  </column>
  <column title="'Père'" property="parents.father.lastName" sortable>
    {{row.parents.father.lastName}}, {{row.parents.father.firstName}}
  </column>
  <column property="email" sortable>
    <a href="mailto:{{$value}}">{{$value}}</a>
  </column>
  <column property="phone"></column>
  <column property="birth" sortable>
    {{$value|date:short}}
  </column>
  <pagination>
    <simple-pagination current-page="$table.getCurrentPage()"
      page-count="$table.getPageCount()"
      on-next-page="$table.nextPage()"
      on-previous-page="$table.previousPage()"></simple-pagination>
  </pagination>
</oui-table> -->

## Clickable row

<oui-table rows="$ctrl.data"
    on-row-click="$ctrl.onClickRow($row, $event)"
    row-label="$row.firstName + ' ' + $row.lastName"
    page-size="25">
  <column property="firstName" sortable="asc"></column>
  <column property="lastName" sortable></column>
  <column property="email" sortable>
    <a href="mailto:{{$value}}">{{$value}}</a>
  </column>
  <column property="phone"></column>
  <column property="birth" sortable></column>
</oui-table>

