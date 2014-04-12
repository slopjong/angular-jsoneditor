
angular
  .module('je.filters', [])

  // if we use je-collection this error pops up:
  // => Error: [$injector:unpr] Unknown provider:
  .filter('jeCollection', function() {
    return function(input) {

      if (angular.isArray(input) || angular.isArray(input)) {
        return input;
      }

      return [];
    };
  })

  .filter('jeType', function() {
    return function(input) {
      var type = 'atomic';
      switch(true) {
        case angular.isArray(input): type = 'array'; break;
        case angular.isObject(input): type = 'object'; break;
      }
      return type;
    };
  })

  .filter('jeTreeNodeValue', function() {
    return function(input) {

      // strings are considered array-like so isArrayLike() can't be used
      if (angular.isArray(input) || angular.isObject(input)) {
        return '';
      }

      // 'can't interpolate' whatever error appeared with the following
//      if (angular.isNull(input)) {
//        return 'null';
//      }

      return input;
    };
  })

  ;