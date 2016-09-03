angular.module('gifchat.services')
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
    .factory('Like', function($firebaseArray, $q) {
    var ref = firebase.database().ref();
    var relationshipsRef = ref.child('relationships');
    var likesRef = relationshipsRef.child('likes');
    console.log('Like factory initialized, ','ref: ', ref,', likesRef: ', likesRef);
    var Like = {
      allLikesByUser: function(uid) {
        var deferred = $q.defer();
        var items = likesRef.child(uid);
        deferred.resolve(items);
        return deferred.promise;
      },

      addLike: function(uid1, uid2) {
        return likesRef.child(uid1).child(uid2).set(true);
      },

      removeLike: function(uid1, uid2) {
        return likesRef.child(uid1).child(uid2).remove();
      }
    };
    return Like;
  });
