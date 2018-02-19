'use strict';

angular.module('myApp.home', ['ngRoute'])

function homePageController($scope, $window, boardGameService){ 
	$scope.game = {};
	$scope.goToGame = function(){
		if(!angular.isDefined($scope.game.type)){
			$scope.message = "Please select a game type"
			return;
		}
		
		if($scope.game.name == 'Computer'){
			$scope.message = "Sorry, your name can't be Computer"
			return;
		}
		var name = $scope.game.name ? $scope.game.name : 'You';
		
		boardGameService.setType($scope.game.type);
		boardGameService.addPlayer(name);
		if($scope.game.type == 'Multi'){
			boardGameService.addPlayer('Computer');
		}
		
		$window.location = '#!/game/'+$scope.game.type.toLowerCase();
	}
};