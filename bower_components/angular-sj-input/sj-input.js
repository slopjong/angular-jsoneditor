'use strict';

// Original jQuery code by James Padolsey
// Ported to AngularJS by Romain Schmitz
// Directive based on http://stackoverflow.com/a/931695
angular
  .module("sj.input", [])
  .directive("sjInput", function($compile, $document) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attributes, ngModel) {

        // default settings
        var config = {
          maxWidth: 1000,
          minWidth: 0,
          comfortZone: 8
        };

        function computed(element) {
          // get the element's computed style
          return element[0].currentStyle ||
            window.getComputedStyle(element[0]);
        }

        var style = computed(element);
        var minWidth = config.minWidth || parseInt(style.width);

        // create a new test element with the same style as the input element
        var testSubject = $compile('<sj-input-tester></je-input-tester>')(scope);
        testSubject.css({
          position: 'absolute',
          top: -9999 + 'px',
          left: -9999 + 'px',
          width: 'auto',
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          whiteSpace: 'nowrap'
        });

        var check = function() {

          if ( ! angular.isDefined(ngModel.$viewValue) ||
            ! angular.isFunction(ngModel.$viewValue.replace)) {
            return;
          }

          // escape the text to avoid wrong rendering because of wrong
          // browser encoding settings
          var escaped = ngModel.$viewValue
            .replace(/&/g, '&amp;')
            .replace(/\s/g,'&nbsp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          testSubject.html(escaped);

          // Calculate new width + whether to change
          var testerWidth = parseInt(computed(testSubject).width);

          var newWidth;

          if ( (testerWidth + config.comfortZone) >= minWidth) {
            newWidth = testerWidth + config.comfortZone;
          } else {
            newWidth = minWidth;
          }

          var currentWidth = parseInt(computed(element).width);

          var isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth) ||
            (newWidth > minWidth && newWidth < config.maxWidth);

          if (isValidWidthChange) {
            element.css('width', newWidth + 'px');
          }
        };

        element.after(testSubject);

        element.on('keyup keydown blur update', check);
        $document.ready(check);
      }
    };
  });
