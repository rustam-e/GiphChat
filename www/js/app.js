// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('gifchat', [
  'ionic',
  'firebase',
  'gifchat.controllers',
  'gifchat.services',
  'gifchat.directives',
  'ionic.contrib.ui.tinderCards',
  'ionic.giphy',
  'ngCordova'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      $ionicConfigProvider.scrolling.jsScrolling(false);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.swipeBackEnabled(false);
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/welcome');

  $stateProvider
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome/welcome.html',
      controller: 'WelcomeCtrl'
    })
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'templates/home/index.html'
    })

    .state('home.explore', {
      url: '/explore',
      templateUrl: 'templates/home/explore.html',
      controller: 'ExploreCtrl'
    })

    .state('home.settings', {
      url: '/settings',
      templateUrl: 'templates/home/settings.html',
      controller: 'SettingsCtrl'
    })

    .state('home.matches', {
      url: '/matches',
      templateUrl: 'templates/home/matches.html',
      controller: 'MatchesCtrl'
    })

    .state('home.messaging', {
      url: '/messaging/:id',
      templateUrl: 'templates/home/messaging.html',
      controller: 'MessagingCtrl'
    })
})

.run(function($rootScope, $state) {
  $rootScope.$state = $state;
})
