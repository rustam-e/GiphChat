angular.module('gifchat.services')
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
  .factory('Dislike', function($firebaseArray) {
      var ref = firebase.database().ref();
      var relationshipsRef = ref.child('relationships');
      var dislikesRef = relationshipsRef.child('dislikes');
      console.log('Dislike Factory initialized, ','ref: ', ref,', dislikesRef: ', dislikesRef);
      var Dislike = {
        allDisikesByUser: function(uid) {
          return dislikesRef.child(uid);
        },

        addDislike: function(uid1, uid2) {
          return dislikesRef.child(uid1).child(uid2).set(true);
        },

        removeDislike: function(uid1, uid2) {
          return dislikesRef.child(uid1).child(uid2).remove();
        }
      };
      return Dislike;
    });
