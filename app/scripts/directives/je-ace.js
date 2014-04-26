'use strict';

angular
  .module("je.ace", ['ui.ace'])
  .directive("jeAce", function() {
    return {
      restrict: 'EA',
      template: '<div ng-mouseenter="sync(false)" ng-mouseleave="sync(true)" class="je-ace" ui-ace="$parent.jsoneditor.ace.options" ng-model="$parent.jsoneditor.json"></div>',
      replace: true,
      transclude: true,
      link: function(scope, element, attrs) {

        // merge the user config from the attribute je-ace with the
        // default settings
        scope.jsoneditor.ace.options = angular.extend(
          {},
          scope.jsoneditor.ace.options,
          scope.$eval(attrs.jeAce)
        );

        // We need to turn off the json sync when changing stuff
        // in the ace editor
        scope.sync = function(flag) {
          scope.jsoneditor.sync.json = flag;
        };

      }
    };
  });
