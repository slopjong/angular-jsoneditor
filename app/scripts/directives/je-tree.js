'use strict';

angular

  .module("je.tree", ['je.filters', 'sj.input'])
  .directive("jeTree", function($compile) {
    return {
      restrict: 'EA',
      template:
        '<div ng-focus="focus" ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-tree">' +
        '  <ul class="je-tree-node clear">' +
        '    <je-tree-node ng-repeat="item in _ast" amount="amount" item="item" class="je-tree-root"/>' +
        '  </ul>' +
        '</div>',
      replace: true,
      link: function($scope, element, attributes) {

        // wrapper for the abstract syntax tree so that we can give
        // it a name and add a context menu to the top level
        $scope._ast = [
          {
            key: 'Sample',
            type: 'object',
            children: []
          }
        ];

        // observe the ast and update update our _ast which wraps it
        // in order to give the tree some sort of a title
        $scope.$watch('jsoneditor.ast', function(ast) {
          $scope._ast[0].children = ast;
        }, true);

        // We need to turn of the object to ast sync when changing stuff
        // in the tree editor. The ast to object sync, however stays
        // enabled. Because the object is synced on ast changes, the
        // ast would synced again and thus the editable input/div/span
        // elements would lose the focus after changing one character.
        $scope.sync = function(flag) {
          $scope.jsoneditor.sync.ast = flag;
        };

        $scope.amount = function amount(collection) {

          if (! angular.isArray(collection) && ! angular.isObject(collection)) {
            return null;
          }

          var size = 0, key;

          for (key in collection) {
            // we check with hasOwnProperty to avoid considering the
            // prototyped properties
            if (collection.hasOwnProperty(key)) {
              size++;
            }
          }

          return size;
        };
      }
    };
  })

  .directive('jeTreeNode', function ($compile) {
    return {
      restrict: 'EA',
      template:
          '<li ng-style="treeOpener(item)">' +
          '  <span class="je-tree-node-key" ng-show="$parent.item.type == \'array\' || isRootNode()" ng-bind="item.key"></span>' +
          '  <input sj-input class="je-tree-node-key {{emptyKey()}}" ng-show="$parent.item.type == \'object\' && ! isRootNode()" type="text" ng-model="item.key" placeholder="Field">' +
          '  <span class="je-tree-node-key-value-seperator" ng-show="valAtomic(item)"></span>' +
          '  <input sj-input class="je-tree-node-value {{emptyValue()}}" type="text" ng-model="item.value" ng-show="valAtomic(item)" placeholder="Value">' +
          '  <span class="je-tree-node-amount je-tree-node-type-{{item.type}}">{{amount(item.children)}}</span>' +
          '</li>',
      replace: true,
      scope: {
        item: "=",
        amount: "="
      },
      link: function (scope, element) {

        scope.isRootNode = function isRootNode() {
          return element.hasClass('je-tree-root');
        };

        scope.emptyKey = function() {
          if (String(scope.item.key) === '') {
            return 'empty-key';
          }
        };

        scope.emptyValue = function() {
          if (String(scope.item.value) === '') {
            return 'empty-value';
          }
        };

        scope.children = null;

        scope.treeOpener = function treeOpener(val) {

          if (!scope.valAtomic(val)) {
            return '';
          }

          return {
            listStyleType: 'none'
          };
        };

        scope.valAtomic = function valAtomic(item) {
          return ! item.hasOwnProperty('children');
        };

        var template =
          '<ul>' +
          '  <je-tree-node ' +
          '    ng-repeat="childitem in item.children | jeCollection track by $id(childitem)" ' +
          '    item="childitem" ' +
          '    amount="amount" />' +
          '</ul>';

        if (angular.isElement(scope.children)) {
          scope.children.remove();
        }

        scope.children = $compile(template)(scope);
        element.append(scope.children);
      }
    };
  })

  ;
