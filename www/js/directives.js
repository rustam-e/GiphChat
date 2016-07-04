// Source: https://www.thepolyglotdeveloper.com/2015/01/making-tinder-style-swipe-cards-ionic-framework/
angular.module('starter.directives', [])
  .directive('noScroll', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        $element.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })

  .directive('photoPickable', function() {
    return {
      restrict: 'AE',
      scope: {
        number: '@',
        imgSrc: '='
      },
      template: '' +
            '<div class="photo-pickable" ng-click="pick()">' +
              '<span class="photo-number text-lg light">{{number}}</span>' +
              '<img ng-src="{{imgSrc}}" class="w-full r-3x" alt="">' +
              '<i class="icon ion-close-round photo-button assertive light-bg text-2x rounded"></i>' +
              '<i class="icon ion-plus-circled photo-button assertive light-bg text-2x rounded"></i>' +
            '</div>',
      controller: function($scope, $cordovaCamera) {
        var options;
        $scope.imgSrc = 'video/giphy0.gif';

        document.addEventListener("deviceready", function () {
          options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 640,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
          };
        });

        $scope.pick = function() {
          if (Camera === undefined) return false;

          $cordovaCamera.getPicture(options)
            .then(function(imageData) {
              // $scope.imgSrc = "data:image/jpeg;base64," + imageData;
              $scope.imgSrc = imageData;
            }, function(err) {
              // error
            });
        }
      }
    }
  })
