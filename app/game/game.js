'use strict';

angular.module('myApp.game', ['ngRoute'])

function gameController($scope, $timeout, boardGameService){
	var game = boardGameService.getGame;
	var cards = game.cards;
	var players = game.players;
	var numCards = boardGameService.numCards;
	
	$scope.board = game.board;
	
	console.log("payers");
	console.dir(numCards)
	
	$scope.isGameOver = false;
	$scope.selectedCards = [];

	var computerMemory = [];
	$scope.message = '';
	var totalMatches = 0;
	var timeout;
	var timerStarted = false;
	
	$scope.currentPlayer = players[0];
	$scope.p1 = players[0];
	$scope.p2 = players[1];

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

			$scope.message = $scope.isGameOver ? "GAME OVER" : "You found a match!";
			timerStarted = true;
			timeout = $timeout(function(){ setMatched(card1, card2); }, 1000)
			
			
		} else {
			timerStarted = true;
		    $scope.message = "Not today! try again!";
			timeout = $timeout(function(){ resetCards(card1, card2)}, 1000);
			storeInComputerMemory(card1, card2);
		}
	}
	
	$scope.currentPlayer.turn++;
  };
  
  var setMatched = function(card1, card2){
      card1.matched = true;
      card2.matched = true;
      card1.show = true;
      card2.show = true;

      $scope.currentPlayer.matches.push([card1, card2]);
      $scope.selectedCards = [];
	  
	  //don't reset the turn if they got the match right
	  if(!$scope.isGameOver){
		resetTurn(true);
	   }
	   
	   //if the computer got the match, do it again!
	if($scope.currentPlayer.name == 'Computer'){
		$timeout(function(){ computerTurn(), 1001});;
	}
  }

  var resetCards = function(card1, card2){
    card1.show = false;
    card2.show = false;
    $scope.selectedCards = [];
    resetTurn(false);
  }
  
  var resetTurn = function(isMatch){
	timerStarted = false;
	$scope.currentPlayer = isMatch ? $scope.currentPlayer : ($scope.currentPlayer == $scope.p1 ? $scope.p2 : $scope.p1);
	$scope.message = "";
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

  	$scope.$watch('currentPlayer', function(val){
		if($scope.currentPlayer.name == 'Computer' ){
			computerTurn();
		}
	});
	
	
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
	//select 2 cards at random. maybe add something smart later
	var randId = getRandomId();
	console.log("randId: "+randId);
	console.dir(cards[randId]);
	while(cards[randId].matched || cards[randId].show){
		randId = getRandomId();
	}
	
	 return cards[randId];
  }
  
  
  //all the functions to initialize the game

  function getRandomValue(){
    var rand = getRandomId();
	return cards[rand] != null ? getRandomValue() : rand;
  }
  
  function getRandomId(){
	return Math.floor(Math.random() * numCards);
  }
}
