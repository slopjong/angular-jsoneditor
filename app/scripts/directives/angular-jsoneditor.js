'use strict';

angular.module("jsoneditor", ['ui.ace'])

  .directive("jeSplitter", ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      template: '<div class="je-splitter" ng-transclude></div>',
      replace: true,
      transclude: true,
      controller: function jeContainerController($scope, $element, $attrs, $transclude) {
        $scope.jsoneditor = {
          json: '{"test": "tasdfasdf"}',
          ace: {
            options: {
              mode: 'json',
              showIndentGuides: false,
              showInvisibles: true,
              showPrintMargin: false,
              useWrapMode: true
            }
          }
        };
      },
      link: function(scope, iElement, iAttr) {},
      compile: function(scope, iElement, iAttr) {}
    };
  }])

  .directive("jeContainer", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-container" ng-transclude></div>',
      replace: true,
      transclude: true,
      link: function($scope, iElement, iAttr) {},
      compile: function(scope, iElement, iAttr) {}
    };
  })

  .directive("jeText", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-text"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',
      replace: true,
      link: function(scope, iElement, iAttr) {
      },
      compile: function(scope, iElement, iAttr) {}
    };
  })

  .directive("jeAce", function($compile) {
    return {
      restrict: 'EA',
      template: '<div class="je-ace" ui-ace="$parent.jsoneditor.ace.options" ng-model="$parent.jsoneditor.json"></div>',
      replace: true,
      transclude: true,
      link: function(scope, iElement, iAttr) { },
      compile: function(scope, iElement, iAttr) {
      }
    };
  })

  .directive("jeTree", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-tree"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',
      replace: true,
      transclude: true,
      link: function(scope, iElement, iAttr) {},
      compile: function(scope, iElement, iAttr) {}
    };
  })
  ;
