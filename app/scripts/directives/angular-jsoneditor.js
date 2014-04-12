'use strict';

angular.module("jsoneditor", ['je.ace', 'je.text', 'je.tree'])

  .directive("jeSplitter", function($compile) {
    return {
      restrict: 'EA',
      template: '<div ng-mousemove="move($event)" ng-mouseleave="jsoneditor.dragging = false" class="je-splitter" ng-transclude></div>',
      replace: true,
      transclude: true,
      controller: function jeSplitterController($scope, $element, $attrs, $transclude) {

        var sample_object = {
          "array": [
            1,
            2,
            3
          ],
          "boolean": true,
          "null": null,
          "number": 123,
          "object": {
            "a": "b",
            "c": "d",
            "e": "f"
          },
          "string": "Hello World"
        }

//        console.log(JSON.stringify(sample_object));

        // we scope our stuff to avoid conflicts with inherited scopes
        // -> as long as ng-transclude is true we must inherit from the
        //    parent scope, to understand how transclusion & inheritance
        //    works, see
        //      * http://sravi-kiran.blogspot.de/2013/07/BehaviourOfScopeInAngularJsDirectives.html
        //      * http://stackoverflow.com/questions/16653004/confused-about-angularjs-transcluded-and-isolate-scopes-bindings
        $scope.jsoneditor = {
          json: JSON.stringify(sample_object),
          object: {},
          tree: [],
          ace: {
            options: {
              mode: 'json',
              showIndentGuides: false,
              showInvisibles: false,
              showPrintMargin: false,
              useWrapMode: true
            }
          },
          container: {
            width: {
              left: 100,
              right: 100
            },
            editor: {
              left: null,
              right: null
            }
          },
          dragElement: null,
          dragging: false
        };

        // observe json changes and parse the string if there are any
        $scope.$watch('jsoneditor.json', function(newJson) {
          try {
            $scope.jsoneditor.object = JSON.parse(newJson);
          } catch(e) {
            console.log('could not parse the json');
          }
        });

        $scope.move = function move($event) {
          if ($scope.jsoneditor.dragging) {
            // get the cursor's relative position inside the splitter
            // container, the unit is %
            var cursor_pos = $event.clientX - $element[0].offsetLeft;
            var splitter_width = $element[0].offsetWidth;
            var rel_position = 100 * cursor_pos / splitter_width;
            $scope.resizeEditors(rel_position);
          }
        };

        // here we do data binding ourselves since we can't rely on
        // angular's native one because we dynamically remove and add
        // elements in the splitter container after the containers and
        // thus the editors have been compiled and linked
        $scope.$watch('jsoneditor.container.width', function(newValue) {
          if (
            angular.isObject($scope.jsoneditor.container.editor.left) &&
            angular.isObject($scope.jsoneditor.container.editor.right)
          ) {
            $scope.jsoneditor.container.editor.left.style.width = newValue.left + '%';
            $scope.jsoneditor.container.editor.right.style.width = newValue.right + '%';
          }
        }, true);

        $scope.resizeEditors = function resizeEditors(cursor_position) {

          /* DO NOTHING HERE IF DRAGGING IS DISABLED */

          if ($scope.jsoneditor.dragging) {

            var splitter_width = $element[0].offsetWidth;
            var offset = 0;

            if (angular.isObject($scope.jsoneditor.dragElement)) {

              // get the drag element's width respecting the margin,
              // padding and the border

              var drag_element = $scope.jsoneditor.dragElement[0];

              // get the element's computed margin,
              // currentStyle = msie, the other for anything else
              var style = drag_element.currentStyle ||
                window.getComputedStyle(drag_element);

              var margin = parseInt(style.marginLeft, 10)
                + parseInt(style.marginRight, 10);

              var drag_width = margin + drag_element.offsetWidth;

              offset = 100 * (drag_width / splitter_width) / 2;
            }

            // set the editor dimension in percentage
            $scope.jsoneditor.container.width.left = cursor_position - offset;
            $scope.jsoneditor.container.width.right = 100 - cursor_position - offset;
          }
        };

        /**
         * Removes all non-containers. If there are more than two containers
         * all of them are removed too except the first two.
         *
         * @param splitter_block
         */
        this.removeChildren = function removeChildren(splitter_block) {

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
        };

        /**
         * @deprecated
         * @param element
         * @param name
         * @param value
         */
        this.addAttribute = function addAttribute(element, name, value) {
          var attribute = document.createAttribute(name);
          attribute.nodeValue = value;
          element.setAttributeNode(attribute);
        };

        /**
         * Adds a drag element after the first child of the splitter block.
         * @param splitter_block
         * @return drag element
         */
        this.addDrag = function addDrag(splitter_block) {

          // create the drag element
          var drag_element = $compile('<div je-drag></div>')($scope);

          // put it between both editor containers
          angular
            .element(splitter_block[0].children[0])
            .after(drag_element);

          return drag_element;
        };
      },
      link: function(scope, element, attrs, controller) {

        controller.removeChildren(element);

        // make the two editor instances public to the scope
        scope.jsoneditor.container.editor.left = element[0].children[0];
        scope.jsoneditor.container.editor.right = element[0].children[1];

        // add a drag element to the splitter container and make it
        // public to the scope
        scope.jsoneditor.dragElement = controller.addDrag(element);
      }
    };
  })

  .directive("jeContainer", function() {
    return {
      restrict: 'EA',
      template: '<div ng-style="" class="je-container" ng-transclude></div>',
//      template: function() {
//        console.log(arguments);
//        return '<div ng-style="" class="je-container" ng-transclude></div>';
//      },
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
      controller: function jeDragController($scope, $element, $attrs, $transclude) {},
      template: '<div class="je-drag je-unselectable" ' +
        'ng-mousedown="jsoneditor.dragging = true" ' +
        'ng-mouseup="jsoneditor.dragging = false"' +
        '>⋮</div>',
      replace: true,
      link: function($scope, iElement, iAttr) {
//        console.log('link je-drag');
      }
    };
  })
  ;
