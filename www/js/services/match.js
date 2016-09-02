angular.module('gifchat.services')
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
  .factory('Match', function($firebaseArray, $ionicPopup) {
    var ref = firebase.database().ref();
    var relationshipsRef = ref.child('relationships');
    var likesRef = relationshipsRef.child('likes');
    var matchesRef = relationshipsRef.child('matches');
    console.log('Matches factory initialized, ', 'ref: ', ref, ', matchesRef: ', matchesRef);

    var Match = {
      allMatchesByUser: function(uid) {
        return matchesRef.child(uid);
      },

      checkMatch: function(uid1, uid2) {
        var check = likesRef.child(uid2).child(uid1);

        check.on('value', function(snap) {
          if (snap.val() != null) {
            matchesRef.child(uid1).child(uid2).set(true);
            matchesRef.child(uid2).child(uid1).set(true);

            $ionicPopup.alert({
              title: 'Matched',
              template: 'Yay, you guys are matched!'
            });
          }
        })
      },

      removeMatch: function(uid1, uid2) {
        matchesRef.child(uid1).child(uid2).remove();
        matchesRef.child(uid2).child(uid1).remove();
      }
    };
    return Match;
  });
