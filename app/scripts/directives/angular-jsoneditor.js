'use strict';

angular.module("jsoneditor", ['ui.ace'])

  .directive("jeSplitter", function($compile) {
    return {
      restrict: 'EA',
      template: '<div class="je-splitter" ng-transclude></div>',
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
          },
          width: {
            total: 0,
            left: 0,
            right: 0
          }
        };

//        $scope.getElementDimensions = function () {
//          return { 'h': $element.height(), 'w': $element.width() };
//        };
//
//        $scope.$watch(
//          $scope.getElementDimensions,
//          function (newValue, oldValue) {
//            console.log(newValue);
//          },
//          true
//        );

//        $element.bind('resize', function () {
//          //$scope.$apply();
//          console.log('resized');
//        });

        /**
         * Removes all non-containers. If there are more than two containers
         * all of them are removed too except the first two.
         *
         * @param splitter_block
         */
        this.removeChildren = function(splitter_block) {

          var amount_children = splitter_block[0].children.length;
          var removed_children = 0;

          // remove all direct children which are no containers
          angular.forEach(splitter_block[0].children, function(child) {
            if (! child.hasAttribute('je-container')) {
              child.remove();
              removed_children++;
            }
          });

          // how many containers do we have?
          var amount_containers = amount_children - removed_children;

          // remove all containers except the first two
          if (amount_containers > 2) {
            for(var i=2; i< amount_containers; i++) {
              splitter_block[0].children[i].remove();
            }
          }
        }

        /**
         * Adds a drag element after the first child of the splitter block.
         * @param splitter_block
         */
        this.addDrag = function(splitter_block) {

          // create the drag element
          var drag_element = $compile('<div je-drag></div>')($scope);

          // put it between both editor containers
          angular
            .element(splitter_block[0].children[0])
            .after(drag_element);
        }
      },
      link: function(scope, element, attrs, controller) {

        // outputs the width of the splitter div
//        console.log('splitter', element[0].offsetWidth);

        controller.removeChildren(element);
        controller.addDrag(element);

//        if (element[0].children.length > 0) {
//
//          width_left = element[0].children[0].offsetWidth;
//          width_right = element[0].children[2].offsetWidth;
//          width_total = width_left + width_right;
//        }
//        var drag_element = $compile('<div je-drag></div>')(scope);
//
////        angular.element(element[0].children[0]).after('<div je-drag2></div>');
//
////          console.log('splitter', element[0].children[0].offsetWidth);
//
//
//        ctrl.removeContainer(element);
//        ctrl.addSplitter(element);
      }
    };
  })

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
      controller: function jeDragController($scope, $element, $attrs, $transclude) {
        $scope.dragging = false;
        $scope.move = function() {
          console.log('move');
        }
      },
      template: '<div class="je-drag" ' +
        'ng-mousemove="move()" ' +
        'ng-mousedown="dragging = true" ' +
        'ng-mouseup="dragging = false"' +
        '>⋮</div>',
      replace: true,
      link: function($scope, iElement, iAttr) {
//        console.log('link je-drag');
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
