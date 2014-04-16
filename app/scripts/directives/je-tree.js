'use strict';

angular

  .module("je.tree", ['je.filters', 'sj.input'])
  .directive("jeTree", function($compile) {
    return {
      restrict: 'EA',
      template:
        '<div ng-focus="focus" ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-tree">' +
        '  <ul class="je-tree-node je-tree-root">' +
        '    <je-tree-node ng-repeat="item in _ast" amount="amount" item="item" index="$index" class="je-tree-root" level="0" />' +
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
          '<li class="je-tree-node-type-{{item.type}} je-tree-node-type-{{$parent.item.type}}-parent">' +
          '  <i ng-click="menu.copy(index)" class="je-tree-node-menu-copy fa fa-copy je-transparent-{{isRootNode()}}"></i> ' +
          '  <i ng-click="menu.remove(index)" class="je-tree-node-menu-remove fa fa-minus-circle je-transparent-{{isRootNode()}}"></i> ' +
          '  <i ng-style="treeOpenerStyle" class="je-tree-opener fa fa-caret-down je-transparent-{{valAtomic(item)}}" ng-click="toggleChildren()" ></i> ' +
          '  <span class="je-tree-node-key" ng-show="$parent.item.type == \'array\' || isRootNode()" ng-bind="item.key"></span>' +
          '  <input sj-input class="je-tree-node-key {{emptyKeyClass()}}" ng-show="$parent.item.type == \'object\' && ! isRootNode()" type="text" ng-model="item.key" placeholder="Field">' +
          '  <span class="je-tree-node-key-value-seperator" ng-show="valAtomic(item)"></span>' +
          '  <input sj-input class="je-tree-node-value {{emptyValueClass()}}" type="text" ng-model="item.value" ng-show="valAtomic(item)" placeholder="Value">' +
          '  <span class="je-tree-node-amount">{{amount(item.children)}}</span>' +
          '</li>',
      replace: true,
      scope: {
        index: "=",
        item: "=",
        amount: "=",
        level: "="
      },
      link: function (scope, element) {

        scope.menu = {
          copy: function copy(index) {

            // create an item copy and add it to the children array,
            // this procedure doesn't depend on the item type!
            var item_copy = angular.copy(scope.$parent.item.children[index]);

            if (scope.$parent.item.type === 'array') {
              item_copy.key = index + 1;
              // update the moved items after index which no longer match the array indices
              for (var i=index + 2; i<scope.$parent.item.children.length; i++) {
                scope.$parent.item.children[i].key = i;
              }
            }

            if (scope.$parent.item.type === 'object') {

              // all the keys that end with "_copyX" with X = a number.
              // this arra is only relevant for parent nodes that are an
              // object, the keys of items with an array as their parent
              // are rebased differently
              var copy_numbers = [];

              var key_prefix = item_copy.key;
              var itemPreviouslyCopied = /_copy[0-9]*$/.test(key_prefix);
              if (! itemPreviouslyCopied) {
                key_prefix += '_copy';
              } else {
                key_prefix = key_prefix.replace(/[0-9]+$/, '');
              }

              var regex = new RegExp(key_prefix + "[0-9]*$");

              angular.forEach(scope.$parent.item.children, function(item, index) {

                // 1. test the regex, if false do nothing
                // 2. substitute the key_prefix to get the number
                // 3. add it to the copy_numbers collection
                if (regex.test(item.key)) {
                  var copy_number = parseInt(item.key.replace(key_prefix, ''));

                  if (!isNaN(copy_number)) {
                    copy_numbers.push(copy_number);
                  }
                }
              });

              if (copy_numbers.length === 0) {
                item_copy.key = key_prefix + '0';
              } else {
                // sort() does a lexical sort, this means 13 < 7 and
                // thus we define our own sorting function
                copy_numbers.sort(function(a, b){
                  return a-b;
                });

                var copy_number = copy_numbers[copy_numbers.length - 1] + 1;
                item_copy.key = key_prefix + copy_number;
              }
            }

            scope.$parent.item.children.splice(index + 1, 0, item_copy);
          },
          remove: function remove(index) {
            scope.$parent.item.children.splice(index, 1);
          }
        };

        scope.children = null;

        scope.treeOpenerStyle = {
          marginLeft: scope.level * 20 + 'px'
        };

        // are the children elements collapsed?
        scope.collapsed = false;

        scope.isRootNode = function isRootNode() {
          return element.hasClass('je-tree-root');
        };

        scope.emptyKeyClass = function() {
          if (String(scope.item.key) === '') {
            return 'empty-key';
          }
        };

        scope.emptyValueClass = function() {
          if (String(scope.item.value) === '') {
            return 'empty-value';
          }
        };

        scope.toggleChildren = function toggleChildren() {

          // on atomic items (item.value != object or array) the tree
          // opener is transparent but present in the DOM. We need to
          // skip click events on those transparent openers
          if (! scope.valAtomic(scope.item)) {

            var treeOpener = element.find('i').eq(0);

            scope.collapsed = ! scope.collapsed;

            if ( ! scope.collapsed) {
              treeOpener
                .removeClass('fa-caret-right')
                .addClass('fa-caret-down');
            } else {
              treeOpener
                .removeClass('fa-caret-down')
                .addClass('fa-caret-right');
            }
          }
        };

        scope.valAtomic = function valAtomic(item) {
          return ! item.hasOwnProperty('children');
        };

        var template =
          '<ul ng-hide="collapsed">' +
          '  <je-tree-node ' +
          '    ng-repeat="childitem in item.children | jeCollection track by $id(childitem)" ' +
          '    index="$index" ' +
          '    item="childitem" ' +
          '    amount="amount" ' +
          '    menu="menu" ' +
          '    level="level+1" />' +
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
