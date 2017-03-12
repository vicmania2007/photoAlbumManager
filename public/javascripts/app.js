var app = angular.module('photoAlbumManager', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: "templates/home.html"
	})

	.when('/albums', {
		templateUrl: "templates/albums.html",
		controller: "loadAlbumsController"
	})

	.when('/photos', {
		templateUrl: "templates/photos.html",
		controller: "loadPhotosController"
	});

 	$locationProvider.html5Mode(true);
});

app.controller('loadAlbumsController', function($scope, $http) {

	var columnsPerRow = 3;
	$scope.rows = function() {
	  return new Array(columnsPerRow);
	};
	$scope.indexInRange = function(columnIndex,rowIndex) {
	  return columnIndex >= (rowIndex * columnsPerRow) && columnIndex < (rowIndex * columnsPerRow) + columnsPerRow;
	};
	
	$http.get('/albums/user/1').then(function(response){
		$scope.albums = response.data;
	});
});

app.controller('loadPhotosController', function($scope, $http) {
	
	var columnsPerRow = 3;
	$scope.rows = function() {
	  return new Array(columnsPerRow);
	};
	$scope.indexInRange = function(columnIndex,rowIndex) {
	  return columnIndex >= (rowIndex * columnsPerRow) && columnIndex < (rowIndex * columnsPerRow) + columnsPerRow;
	};

	$http.get('/photos/album/1').then(function(response){
		$scope.photos = response.data;
	});
});
