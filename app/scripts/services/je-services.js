'use strict';

angular
  .module('je.services', [])

  .factory('jeConverter', function() {

    /**
     * Converts a value from one type to another. The original value
     * is return for types other than 'string', 'number' and 'boolean'.
     *
     * @see [Javascript Type-Conversion]{@link http://jibbering.com/faq/notes/type-conversion}
     * @param value
     * @param type
     * @return {*}
     */
    var toType = function toType(value, type) {

      switch (type) {

        case 'auto':

          // checks if value contains true/false (regardless the type)
          var booleanLike =
            (typeof value === 'string' || typeof value === 'boolean') &&
            (value === 'true' || value === 'false' || value === true || value === false);

          var nullLike =
            (typeof value === 'string' || typeof value === null) &&
              (value === 'null' || value === null);

          /**********************************************************/

          if (typeof value === 'string' && value === '') {
            return '';
          }

          if (nullLike) {
            return null;
          }

          try {
            return JSON.parse(value);
          } catch (e) {
            // do nothing here
          }

          if (booleanLike) {
            return Boolean(value);
          }

          if (! isNaN(Number(value))) {
            return Number(value);
          }

          return String(value);

        case 'number':

          var number = Number(value);
          if (isNaN(number)) {
            number = 0;
          }
          return number;

        case 'string':

          return String(value);

        case 'boolean':

          return Boolean(value);

        default:

          return value;
      }
    };

    var toNumber = function toNumber(value) {
      return toType(value, 'number');
    };

    var toString = function toString(value) {
      return toType(value, 'string');
    };

    var toBoolean = function toBoolean(value) {
      return toType(value, 'boolean');
    };

    /**
     * Converts an object to an abstract syntax tree. The auto parameter
     * is meant to dynamically adapt the data type of the input by detecting
     * a number or a boolean.
     *
     * @param {*} input
     * @param {boolean} auto 'auto' type for atomic input values
     * @return {Array}
     */
    var object2ast = function object2ast(input, auto) {

      var ast = [];
      var _auto = auto || false;

      angular.forEach(input, function(value, key){

        switch(true) {

          case value === null:

            ast.push({
              key: key,
              type: 'null',
              auto: _auto,
              value: 'null'
            });
            break;

          // this case must be before the object case because
          // arrays are also considered as objects
          case angular.isArray(value):

            ast.push({
              key: key,
              type: 'array',
              auto: false,
              children: object2ast(value, _auto)
            });
            break;

          case angular.isObject(value):

            ast.push({
              key: key,
              type: 'object',
              auto: false,
              children: object2ast(value, _auto)
            });
            break;

          default:
            ast.push({
              key: key,
              type: typeof value,
              auto: _auto,
              value: value
            });
        }
      });

      return ast;
    };

    var ast2object = function ast2object(input) {

      var object = {};

      angular.forEach(input, function(item) {

        switch(true) {

          case item.type === 'null':

            if (item.auto) {
              object[item.key] = toType(item.value, 'auto');
            } else {
              object[item.key] = null;
            }

            break;

          case item.type === 'array':

            var arr = [];
            if (item.hasOwnProperty('children') &&
              angular.isArray(item.children)) {
              angular.forEach(ast2object(item.children), function(element){
                arr.push(element);
              });

              object[item.key] = arr;
            }
            break;

          case item.type === 'object':

            if (item.hasOwnProperty('children') &&
              angular.isObject(item.children)) {

              object[item.key] = ast2object(item.children);
            }
            break;

          default:

            if (item.auto) {
              object[item.key] = toType(item.value, 'auto');
            } else {
              object[item.key] = toType(item.value, item.type);
            }
        }
      });

      return object;
    };

    return {
      object2ast: object2ast,
      ast2object: ast2object,
      toBoolean: toBoolean,
      toNumber: toNumber,
      toString: toString
    };
  })

  ;