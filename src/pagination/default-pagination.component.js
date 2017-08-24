import { capitalize, range } from "../util";
import "./default-pagination.less";

export default {
    bindings: {
        currentPage: "<",
        pageCount: "<",
        pageSize: "<",
        totalItems: "<",
        onNextPage: "&",
        onPreviousPage: "&",
        onPage: "&",
        onPageSizeChange: "&"
    },
    controller: class {
        constructor ($timeout, ouiTableConfiguration) {
            "ngInject";

            this.$timeout = $timeout;
            this.config = ouiTableConfiguration;
        }

        $onInit () {
            this.buttons = this.getButtons();
            this.pagesList = this.getPagesList();
        }

        $onChanges (changes) {
            if (changes.pageCount) {
                this.pagesList = this.getPagesList();
            }
        }

        getPercents () {
            return `${100 * ((this.currentPage - 1) / (this.pageCount - 1))}%`;
        }

        getButtons () {
            const buttons = [];
            for (let i = 0; i < Math.min(5, this.pageCount); i++) {
                buttons.push({
                    page: i + 1,
                    offset: i * this.pageSize
                });
            }
            return buttons;
        }

        getOffset () {
            return (this.currentPage - 1) * this.pageSize + 1;
        }

        getLastElementOffset () {
            return Math.min(this.getOffset() + this.pageSize - 1, this.totalItems);
        }

        pageSizeKeydown ($event) {
            // Space
            if ($event.keyCode === 32) {
                $event.preventDefault();
                this.pageSizeToggle($event);
            } else
            // Escape
            if ($event.keyCode === 27) {
                $event.preventDefault();
                this.menuPageSizeVisible = false;
            }
        }

        pageNumberKeydown ($event) {
            // Space
            if ($event.keyCode === 32) {
                $event.preventDefault();
                this.pageNumberToggle($event);
            } else
            // Escape
            if ($event.keyCode === 27) {
                $event.preventDefault();
                this.menuPageNumberVisible = false;
            }
        }

        pageSizeToggle () {
            this.menuPageSizeVisible = !this.menuPageSizeVisible;
            this.menuPageNumberVisible = false;
        }

        pageNumberToggle () {
            this.menuPageNumberVisible = !this.menuPageNumberVisible;
            this.menuPageSizeVisible = false;
        }

        setPageSize (pageSize) {
            this.menuPageSizeVisible = false;
            if (pageSize === this.pageSize) {
                return;
            }
            this.onPageSizeChange({ $pageSize: pageSize });
            // Buttons list must be changed on next tick
            // to let this.pageCount value being propagated.
            this.$timeout(() => {
                this.buttons = this.getButtons();
                this.pagesList = this.getPagesList();
            });
        }

        setPageNumber (page) {
            this.menuPageNumberVisible = false;
            if (page === this.currentPage) {
                return;
            }
            this.onPage({ $page: page });
        }

        getPagesList () {
            return range(this.pageCount).map(item => item + 1);
        }

        capitalize (string) {
            return capitalize(string);
        }
    },
    template: `<div class="tui-pagination">
        <div class="tui-pagination__text">
          <div class="tui-pagination__size-selector tui-dropdown">
            <span role="button"
                class="tui-pagination__size-selector-text"
                ng-click="$ctrl.pageSizeToggle()"
                ng-keydown="$ctrl.pageSizeKeydown($event)"
                aria-pressed="$ctrl.menuPageSizeVisible"
                tabindex="0">
                <span ng-bind="$ctrl.getOffset()"></span> -
                <span ng-bind="$ctrl.getLastElementOffset()"></span>
            </span>
            <div class="tui-dropdown-menu"
              ng-class="{ 'tui-dropdown-menu_visible': $ctrl.menuPageSizeVisible }">
              <ul class="tui-dropdown-menu__content">
                <li class="tui-dropdown-menu__group"
                    ng-bind="$ctrl.config.words.resultsPerPage">Results per page</li>
                <li class="tui-dropdown-menu__item"
                  ng-repeat="pageSize in $ctrl.config.pageSizes">
                  <button class="oui-button"
                    ng-class="{ 'oui-button_selected': $ctrl.pageSize === pageSize }"
                    ng-bind="pageSize"
                    ng-click="$ctrl.setPageSize(pageSize)"></button>
                </li>
              </ul>
            </div>
          </div>
          <span ng-bind="$ctrl.config.words.of"></span>
          <span ng-bind="$ctrl.totalItems"></span>
          <span ng-bind="$ctrl.config.words.results"></span>
        </div>
        <div class="tui-pagination__selector"
          ng-if="$ctrl.pageCount > 1">
          <button type="button" class="oui-button oui-button_secondary oui-button_icon-only oui-button_small-width"
            ng-disabled="$ctrl.currentPage <= 1"
            ng-click="$ctrl.onPreviousPage()"
            aria-label="{{$ctrl.config.words.previous}}">
            <i class="oui-icon oui-icon-chevron-left" aria-hidden="true"></i>
          </button>
          <div class="oui-button-group"
            ng-if="$ctrl.pageCount <= 5">
            <button
              ng-repeat="button in $ctrl.buttons track by button.page"
              class="oui-button oui-button_small-width"
              ng-class="button.page === $ctrl.currentPage ? 'oui-button_primary' : 'oui-button_secondary'"
              ng-bind="button.page"
              ng-click="$ctrl.setPageNumber(button.page)"></button>
          </div>
          <div class="tui-dropdown"
            ng-if="$ctrl.pageCount > 5">
            <button class="oui-button oui-button_secondary oui-button_icon-right"
              ng-click="$ctrl.pageNumberToggle()"
              ng-keydown="$ctrl.pageNumberKeydown($event)"
              aria-pressed="$ctrl.menuPageNumberVisible">
              <span>
                <span ng-bind="$ctrl.capitalize($ctrl.config.words.page)"></span>
                <span ng-bind="$ctrl.currentPage"></span>
                <span ng-bind="$ctrl.config.words.of"></span>
                <span ng-bind="$ctrl.pageCount"></span>
              </span>
              <i class="oui-icon oui-icon-chevron-down" aria-hidden="true"></i></button>
              <div class="tui-dropdown-menu"
                ng-class="{ 'tui-dropdown-menu_visible': $ctrl.menuPageNumberVisible }">
                <ul class="tui-dropdown-menu__content">
                  <li class="tui-dropdown-menu__item"
                    ng-repeat="page in $ctrl.pagesList">
                    <button class="oui-button"
                      ng-class="{ 'oui-button_selected': page === $ctrl.currentPage }"
                      ng-bind="page"
                      ng-click="$ctrl.setPageNumber(page)"
                      aria-label="{{$ctrl.capitalize($ctrl.config.words.page)}} {{page}} {{$ctrl.config.words.of}} {{$ctrl.pageCount}}"></button>
                  </li>
                </ul>
              </div>
          </div>
          <button type="button" class="oui-button oui-button_secondary oui-button_icon-only oui-button_small-width"
            ng-disabled="$ctrl.currentPage >= $ctrl.pageCount"
            ng-click="$ctrl.onNextPage()"
            aria-label="{{$ctrl.config.words.next}}">
              <i class="oui-icon oui-icon-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
      </div>`
};
