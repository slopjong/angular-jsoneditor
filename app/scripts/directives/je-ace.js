'use strict';

angular
  .module("je.ace", ['ui.ace'])
  .directive("jeAce", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-ace" ui-ace="$parent.jsoneditor.ace.options" ng-model="$parent.jsoneditor.json"></div>',
      replace: true,
      transclude: true,
      link: function(scope, iElement, iAttr) {
//        console.log('link je-ace');
      }
    };
  });
