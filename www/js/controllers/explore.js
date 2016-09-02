angular.module('gifchat.controllers')
  .controller('ExploreCtrl', function(Dislike, Like, Auth, $firebaseArray, $scope, $ionicModal, $q) {
    console.log('Explore Controller initialized');

    //trying to get current user
    var user = firebase.auth().currentUser;
    var currentUid = user.uid;
    // setting card indexes
    $scope.currentIndex = null;
    $scope.currentCardUid = null;

    var maxAge = null;
    var men = null;
    var women = null;
    var home = this;

///////////////////////////////////////////////////////////////////////////////////////

    function init() {
      home.profiles = [];
      maxAge = JSON.parse(window.localStorage.getItem('maxAge')) || 25;
      console.log('maxAge: ', maxAge);

      men = JSON.parse(window.localStorage.getItem('men'));
      console.log('men ', men);
      men = men === null? true : men;
      console.log('men ', men);

      women = JSON.parse(window.localStorage.getItem('women'));
      console.log('women ', women);
      women = women === null? true : women;
      console.log('women ', women);

      var returnedData = Auth.getProfilesByAge(maxAge);
      console.log('getprofilesbyage returns:  ', returnedData);

      returnedData.once('value').then(function(snapshot) {
        var data = snapshot.val();
        console.log('data array: ', data.length, data);
        for (var i in data) {
          var item = data[i];
          console.log('Auth.getProfilesByAge item index: ', item);

          if ((item.gender == 'male' && men) || (item.gender == 'female' && women)) {
            if (item.uid != currentUid)
              home.profiles.push(item);
              console.log ('currentUid: ', currentUid);
              console.log ('itemuid: ', item.uid);
              console.log ('person gender: ', item.gender);
              console.log ('person id: ', item.uid);
              console.log('home.profiles ', home.profiles);
          }
        }

        console.log('home.profiles ', home.profiles);

        Like.allLikesByUser(currentUid).then(function(likesList) {
          home.profiles = _.filter(home.profiles, function(obj) {
            answer = _.isEmpty(_.where(likesList, {uid: obj.uid}));
            console.log('Like.allLikesByUser returns: ', answer);
            return answer;
          });
        });

        if (home.profiles.length > 0) {
          $scope.currentIndex = home.profiles.length - 1;
          $scope.currentCardUid = home.profiles[$scope.currentIndex].uid;
        }        
      });
    }

    $scope.$on('$ionicView.enter', function(e) {
      init();
    });


























///////////////////////////////////////////////////////////////////////////////////////


    //console.log(user);

    var payOrInviteClicked;
    $scope.payOrInviteClicked = false;


    // GiftEnergy Modal
    $ionicModal.fromTemplateUrl('templates/modals/gift_energy.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.giftEnergyModal = modal;
      console.log('Gift Modal initialized');
    });

    $scope.openGiftEnergyModal = function() {
      $scope.giftEnergyModal.show();
      console.log('Gift Modal shown');
      // load necessary variables to avoid conflict - ugly, but temporary
      $scope.friends = Auth.currentUser.friends.data;  
    };
    $scope.closeGiftEnergyModal = function() {
      $scope.giftEnergyModal.hide();
      console.log('Gift Modal closed');
    };

    // Invite Modal
    $ionicModal.fromTemplateUrl('templates/modals/invite.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.inviteModal = modal;
      console.log('Invite Modal initialized');
    });

    $scope.openInviteModal = function() {
      $scope.inviteModal.show();
      console.log('Invite Modal shown');
      // load necessary variables to avoid conflict - ugly, but temporary
      $scope.invitableFriends = Auth.currentUser.invitableFriends.data;  
    };
    $scope.closeInviteModal = function() {
      $scope.inviteModal.hide();
      console.log('Invite Modal closed');
    };

/*
    // GifChathome.profiles
    varhome.profiles = [
      {
        name: 'Max',
        age: 25,
        location: "San Francisco",
        stars: 4,
        uid: 1,
        image: "video/card1.gif"
      },
      {
        name: 'Beatrice',
        age: 40,
        location: "San Francisco",
        stars: 4.5,
        uid: 2,
        image: "video/card2.gif" 
      },
      {
        name: 'Maria',
        age: 28,
        location: "San Francisco",
        stars: 5,
        uid: 6,
        image: "video/card3.gif" 
      },
      {
        name: 'Betsy',
        age: 31,
        location: "San Francisco",
        stars: 3.5,
        uid: 7,
        image: "video/card4.gif" 
      },
      {
        name: 'Michelle',
        age: 22,
        location: "San Francisco",
        stars: 4,
        uid: 8,
        image: "video/card5.gif" 
      },
      {
        name: 'Penelope',
        age: 23,
        location: "San Francisco",
        stars: 5,
        uid: 9,
        image: "video/giphy2.gif" 
      },
      {
        name: 'Penelope',
        age: 19,
        location: "San Francisco",
        stars: 4,
        uid: 10,
        image: "video/giphy3.gif" 
      },
      {
        name: 'Patty',
        age: 19,
        location: "San Francisco",
        stars: 4,
        uid: 11,
        image: "video/giphy4.gif" 
      }
    ];
    */
    var resetCards = angular.copy(home.profiles);
    home.profiles = [];

    function payOrInviteClick () {
      $scope.payOrInviteClicked = true;
      console.log("payOrInviteClicked: " + $scope.payOrInviteClicked);
    }

    function _addCards(quantity) {
      for (var i = 0; i < Math.min(home.profiles.length, quantity); i++) {
        home.profiles.push(home.profiles[0]);
       home.profiles.splice(0, 1);
      }
    }
    
    $scope.cardDestroyed = function(index) {
      console.log(home.profiles, 'card destroyed:', home.profiles[index], index);
      home.profiles.splice(index, 1);
      _addCards(1);
      $scope.isMoveLeft = false;
      $scope.isMoveRight = false;
    };

    home.profileswiped = function(index) {
      home.profiles.push(home.profiles[Math.floor(Math.random(1)*8)]);
    };

    // For reasons, thehome.profileswipedRight andhome.profileswipedLeft events don’t get called always
    // https://devdactic.com/optimize-tinder-cards/

    home.profileswipedLeft = function() {
      $scope.otherId = home.profiles[0].uid;
      console.log('current card object: ', home.profiles[0]);
      Dislike.addDislike(Auth.currentUser.uid, $scope.otherId);

      event.stopPropagation();
    };

    home.profileswipedRight = function() {
      $scope.otherId = home.profiles[0].uid;
      console.log('current card object: ', home.profiles[0]);
      Like.addLike(currentUid, $scope.otherId);
      Match.checkMatch(currentUid, $scope.otherId);


      event.stopPropagation();

      // Open Match popup
      if (home.profiles.length % 3 == 1) $scope.openMatchModal();
    };

    $scope.cardPartialSwipe = function(amt) {
      $scope.isMoveLeft = amt < -0.15;
      $scope.isMoveRight = amt > 0.15;  
    };

    $scope.reset = function() {
     home.profiles = angular.copy(resetCards);
      _addCards(2);
    };

    // Match popup
    $ionicModal.fromTemplateUrl('templates/modals/match.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.matchModal = modal;
      console.log('Match Modal initialized');
    });

    $scope.openMatchModal = function(isFromCard) {
      $scope.matchModal.show();
      console.log("Match Modal shown");
    };
    $scope.closeMatchModal = function() {
      $scope.matchModal.hide();
      console.log("Match Modal closed");
    };

    // Onload
    _addCards(2);// 2 is the best choice for the performance
  });  