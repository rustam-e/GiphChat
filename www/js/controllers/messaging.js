angular.module('gifchat.controllers')
  // Inspired by Elastichat http://codepen.io/rossmartin/pen/XJmpQr
  .controller('MessagingCtrl', function($scope, $stateParams, Giphy, $ionicScrollDelegate, $timeout, $ionicActionSheet) {
    $scope.isNew = $stateParams.id < 2;
    $scope.gifs = [];
    $scope.gifQuery = '';
    $scope.isGifShown = false;
    $scope.isGifLoading = false;
    $scope.questions = [
      {
        question: "Usual week-end night?",
        option1: "Go to the bars",
        option2: "Read a book at home"
      },
      {
        question: "Which do you like more?",
        option1: "Tea",
        option2: "Coffee"
      },
      {
        question: "Favorite Food",
        option1: "Healthy Food",
        option2: "Taste before health! You Only live once!"
      }
    ];
    $scope.messages = [
      {
        isMe: true,
        type: 'image',// text || image
        body: 'img/hello.gif',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'image',// text || image
        body: 'img/hello.gif',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: true,
        type: 'text',// text || image
        body: 'Where are you, buddy?',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'text',// text || image
        body: 'I\'m almost there',
        timestamp: 'Feb 26, 2016, 9:47PM'
      }
    ];

    $scope.message = '';
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

    $scope.sendText = function() {
      $scope.messages.push({
        isMe: true,
        type: 'text',
        body: $scope.message,
        timestamp: 'Feb 26, 2016, 9:47PM'
      });
      $scope.message = '';
      _scrollBottom();
      $scope.fakeReply();
    };

    $scope.sendGif = function(imageUrl) {
      console.log(imageUrl);
      $scope.messages.push({
        isMe: true,
        type: 'image',
        body: imageUrl
      });
      $scope.message = '';
      _scrollBottom('#type-area2');
      $scope.fakeReply();
    };

    $scope.fakeReply = function() {
      $timeout(function() {
        $scope.messages.push({
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'text',
        body: 'Keep typing dude',
        timestamp: 'Feb 26, 2016, 9:47PM'
      });
      $scope.message = '';
      _scrollBottom();
      }, 500)
    };

    $scope.openGiphy = function() {
      $scope.isGifShown = true;
      $scope.message = '';
    };

    var _scrollBottom = function(target) {
      target = target || '#type-area';

      viewScroll.scrollBottom(true);
      _keepKeyboardOpen(target);
      if ($scope.isNew) $scope.isNew = false;
    };

    // Warning: Demo purpose only. Stay away from DOM manipulating like this
    var _keepKeyboardOpen = function(target) {
      target = target || '#type-area';

      txtInput = angular.element(document.body.querySelector(target));
      console.log('keepKeyboardOpen ' + target);
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    };

    $scope.$watch('gifQuery', function(newValue) {
      if (newValue.length) {
        $scope.isGifLoading = true;
        $scope.gifs = [];

        Giphy.search(newValue)
          .then(function(gifs) {
            $scope.gifs = gifs;
            $scope.isGifLoading = false;
          })
      } else {
        _initGiphy();
      }
    });

    // Show the action sheet
    $scope.showUserOptions = function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Mute Notifications' },
          { text: 'Unmatch Max' },
          { text: 'Report Max' },
          { text: 'Show Max\'s profile' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
          },
        buttonClicked: function(index) {
          return true;
        }
      });
    };

    // Onload
    var _initGiphy = function() {
      Giphy.trending()
        .then(function(gifs) {
          $scope.gifs = gifs;
        });
    };
    _initGiphy();
  });  