'use strict';

angular.module('myApp.view2', ['ngRoute'])

function homePageController($scope, $window, boardGameService){ 
	$scope.game = {};
	$scope.goToGame = function(){
		var name = $scope.game.name ? $scope.game.name : 'You';
		
		boardGameService.addPlayer(name);
		if($scope.game.type == 'Multi'){
			boardGameService.addPlayer('Computer');
		}
		
		$window.location = '#!/game';
	}
};