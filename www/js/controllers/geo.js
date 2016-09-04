angular.module('gifchat.controllers')
.controller('GeoCtrl', function($cordovaGeolocation, $ionicPlatform, $http, $scope) {
  var user = firebase.auth().currentUser;
  var currentUid = user.uid;
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude //here you get latitude
      console.log('lat: ', lat);
      var long = position.coords.longitude //here you get the longitude
      console.log('long', long);
      latLongArr = [lat,long];
      console.log('latLongArr: ', latLongArr);

      // Load the map canvas in the #map block
      L.mapbox.accessToken = 'pk.eyJ1IjoicnVzdGFtMTMiLCJhIjoiY2lzb2V3ZHp2MDAxbjJ5bWV6dXF2dnlscSJ9.D4x6MemFkLdfJa4YvZu2Ow';
      //mapbox secret token - sk.eyJ1IjoicnVzdGFtMTMiLCJhIjoiY2lzb2ZtcHozMDAxbTJ6bGZtZWM5dGMwMiJ9.dsm3eqHOxpKPhDXskO9U7A
      var map = L.mapbox.map('map', 'mapbox.light').setView([lat, long], 9);


      map.on('ready', function() {

        // Add a new marker on the map
        var marker = L.marker([lat, long]).addTo(map)

        // Update the marker position
        marker.setLatLng([lat, long])

      })
      // Read the current hash
      var mapId = location.hash.replace(/^#/, '');

      // If not set generate a new one
      if (!mapId) {
        mapId = (Math.random() + 1).toString(36).substring(2, 12);
        location.hash = mapId;
      }

      // Get current UUID
      var myUuid = currentUid;

      // Access to Firebase instance of current map
      var ref = firebase.database().ref();
      var markersRef = ref.child('maps').child(mapId);

      // Current position is stored under `myUuid` node
      $cordovaGeolocation.watchPosition(function(position) {
        markersRef.child(myUuid).set({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          timestamp: Math.floor(Date.now() / 1000)
        })
      })
      markersRef.on('child_added', function(childSnapshot) {
        var uuid = childSnapshot.key()
        var position = childSnapshot.val()

        addPoint(uuid, position)
      })

      markersRef.on('child_changed', function(childSnapshot) {
        var uuid = childSnapshot.key()
        var position = childSnapshot.val()

        putPoint(uuid, position)
      })

      markersRef.on('child_removed', function(oldChildSnapshot) {
        var uuid = oldChildSnapshot.key()

        removePoint(uuid)
      })
      // Remove old markers
      setInterval(function() {
        markersRef.limitToFirst(100).once('value', function(snap) {
          var now = Math.floor(Date.now() / 1000)

          snap.forEach(function(childSnapshot) {
            var uuid = childSnapshot.key()
            if (childSnapshot.val().timestamp < now - 60 * 30) {
              markersRef.child(uuid).set(null)
              //markers[uuid] = null
            }
          })
        })
      }, 5000);
    }, function(err) {
      // error
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  console.log('watch: ', watch);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude;
      console.log('watch lat = ', lat);
      var long = position.coords.longitude;
      console.log('watch long = ', long);
  });
});