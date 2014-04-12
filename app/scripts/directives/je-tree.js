angular

  .module("je.tree", ['je.filters'])
  .directive("jeTree", function($compile, $timeout) {
    return {
      restrict: 'EA',
      template:
        '<div class="je-tree">' +
        '  <ul class="je-tree-node clear">' +
        '    <je-tree-node ng-repeat="(key, val) in jsoneditor.object" amount="amount" key="key" val="val"/>' +
        '  </ul>' +
        '</div>',
      replace: true,
      link: function($scope, iElement, iAttr) {

        $scope.title = 'Sample';

        $scope.amount = function amount(collection) {

          if (! angular.isArray(collection) && ! angular.isObject(collection)) {
            return null;
          }

          var size = 0, key;

          // no idea why we need the hasOwnProperty check but
          // http://stackoverflow.com/a/6700
          // has over 600 upvotes so there must be a very good reason for it
          // => TODO: to skip the prototyped properties, remove the test
          for (key in collection) {
            if (collection.hasOwnProperty(key)) size++;
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
          '<li ng-style="treeOpener(val)">' +
          '  <span class="je-tree-node-key" contenteditable="true">{{key}}</span>' +
          '  <span class="je-tree-node-key-value-seperator" contenteditable="true" ng-show="valAtomic(val)"></span>' +
          '  <span class="je-tree-node-value" contenteditable="true">{{val | jeTreeNodeValue}}</span> ' +
          '  <span class="je-tree-node-amount je-tree-node-type-{{ val | jeType}}">{{amount(val)}}</span>' +
          '</li>',
      replace: true,
      scope: {
        key: "=",
        val: "=",
        amount: "="
      },
      link: function (scope, element) {
        scope.children = null;

        scope.treeOpener = function treeOpener(val) {

          if (!scope.valAtomic(val)) {
            return '';
          }

          return {
            listStyleType: 'none'
          };
        }

        scope.valAtomic = function valAtomic(val) {
          return ! (angular.isArray(val) || angular.isObject(val));
        }

        scope.$watch('val', function() {

          var template =
            '<ul>' +
            '  <je-tree-node ' +
            '    ng-repeat="(childkey, childval) in val | jeCollection track by $id(childkey)" ' +
            '    key="childkey" val="childval" ' +
            '    amount="amount" />' +
            '</ul>';

          if (angular.isElement(scope.children)) {
            scope.children.remove();
          }

          scope.children = $compile(template)(scope);
          element.append(scope.children);
        });
      }
    };
  })

  ;
