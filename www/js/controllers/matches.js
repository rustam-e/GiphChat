angular.module('gifchat.controllers')
  .controller('MatchesCtrl', function($scope) {
    $scope.matches = [
      {
        name: 'Beatrice',
        isNew: true
      },
      {
        name: 'Maria',
        isNew: true
      },
      {
        name: 'Patty',
        isNew: false
      },
      {
        name: 'Max',
        isNew: false
      },
      {
        name: 'Betsy',
        isNew: false
      },
      {
        name: 'Michelle',
        isNew: false
      }
    ];
  })
;  