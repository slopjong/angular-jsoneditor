'use strict';

angular

  .module("je.tree", ['je.tree.node'])
  .directive("jeTree", function($compile, $http) {
    return {
      restrict: 'EA',
      template:
        '<div ng-focus="focus" ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-tree">' +
        '  <ul class="je-tree-node je-tree-root">' +
        '    <je-tree-node schema="schema" ng-repeat="item in _ast" amount="amount" item="item" index="$index" class="je-tree-root" level="0" />' +
        '  </ul>' +
        '</div>',
      replace: true,
      link: function($scope, element, attributes) {

        // get the schema if it's defined as an attribute
        if (angular.isDefined(element.attr('schema'))) {
          $http.post(element.attr('schema'))
            .success(function(data, status, headers, config) {
              $scope.schema = data;
            }).error(function(data, status, headers, config) {
              throw new Error('Could not load the schema!');
            });
        } else {
          $scope.schema = {
            "description":"Object",
            "type":"object",
            "recursive": true,
            "properties":{
              "Array":{
                "description":"An array",
                "type":"array"
              },
              "Object":{
                "description":"An object",
                "type":"object"
              },
              "String":{
                "description":"A string",
                "type":"string"
              },
              "Number":{
                "description":"A number",
                "type":"number"
              },
              "Boolean":{
                "description":"A boolean",
                "type":"boolean"
              },
              "Null":{
                "description":"A null",
                "type":"null"
              }
            }
          };
        }

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

  ;
