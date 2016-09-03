angular.module('gifchat.controllers')
.controller('ExploreCtrl', function(Match, Dislike, Like, Auth, $firebaseArray, $scope, $ionicModal, $q) {
    console.log('Explore Controller initialized');    
    //trying to get current user
    var user = firebase.auth().currentUser;
    var currentUid = user.uid;
    console.log('currentUid: ', currentUid);
    //setting to the default value - needs to be dynamically updated with a setter method later
    var maxAge = 86;
    // setting init variables
    //cards for the UI
    $scope.cards = {};
    function init() {
      var returnedData = Auth.getProfilesByAge(maxAge);
      returnedData.once('value').then(function(snapshot) {
          var data = snapshot.val();
          console.log('getprofilesbyage returns:  ', data);
          removePerson(data, user);
          console.log('data after eliminating the user from the list: ', data);
          if ($scope.cards.length > 0) {
            $scope.currentIndex = $scope.cards.length - 1;
            $scope.currentCardUid = $scope.cards[$scope.currentIndex].uid;
          }
          // getting likes data in parallel
          var likesListData = Like.allLikesByUser(currentUid);

          likesListData.once('value').then(function(snapshot) {
            likesList = snapshot.val();
            console.log('list of people you have already liked before conversion to array', likesList);
            likesList = jsonIndexesToArray(likesList);
            console.log('list of people you have already liked after conversion to array: ', likesList);
            // remove common elements from both object and the array

            $scope.$apply(function() {
                $scope.cards = filterCardsByFromLikes(data, likesList);
            });
           // $scope.cards = filterCardsByFromLikes(data, likesList);
            // test if it worked
            console.log('array of objects after removing people you have liked already ', $scope.cards);
          });
      });

    }    // getting user data to populate the cards
    $scope.$on('$ionicView.enter', function(e) {
      init();
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////            
    $scope.cardDestroyed = function(index) {
      console.log($scope.cards, 'card destroyed:', $scope.cards[index], index);
      removePerson($scope.cards, $scope.cardsp[index]);
//      $scope.cards.splice(index, 1);
    };


    $scope.cardSwipedLeft = function(index) {
      console.log('$scope.cards inside swipe left', $scope.cards);
      console.log('current card object: ', $scope.cards[index]);
      Dislike.addDislike(currentUid, index);
      $scope.cardRemoved(index);
    };

    $scope.cardSwipedRight = function(index) {
      console.log('$scope.cards inside swipe right', $scope.cards);
      console.log('current card object: ', $scope.cards[index]);
      Like.addLike(currentUid, index);
      Match.checkMatch(currentUid, index);
      $scope.cardRemoved(index);
    };

    $scope.cardRemoved = function(index) {
      removePerson($scope.cards, index);

      if ($scope.cards.length > 0) {
        $scope.currentIndex = $scope.cards.length - 1;
        $scope.currentCardUid = $scope.cards[$scope.currentIndex].uid;
      }
    };


//// Modals related initialization and functions

///////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


// Possibly useful extra functions:

    $scope.payOrInviteClicked = false;

    function payOrInviteClick () {
      $scope.payOrInviteClicked = true;
      $scope.openInviteModal();
      console.log("payOrInviteClicked: " + $scope.payOrInviteClicked);
    }
///////////////is super inefficient - I should use a more efficient search algorithms & data structure here
    function filterCardsByFromLikes(cards, likes){
      //loop every value in likes
      console.log("cards: " , cards);
      console.log("likes: " , likes);

      for(i = 0; i < likes.length; i++){
        // second loop to compare the values
        for ( person in cards) {
          if (cards[person].uid == likes[i]){
            console.log('found a user who should be removed', cards[person]);
            delete cards[person];
          }
        }
      }
      return cards;
    }

    function jsonIndexesToArray (obj) {
      var result = [];
      for(var i in obj){
        result.push(i);
      }
      return result;
    }

    function removeByIndex(arr, index) {
      arr.splice(index, 1);
      return arr;
    }

    function removePerson(obj, val) {
      for( person in obj ){
        console.log('person: ', person);
        console.log('checking if this person is the user: ', obj[person]);
        if (obj[person].uid == val.uid) {
          console.log('Found the user: ', obj[person]);
          delete obj[person];
          return obj;
          break;
        }
      }
    }
});




