export default {
    bindings: {
        $table: "<table",
        currentPage: "<",
        pageCount: "<",
        onNextPage: "&",
        onPreviousPage: "&"
    },
    controller: class {
        getPercents () {
            return `${100 * ((this.currentPage - 1) / (this.pageCount - 1))}%`;
        }
    },
    template: `<div class="pagination">
    <div class="pagination__progress" ng-style="{ width: $ctrl.getPercents() }"></div>
    <div class="pagination__body">
      <button type="button" class="oui-button oui-button_secondary"
        ng-show="$ctrl.currentPage > 1"
        ng-click="$ctrl.onPreviousPage()">&lt;</button>
      Page {{$ctrl.currentPage}} / {{$ctrl.pageCount}}
      <button type="button" class="oui-button oui-button_secondary"
        ng-show="$ctrl.currentPage < $ctrl.pageCount"
        ng-click="$ctrl.onNextPage()">&gt;</button>
    </div>
  </div>`
};
