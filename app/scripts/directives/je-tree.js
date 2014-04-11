angular
  .module("je.tree", [])
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
  });