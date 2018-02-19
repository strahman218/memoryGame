'use strict';

var myApp = angular.module('myApp.game', ['ngRoute'])

function gameController($rootScope, $scope, $timeout, $window, boardGameService){
	var game = boardGameService.getGame;
	var cards = game.cards;
	var players = game.players;
	var numCards = boardGameService.numCards;
	var totalMatches = 0;
	var timerStarted = false;
	var isMultiPlayer = game.type == 'Multi';
	
	$scope.message = '';
	$scope.board = game.board;
	$scope.isGameOver = false;
	$scope.selectedCards = [];
	$scope.gameType = game.type;
	
	$scope.currentPlayer = players[0];
	$scope.p1 = players[0];
	
	//set multi-player game specific fields
	if(game.type == 'Multi'){
		var computerMemory = [];
		$scope.p2 = players[1];
	}
	
	$scope.goHome = function(sameOrDiff){
		$window.location = "/";
	}
	
	 $scope.toggleCard = function(card){	
	 if(timerStarted){
		return;
	 }
		if($scope.selectedCards.length < 2){
			card.show = $scope.selectedCards.length <= 2;
			if(!containsCard(card, $scope.selectedCards)){
				$scope.selectedCards.push(card);
			}
		} 

		if ($scope.selectedCards.length == 2){
			var card1 = $scope.selectedCards[0];
			var card2 = $scope.selectedCards[1];
			var isMatch = card1.value == card2.value;
			
			if(isMatch){ 
				totalMatches++;
				$scope.isGameOver = totalMatches == numCards/2;
				$scope.message = $scope.isGameOver ? getWinningMessage() : "You found a match!";
				
				timerStarted = true;
				$timeout(function(){ setMatched(card1, card2); }, 1000)
			} else {
				timerStarted = true;
				$scope.message = "Not a match! Try again!";
				$timeout(function(){ resetCards(card1, card2)}, 1000);
				
				if(game.type == 'Multi'){
					storeInComputerMemory(card1, card2);
				}
			}
		}
		
		$scope.currentPlayer.turn++;
  };
  
  var getWinningMessage = function(){
	var message = "";
	if(isMultiPlayer){
		if($scope.p1.matches.length == $scope.p2.matches.length){
			message = "It's a TIE! You're both winners!"
		} else if($scope.p1.matches.length > $scope.p2.matches.length){
			message = $scope.p1.name+" WON!";
		} else {
			message = $scope.p2.name+" WON!";
		}
	} else {
		message = "you WON! Congrats "+$scope.currentPlayer.name;
	}
	
	return message;
  }
   
  var setMatched = function(card1, card2){
      card1.matched = true;
      card2.matched = true;
      card1.show = true;
      card2.show = true;

      $scope.currentPlayer.matches.push([card1, card2]);
      $scope.selectedCards = [];
	  
	  if(!$scope.isGameOver) { resetTurn(true); }

	  
	  if(isMultiPlayer){
		if($scope.currentPlayer.name == 'Computer'){
			$timeout(function(){ computerTurn(), 1001});
		}
	  } 

  }
  
  var resetCards = function(card1, card2){
    card1.show = false;
    card2.show = false;
    $scope.selectedCards = [];
	resetTurn(false)
  }
  
  
   var resetTurn = function(isMatch){
	if(isMultiPlayer){
		$scope.currentPlayer = isMatch ? $scope.currentPlayer : ($scope.currentPlayer == $scope.p1 ? $scope.p2 : $scope.p1);
	}
	
	timerStarted = false;
	$scope.message = "";
  }
   
   var containsCard = function(card, list){
    for(var i=0; i<list.length; i++){
      if(list[i] == card){
        return true
      }
    }
    return false;
  }
  
  var storeInComputerMemory = function(card1, card2){
	if(computerMemory.length > 4){
		computerMemory.splice(0, 2);
	} 
	
	if(!containsCard(card1, computerMemory)){
		computerMemory.push(card1)
	}
	
	if(!containsCard(card2, computerMemory)){
		computerMemory.push(card2)
	}
}
  var containsCard = function(card, list){
    for(var i=0; i<list.length; i++){
      if(list[i] == card){
        return true
      }
    }
    return false;
  }

  if(isMultiPlayer){
	  $scope.$watch('currentPlayer', function(val){
			if($scope.currentPlayer.name == 'Computer' ){
				computerTurn();
			}
		});
   }
	
  function computerTurn(){
		var card1; var card2;
		var values = {};
		var filteredComputerMem = computerMemory.filter( mem => !mem.matched);
		
		for(var i=0; i<filteredComputerMem.length; i++){
			var mem = filteredComputerMem[i];
			
			if(!values[mem.value]){
				values[mem.value] = mem.id;
			} else {
				card1 = cards[values[mem.value]];
				card2 = cards[mem.id];
			}
		}
		
		var move1 = card1 ? card1 : randomMove();
		$scope.toggleCard(move1);
		if(!card2){
			var tmp2 = computerMemory.filter(mem => !mem.show && mem.value == move1.value);
			card2 = tmp2.length > 0 ? tmp2[0] : randomMove();
		}

		$timeout(function(){  $scope.toggleCard(card2) }, 1000);
	}
	
  var randomMove = function(){
		var randId = getRandomId();
		while(cards[randId].matched || cards[randId].show){
			randId = getRandomId();
		}
		
	 return cards[randId];
	}
  
  var getRandomValue = function(){
    var rand = getRandomId();
	return cards[rand] != null ? getRandomValue() : rand;
  }
  
  var getRandomId = function(){
	return Math.floor(Math.random() * numCards);
  }
}

myApp.filter('unsafe', function($sce){
	return function(val){
		return $sce.trustAsHtml(val);
	}
});


