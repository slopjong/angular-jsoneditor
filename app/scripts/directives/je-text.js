angular
  .module("je.text", [])
  .directive("jeText", function() {
    return {
      restrict: 'EA',
      template: '<div class="je-text"><textarea ng-model="$parent.jsoneditor.json"></textarea></div>',
      replace: true,
      link: function(scope, iElement, iAttr) {
//        console.log('link je-text');
      }
    };
  });
