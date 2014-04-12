
angular
  .module('je.filters', [])

  // if we use je-collection this error pops up:
  // => Error: [$injector:unpr] Unknown provider:
  .filter('jeCollection', function() {
    return function(input) {

      if ( ! angular.isArray(input) && ! angular.isObject(input)) {
        return [];
      }

      return input;
    };
  })

  .filter('jeType', function() {
    return function(input) {
      return typeof input;
    };
  })

  ;