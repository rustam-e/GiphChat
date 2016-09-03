angular.module('gifchat.controllers')
  .controller('SettingsCtrl', function(Auth, $scope, $ionicModal) {
    $scope.currentUser = Auth.currentUser;
    console.log('Settings Controller initialized, current user: ', $scope.currentUser);
    $scope.logout = function() {
      // angularfire sign out function from github docs
      Auth.logout();
      console.log('Logout clicked');
      $scope.modalSettings.hide();
      console.log('Settings Modal closed');
    };
    // setting up settings modal
    $ionicModal.fromTemplateUrl('templates/modals/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSettings = modal;
      console.log('Settings Modal initilized');
    });
    $scope.openSettingsModal = function() {
      $scope.modalSettings.show();
      console.log('Settings Modal opened');
    };
    $scope.closeSettingsModal = function() {
      $scope.modalSettings.hide();
      console.log('Settings Modal closed');
    };

    // setting up profile_edit modal
    $ionicModal.fromTemplateUrl('templates/modals/profile_edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editProfileModal = modal;
      console.log('Edit Profile Modal initilized');
    });

    $scope.openEditProfileModal = function() {
      $scope.editProfileModal.show();
      console.log('Edit Profile Modal shown');
   };
    $scope.closeEditProfileModal = function() {
      $scope.editProfileModal.hide();
      console.log('Edit Profile Modal closed');
    };
  });  