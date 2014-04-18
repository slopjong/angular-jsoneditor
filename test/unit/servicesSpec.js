'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('services', function() {

  beforeEach(module('je.services'));

  describe('Converter object2ast', function() {

    // this is an alternative if we want to inject the service locally
//    it('converter test', function() {
//      var $injector = angular.injector([ 'je.services' ]);
//      var jeConverter = $injector.get( 'jeConverter' );
//      expect( jeConverter.object2ast() ).toEqual(1);
//
//    });

    it('empty object to ast', inject(function(jeConverter) {
      expect( jeConverter.object2ast({}) ).toEqual({});
    }));

    it('empty array to ast', inject(function(jeConverter) {
      expect( jeConverter.object2ast([]) ).toEqual([]);
    }));

    it('All data types mixed', inject(function(jeConverter) {

      var test_data = {
        anumber: 1,
        anobject: {
          anarray: [
            {
              astring: 'astring'
            }
          ]
        }
      };

      var test_result = [
        {
          key: 'anumber',
          type: 'number',
          auto: false,
          value: 1
        },
        {
          key: 'anobject',
          type: 'object',
          auto: false,
          children:
          [
            {
              key: 'anarray',
              type: 'array',
              auto: false,
              children: [
                {
                  key: 0,
                  type: 'object',
                  auto: false,
                  children: [
                    {
                      key: 'astring',
                      type: 'string',
                      auto: false,
                      value: 'astring'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      expect( jeConverter.object2ast(test_data) ).toEqual(test_result);
    }));

  });

  describe('Converter ast2object', function() {

    it('All data types mixed', inject(function(jeConverter) {

      var test_result = {
        anumber: 1,
        anobject: {
          anarray: [
            {
              astring: 'astring'
            }
          ]
        }
      };

      var test_data = [
        {
          key: 'anumber',
          type: 'number',
          value: 1
        },
        {
          key: 'anobject',
          type: 'object',
          children:
            [
              {
                key: 'anarray',
                type: 'array',
                children: [
                  {
                    key: 0,
                    type: 'object',
                    children: [
                      {
                        key: 'astring',
                        type: 'string',
                        value: 'astring'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ];

      expect( jeConverter.ast2object(test_data) ).toEqual(test_result);

    }));
  });

  describe('Converter ast2object object2ast roundtrip', function() {

    // TODO: this test isn't very useful
    //       in angular [0,1] is the same than {"0":0,"1":1}
    it('All data types mixed', inject(function(jeConverter) {

      var data = {
        anumber: 1,
        anobject: {
          anarray: [
            {
              astring: 'astring'
            }
          ],
          anotherarray: [
            1,
            2
          ]
        }
      };

      var result = jeConverter.ast2object(jeConverter.object2ast(data));
      expect(result).toEqual(data);

    }));
  });

});
