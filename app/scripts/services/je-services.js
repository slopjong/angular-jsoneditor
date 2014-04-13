'use strict';

angular
  .module('je.services', [])

  .factory('jeConverter', function() {

    var object2ast = function object2ast(input) {

      var ast = [];

      angular.forEach(input, function(value, key){

        switch(true) {

          case value === null:

            ast.push({
              key: key,
              type: 'null',
              value: 'null'
            });
            break;

          // this case must be before the object case because
          // arrays are also considered as objects
          case angular.isArray(value):

            ast.push({
              key: key,
              type: 'array',
              children: object2ast(value)
            });
            break;

          case angular.isObject(value):

            ast.push({
              key: key,
              type: 'object',
              children: object2ast(value)
            });
            break;

          default:
            ast.push({
              key: key,
              type: typeof value,
              value: value
            });
        }
      })

      return ast;
    };

    var ast2object = function ast2object(input) {
      // this conversion is yet a placeholder
      return input;
    };

    return {
      object2ast: object2ast,
      ast2object: ast2object
    };
  })

  ;