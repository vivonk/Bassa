(function(){
  'use strict';
  angular
    .module('app')
    .controller('DashCtrl', [ '$scope','$window','ToastService', 'DashService', 'UserService', 'BassaUrl','$mdDialog', DashCtrl]);
  
  function DashCtrl($scope, $window , ToastService, DashService, UserService, BassaUrl, $mdDialog) {
    var socket = io.connect(BassaUrl + '/progress');
    $scope.dlink = {link: ''};
    $scope.downloads = [];
    $scope.username = UserService.getUsername();
    
    socket.on('connect', function(){
      socket.emit('join', {room: $scope.username});
    });
    
    socket.on('status', function(data) {
      _.forEach($scope.downloads, function(obj){
        if (obj.id == data.id) {
          obj.progress = data.progress;
          $scope.$apply();
        }
      });
    });
    
    var linkvalidator = function(link){
      var urlvalidator =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
      var magnetvalidator = /magnet:\?xt=/i;
      return urlvalidator.test(link) || link.match(magnetvalidator) !== null;
    };
    
    $scope.addLink = function() {
      if ($scope.dlink.link === '' || $scope.dlink.link === undefined || !linkvalidator($scope.dlink.link)) {
        ToastService.showToast('Please check your url');
      } else {
        DashService.addDownload($scope.dlink).then(function (response) {
          $scope.dlink.link = '';
          ToastService.showToast("Link added");
          getActiveDownloads();
        }, function(error){
          $scope.dlink.link = '';
          if (error.data.quota) {
            ToastService.showToast("Your monthly quota has been exceeded");
          } else {
            ToastService.showToast("Oops! Something went wrong :(");
          }
        });
      }
    };
    var getActiveDownloads = function() {
      DashService.getDownloads().then(function (response) {
        var data = response.data;
        $scope.downloads = _.filter(data, function(d) {return d.status==0});
        $scope.downloads = _.map($scope.downloads, function(element) {
          return _.extend({}, element, {progress: 0});
        });
      }, function(error){
        ToastService.showToast("Oops! Something went wrong when fetching data");
      });
    };
    $scope.removeLink = function (id) {
      // Shows window confirmation before deleting download.
      // Using angular in-built dialog box
      
      var confirm = $mdDialog.confirm()
        .title(' Do you want to stop the download')
        .textContent('You can\'t start this download back.\n')
        .ariaLabel('Stopping download')
        .ok('Yes')
        .cancel('No');
      
      $mdDialog.show(confirm).then(function() {
          DashService.removeDownload(id).then(function(response){
              ToastService.showToast("Download removed");
              getActiveDownloads();},
            function (error){
              ToastService.showToast("Download started. Entry cannot be deleted.");
            })},
        function (){
        
        });
    };
    
    getActiveDownloads();
    
  }
  
})();
