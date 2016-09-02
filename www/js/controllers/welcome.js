angular.module('gifchat.controllers')
    /*Edit Profile*/
  .controller('WelcomeCtrl', function(Auth, $state, $scope) {
    
    console.log('Welcome Controller initialized');
    $scope.login = function() {
      console.log('Login cliked');
      
      return Auth.login().then(function(user) {
        $state.go('home.explore');
      });
    };
  });  