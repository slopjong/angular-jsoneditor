'use strict';

angular.module('angularJsonEditor')
  .controller(
    'MainCtrl',
    function ($scope) {
      $scope.aceLoaded = function(e) {
        // do whatever needs to be done when the ace editor has loaded
      };

      $scope.aceChanged = function(e) {
        // do whatever needs to be done when the text in the ace editor
        // has changed
      };
    }
  );
