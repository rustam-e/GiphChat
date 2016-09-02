angular.module('gifchat.services')
  /*
    Giphy Service
    Docs: https://github.com/Giphy/GiphyAPI#search-endpoint
  */
  .factory('Auth', function($firebaseArray, $firebaseAuth, $firebaseObject, $state, $http, $q) {
  var ref = firebase.database().ref();
  var profilesRef = ref.child('profiles');
  var auth = $firebaseAuth();
  var Auth = {    
    currentUser: {},
    createProfile: function(user) {
      var profile = {};
      // setting values if they exist
      if(user.displayName){profile.name = user.displayName;}else{profile.name = {};}
      if(user.email){profile.email = user.email;}else{profile.email = {};}
      if(user.profilePicture){profile.profilePicture = user.profilePicture;}else{profile.profilePicture = {};}
      if(user.uid){profile.uid = user.uid;}else{profile.uid = {};}
      if(user.firstName){profile.firstName = user.firstName;}else{profile.firstName = {};}
      if(user.location){profile.location = user.location;}else{profile.location = {};}
      if(user.birthday){profile.birthday = user.birthday;}else{profile.birthday = {};}
      if(user.gender){profile.gender = user.gender;}else{profile.gender = {};}
      if(user.invitableFriends){profile.invitableFriends = user.invitableFriends;}else{profile.invitableFriends = {};}
      if(user.friends){profile.friends = user.friends;}else{profile.friends = {};}
      if(user.profilePicture){profile.profilePicture = user.profilePicture;}else{profile.profilePicture = {};}
      if(user.images){profile.images = user.images;}else{profile.images = {};}
      if(user.age){profile.age = user.age;}else{profile.age = {};}
      //saving them to the database
      return profilesRef.child(profile.uid).set(profile);
      console.log('created profile with following object: ', profile);
    },

    setCurrentUser: function(user) {
      Auth.currentUser = user;
      console.log('Set Current User to: ', Auth.currentUser);
    },

    login: function() {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile, email, user_location, user_birthday, user_photos, user_about_me, user_friends, user_relationship_details, user_likes');      
      return firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        console.log('access token: ', token);
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
        //helper variables
        var imagesIds = Auth.getImagesIds(token).then(function(res){
          if(res.data.photos){
            console.log(res);
          return res.data.photos.data;
          }else{
            console.log('imageIds data does not exist');
            return [];
          }
        }, function(err){console.log('err' + err);});
        
        var getTheDamnProfiles = function(age){
          var promise = Auth.getProfilesByAge(age).then(function(res){return res.data;}, function(err){console.log('err' + err);});
          var answer = promise.then(function(resp){return resp;}, function(error){console.log('err', err)});
        };


        imagesIds.then(function(images){console.log('images ids: ', images)});


        var pictureId = Auth.getPictureId(token).then(function(res){return res.data.id;}, function(err){console.log('err' + err);});
        // taking id returned by profilePictureId and returning a large image from it
        var picture = pictureId.then(function(id){
          console.log('profile picture id:', id);
          return Auth.getPicture(id);
        }, function(err){
          console.log('err' + err);
        });
        var age = birthday.then(function(birthday){
          return Auth.getAge(birthday);
        });
        //declaring array where we'll store promises
        // iterating over the array of IDs after they're loaded
        var imagesUrls = imagesIds.then(function(array){
        //receiving a list of ids 
        //saving them in an array of urls
          var urls = [];
          // creating bunch of getProfile calls with the said ids
          // in case number of pictures is smaller than 5, I'm dynamically setting the loop index based on array length
          if (array.length > 0) {
            var indexEnd = function(){if(array.length > 5){return 5;}else{return array.length}};

            for (i = 0; i < indexEnd; i++) {
              urls.push(Auth.getPicture(array[i].id));
            }            
          }
          //returning the array of urls, saving them as a user image property
          return urls;
        });
        // Promise.all will wait for all promises to resolve before setting user properties
        Promise.all([firstName, location, birthday, gender, invitable_friends, friends, picture, imagesUrls, age, imagesIds, pictureId]).then(function(results){
          //set extra variables
          console.log('Resolved extra information promises array: ', results);
          if (results[0]){user.firstName = results[0];}
          if (results[1]){user.location = results[1];}
          if (results[2]){user.birthday = results[2];}
          if (results[3]){user.gender = results[3];}
          if (results[4]){user.invitableFriends = results[4];}
          if (results[5]){user.friends = results[5];}
          if (results[6]){user.profilePicture = results[6];}
          if (results[7]){user.images = results[7];}
          if (results[8]){user.age = results[8];}
          console.log('final user object', user, user.images);

          //create profile
          if (user != null) {
            Auth.setCurrentUser(user);
            console.log(Auth.currentUser);
            Auth.createProfile(user);
          };
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
    },

    getPicture: function(id) {
      return 'http://graph.facebook.com/'+id+'/picture?type=large';
    },

    getPictureId: function(access_token) {
      console.log('getting profile picture id');
      return $http.get('https://graph.facebook.com/me?fields=picture&access_token=' + access_token);
    },

    getImagesIds: function(access_token) {
      return $http.get('https://graph.facebook.com/me?fields=photos{picture}&access_token=' + access_token);
    },

    getAge: function(birthday) {
      return new Date().getFullYear() - new Date(birthday).getFullYear();
    },

    requireAuth: function() {
      return auth.$requireAuth();
    },

    getProfile: function(uid) {
      return $firebaseObject(ref.child('profiles').child(uid));
    },

    getProfiles: function() {
      return $firebaseArray(ref.child('profiles'));
    },

    getProfilesByAge: function(age) {
      //var deferred = $q.defer();
      return profilesRef.orderByChild('age').startAt(18).endAt(age);
      //starCountRef.on('value', function(snapshot) {
      //  updateStarCount(postElement, snapshot.val());
      //});
      //deferred.resolve(items);
      //console.log(deferred.promise);
    }         

  };

  auth.$onAuthStateChanged(function(user) {
    if(user) {
      console.log(Auth.currentUser.firstName);

    } else {
      $state.go('welcome');
      console.log('You need to login.');
    }
  });

  return Auth;

});
