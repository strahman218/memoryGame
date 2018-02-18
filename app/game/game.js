'use strict';

angular.module('myApp.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: gameController
  });
}]);

function gameController($scope, $timeout){
	var cardSuits = ['heart', 'spade', 'club', 'diamond'];
	var colMax = 13;
	var rowMax = 4;
	var numCards = colMax * rowMax;
	$scope.isGameOver = false;
	$scope.selectedCards = [];

	var cards = {};
	$scope.board = [];
	$scope.message = '';
	var totalMatches = 0;
	
	initializeGame();
	$scope.currentPlayer = $scope.p1;

	var timeout;
	var timerStarted = false;
	

  $scope.toggleCard = function(card){	
  if(timerStarted){
	return;
  }
	if($scope.selectedCards.length < 2){
		card.show = $scope.selectedCards.length <= 2;
		if(!containsCard(card)){
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
	  if(!$scope.isGameOver){resetTurn();}
  }

  var resetCards = function(card1, card2){
    console.log("resetCards()");
    card1.show = false;
    card2.show = false;
    $scope.selectedCards = [];
    resetTurn();

  }
  
  var resetTurn = function(){
	timerStarted = false;
	$scope.currentPlayer = $scope.currentPlayer == $scope.p1 ? $scope.p2 : $scope.p1;
	$scope.message = "";
  }


  var containsCard = function(card){
    for(var i=0; i<$scope.selectedCards.length; i++){
      if($scope.selectedCards[i] == card){
        return true
      }
    }
    return false;
  }

  	$scope.$watch('currentPlayer', function(val){
		if(val.name == 'Computer'){
			computerTurn();
			$timeout(function(){ computerTurn(); }, 1000);
		}
	})
	
  function computerTurn(){
	//select 2 cards at random. maybe add something smart later
	var randId = getRandomId();
	while(cards[randId].matched || cards[randId].show){
		randId = getRandomId();
	}
	 var card = cards[randId];
	 console.log("computer turn");
	 console.dir(card);
	 $scope.toggleCard(card);
  }
  //all the functions to initialize the game

  function initializeGame(){
  console.log("initializeGame()");
    populateCardValues();
    createBoard();
	addPlayers();
	
  }  
  
  function addPlayers(){
	  $scope.p1 = new Player('You');
	  $scope.p2 = new Player('Computer');
  }
  
  function populateCardValues(){
  console.log("populateCardValues()");
    for(var suit=0; suit<cardSuits.length; suit++){
      for(var value=1; value<14; value++) {
        var cardValue = [1, 11, 12, 13].indexOf(value) != -1 ? getCardValue(value) : value;
        var cardId = getRandomValue();		
        var tmp = new Card(cardId, cardValue, value, cardSuits[suit]);
        cards[cardId] = tmp;
      }
    }
  }

  function getCardValue(value){
    var display;

      switch(value){
        case 1:
              display = 'A';
              break;
        case 11:
              display = 'J';
              break;
        case 12:
              display = 'Q';
              break;
        case 13:
              display = 'K';
              break;
      }

    return display;
  }

  function createBoard(){
  var row;
	console.log("create board");
    //sets up the board
    for(row=0; row<rowMax; row++){
      if($scope.board[row] == null){
        $scope.board[row] = [];
      }
    }
	
    populateBoard();
  }

  function populateBoard(){
  console.log("populateBoard()");
    var bRow = 0;

    for(var card=0; card<52; card++){
      if($scope.board[bRow].length < colMax){
        $scope.board[bRow].push(cards[card]);
      } else {
        bRow++;
        $scope.board[bRow].push(cards[card]);
      }
    }
	
	console.log("board is done");
	console.dir($scope.board);
  }

  function Card(id, display, value, suit){
    this.id = id;
    this.display = display;
    this.value = value;
    this.suit = suit;
    this.show = false;
    this.matched = false;
  }
  
  function Player(name){
	this.name = name;
	this.turn = 0;
	this.matches = [];
  }

  function getRandomValue(){
    var rand = getRandomId();
	return cards[rand] != null ? getRandomValue() : rand;
  }
  
  function getRandomId(){
	return Math.floor(Math.random() * numCards);
  }
}