angular.module('gifchat.controllers')
  .controller('AppCtrl', function(Auth, $scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/modals/profile.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.profileModal = modal;
    });

    $scope.openProfileModal = function(isFromCard) {
      $scope.isFromCard = isFromCard;
      $scope.profileModal.show();
    };
    $scope.closeProfileModal = function() {
      $scope.profileModal.hide();
    };

    $scope.interests = 'We will compare your Facebook interests  with those  of your matches to display  any  common connections'.split('  ');
  });  