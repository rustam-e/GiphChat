angular.module('starter.services', [])
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
  .service('Giphy', function($http) {
    var API_KEY = 'dc6zaTOxFJmzC'; // Public Beta Key
    var ENDPOINT = 'http://api.giphy.com/v1/gifs/';

    this.search = function(query) {
      return $http.get(ENDPOINT + 'search', {params: {
        q: query,
        api_key: API_KEY
      }}).then(function(response) {
        return response.data.data;
      })
    }

    this.trending = function() {
      return $http.get(ENDPOINT + 'trending', {params: {
        api_key: API_KEY
      }}).then(function(response) {
        return response.data.data;
      })
    }
  });
