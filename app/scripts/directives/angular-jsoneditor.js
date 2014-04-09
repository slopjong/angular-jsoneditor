'use strict';

angular.module("jsoneditor", ['ui.ace'])

  .directive("jeSplitter", ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
//      template: '<div class="je-splitter" ng-transclude></div>',
      template: function(a, b, c) {
        var el = b.$$element;
        var el2 = angular.element(el[0]);
        //console.log('template', el2);

//        console.log(arguments);
        return '<div class="je-splitter" ng-transclude></div>';
      },
      replace: true,
      transclude: true,
      controller: function jeSplitterController($scope, $element, $attrs, $transclude) {
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

        // TODO: the additional containers are hidden by css
        //       this should be done here but there was trouble to access
        //       $$element properly to remove the containers from the dom
        this.addSplitter = function() {
//          console.log('add splitter', arguments);
        }

        // TODO: the additional containers are hidden by css
        //       this should be done here but there was trouble to access
        //       $$element properly to remove the containers from the dom
        this.removeContainer = function(element) {
//          console.log(element, element[0]);
//          console.log('remove container', arguments);
        }
      },
      link: function(scope, element, attrs, ctrl) {
        ctrl.removeContainer(element);
        ctrl.addSplitter(element);
      }

//      compile: function(scope, iElement, iAttr) {
////        angular.forEach(arguments, function(element){
////          console.log(element);
////        })
//        console.log('compile je-splitter', arguments);
//        return {
//          pre: function preLink() {
//            console.log('prelink je-splitter', arguments);
//          },
//          post: function postLink() {
//            console.log('postlink je-splitter', iElement);
//
//          }
//        }
//      }
    };
  }])

  .directive("jeContainer", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-container" ng-transclude></div>',
      replace: true,
      transclude: true,
      link: function($scope, iElement, iAttr) {
//        console.log('link je-container');
//        console.log($scope.$parent);
      }
    };
  })

  .directive("jeDrag", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-drag">⋮</div>',
      replace: true,
      link: function($scope, iElement, iAttr) {
//        console.log('link je-container');
//        console.log($scope.$parent);
      }
    };
  })

  .directive("jeText", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-text"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',
      replace: true,
      link: function(scope, iElement, iAttr) {
//        console.log('link je-text');
      }
    };
  })

  .directive("jeAce", function($compile) {
    return {
      restrict: 'EA',
      template: '<div class="je-ace" ui-ace="$parent.jsoneditor.ace.options" ng-model="$parent.jsoneditor.json"></div>',
      replace: true,
      transclude: true,
      link: function(scope, iElement, iAttr) {
//        console.log('link je-ace');
      }
    };
  })

  .directive("jeTree", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-tree"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',
      replace: true,
      transclude: true,
      link: function(scope, iElement, iAttr) {
//        console.log('link je-tree');
      }
    };
  })
  ;
