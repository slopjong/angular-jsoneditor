angular

  .module("je.tree", ['je.filters'])
  .directive("jeTree", function($compile, $timeout) {
    return {
      restrict: 'EA',
      template:
        '<div class="je-tree">' +
        '  <ul class="je-tree-node clear">' +
        '    <je-tree-node ng-repeat="(key, val) in jsoneditor.object" key="key" val="val"/>' +
        '  </ul>' +
        '</div>',
      replace: true,
      link: function($scope, iElement, iAttr) {

        $scope.title = 'Sample';
        $scope.amount = function amount() {
          var obj = $scope.jsoneditor.object;
          var size = 0, key;

          // no idea why we need the hasOwnProperty check but
          // http://stackoverflow.com/a/6700
          // has over 600 upvotes so there must be a very good reason for it
          // => TODO: to skip the prototyped properties, remove the test
          for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
          }
          return size;
        };
      }
    };
  })

  .directive('jeTreeNode', function ($compile) {
    return {
      restrict: 'EA',
      template: '<li>{{key}} <span class="je-helper-amount je-helper-{{val | jeType}}">{{val | jeType}}</span></li>',
      replace: true,
      scope: {
        key: "=",
        val: "="
      },
      link: function (scope, element) {
        scope.$watch('val', function() {
          var template =
            '<ul>' +
            '  <je-tree-node ' +
            '    ng-repeat="(childkey, childval) in val | jeCollection" ' +
            '    key="childkey" val="childval" />' +
            '</ul>';
          element.append($compile(template)(scope));
        });
      }
    };
  })

  ;
