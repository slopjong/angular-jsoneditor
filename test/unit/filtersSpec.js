'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('filter', function() {

  beforeEach(module('je.filters'));

  describe('jeType', function() {

    it('should return "object" for an empty object', inject(function(jeTypeFilter) {
      expect(jeTypeFilter({})).toEqual('object');
    }));

    it('should return "object" for a non-empty object', inject(function(jeTypeFilter) {
      expect(jeTypeFilter({key: 'value'})).toEqual('object');
    }));

    it('should return "array" for an empty array', inject(function(jeTypeFilter) {
      expect(jeTypeFilter([])).toEqual('array');
    }));

    it('should return "array" for an non-empty array', inject(function(jeTypeFilter) {
      expect(jeTypeFilter([1,2,3])).toEqual('array');
    }));

    it('should return "atomic" for a null', inject(function(jeTypeFilter) {
      expect(jeTypeFilter(null)).toEqual('atomic');
    }));

    it('should return "atomic" for integer literal', inject(function(jeTypeFilter) {
      expect(jeTypeFilter(1)).toEqual('atomic');
    }));

    it('should return "atomic" for boolean', inject(function(jeTypeFilter) {
      expect(jeTypeFilter(true)).toEqual('atomic');
    }));

    it('should return "atomic" for string', inject(function(jeTypeFilter) {
      expect(jeTypeFilter('asdf')).toEqual('atomic');
    }));

  });

  describe('jeTreeNodeValue', function() {

    it('should return "A String"', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter('A String')).toEqual('A String');
    }));

    it('should return true', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter(true)).toEqual(true);
    }));

    it('should return 1', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter(1)).toEqual(1);
    }));

    it('should return empty string', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter([1,2,3,4])).toEqual('');
    }));

    it('should return empty string', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter({key: 'A String'})).toEqual('');
    }));

    it('should return "null"', inject(function(jeTreeNodeValueFilter) {
      expect(jeTreeNodeValueFilter(null)).toEqual('null');
    }));
  });

  describe('jeCollection', function() {

    it('should return empty array', inject(function(jeCollectionFilter) {
      expect(jeCollectionFilter('A String')).toEqual([]);
    }));

    it('should return empty array', inject(function(jeCollectionFilter) {
      expect(jeCollectionFilter(true)).toEqual([]);
    }));

    it('should return empty array', inject(function(jeCollectionFilter) {
      expect(jeCollectionFilter(1)).toEqual([]);
    }));

    it('should return empty array', inject(function(jeCollectionFilter) {
      expect(jeCollectionFilter(null)).toEqual([]);
    }));

    it('should return the same array', inject(function(jeCollectionFilter) {
      var test_data = [1, 2, 3, 4];
      expect(jeCollectionFilter(test_data)).toEqual(test_data);
    }));

    it('should return the same (empty) array', inject(function(jeCollectionFilter) {
      var test_data = [];
      expect(jeCollectionFilter(test_data)).toEqual(test_data);
    }));

    it('should return the same object', inject(function(jeCollectionFilter) {
      var test_data = { key: 'A String' };
      expect(jeCollectionFilter(test_data)).toEqual(test_data);
    }));

    it('should return the same (empty) object', inject(function(jeCollectionFilter) {
      var test_data = {};
      expect(jeCollectionFilter(test_data)).toEqual(test_data);
    }));
  });

});
