angular.module('gifchat.services', ['firebase'])
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
  .service('Giphy', function($http) {
    var API_KEY = 'dc6zaTOxFJmzC'; // Public Beta Key
    var ENDPOINT = 'http://api.giphy.com/v1/gifs/';

    this.search = function(query) {
      return $http.get(ENDPOINT + 'search', {params: {
        q: query,
        api_key: API_KEY
      }}).then(function(response) {
        return response.data.data;
      })
    }

    this.trending = function() {
      return $http.get(ENDPOINT + 'trending', {params: {
        api_key: API_KEY
      }}).then(function(response) {
        return response.data.data;
      })
    }
  })
  .factory('Auth', function($firebaseArray, $firebaseAuth, $firebaseObject, $state, $http) {
  var ref = firebase.database().ref();
  var profilesRef = ref.child('profiles');
  var auth = $firebaseAuth();
  var Auth = {    
    currentUser: {},
    createProfile: function(user) {
      var profile = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid,
        firstName: user.firstName,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
        invitableFriends: user.invitableFriends,
        friends: user.friends
      };
      return profilesRef.child(profile.uid).set(profile);
    },

    setCurrentUser: function(user) {
      Auth.currentUser = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid,
        firstName: user.firstName,
        location: user.location,
        birthday: user.birthday,
        gender: user.gender,
        invitableFriends: user.invitableFriends,
        friends: user.friends
      };
      return Auth.currentUser;
    },

    getProfile: function(uid) {
      return $firebaseObject(ref.child('profiles').child(uid));
    },



    login: function() {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile, email, user_location, user_birthday, user_photos, user_about_me, user_friends, user_relationship_details, user_likes');      
      return firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        //console.log(token);
        // The signed-in user info.
        var user = result.user;
        // Getting info from graph API to save on the back-end
        // Async functions which return promises
        var firstName = Auth.getFirstName(token).then(function(res){return res.data.first_name;}, function(err){console.log('err' + err);});
        var location = Auth.getLocation(token).then(function(res){return res.data.location;}, function(err){console.log('err' + err);});
        var birthday = Auth.getBirthday(token).then(function(res){return res.data.birthday;}, function(err){console.log('err' + err);});
        var gender = Auth.getGender(token).then(function(res){return res.data.gender;}, function(err){console.log('err' + err);});
        var invitable_friends = Auth.getInvitableFriends(token).then(function(res){return res.data.invitable_friends;}, function(err){console.log('err' + err);});
        var friends = Auth.getFriends(token).then(function(res){return res.data.friends;}, function(err){console.log('err' + err);});

        // Promise.all will wait for all promises to resolve before setting user properties
        Promise.all([firstName, location, birthday, gender, invitable_friends, friends]).then(function(results){
          //set extra variables
          user.firstName = results[0];
          user.location = results[1];
          user.birthday = results[2];
          user.gender = results[3];
          user.invitableFriends = results[4];
          user.friends = results[5];
          //create profile
          if (user != null) {
            Auth.createProfile(user);
            Auth.setCurrentUser(user);
          }
        });
        //
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

    },

    logout: function() {
      return auth.$signOut();
    },

    getName: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=name&access_token=' + access_token);
    },

    getFirstName: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=first_name&access_token=' + access_token);
    },

    getGender: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=gender&access_token=' + access_token);
    },

    getBirthday: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=birthday&access_token=' + access_token);
    },

    getInvitableFriends: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=invitable_friends&access_token=' + access_token);
    },

    getLocation: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=location&access_token=' + access_token);
    },

    getFriends: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=friends&access_token=' + access_token);
    },

    getAbout: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=bio&access_token=' + access_token);
    },

    getImages: function(access_token) {
      return $http.get('https://graph.facebook.com/me/photos/uploaded?fields=source&access_token=' + access_token);
    },

    getAge: function(birthday) {
      return new Date().getFullYear() - new Date(birthday).getFullYear();
    },

    requireAuth: function() {
      return auth.$requireAuth();
    },

    getProfiles: function() {
      return $firebaseArray(ref.child('profiles'));
    },

    getProfilesByAge: function(age) {
      return $firebaseArray(ref.child('profiles').orderByChild('age').startAt(18).endAt(age));
    }         

  };

  auth.$onAuthStateChanged(function(user) {
    if(user) {
      console.log('welcome');

    } else {
      $state.go('welcome');
      console.log('You need to login.');
    }
  })  ;

  return Auth;

});
