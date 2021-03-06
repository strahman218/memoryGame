'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.game',
  'myApp.home',
  'myApp.version'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
    .when('/game/single', {
	templateUrl: 'game/game.html',
	controller: gameController
  })
  .when('/game/multi', {
    templateUrl: 'game/game.html',
    controller: gameController
  })
  .when('/', {
    templateUrl: 'home/home.html',
    controller: homePageController
  })
  .otherwise({redirectTo: '/home'});
}])
.service('boardGameService', function(){
	var cardSuits = ['heart', 'spade', 'club', 'diamond'];
	var colMax = 13;
	var rowMax = 4;
	var numCards = colMax * rowMax;
	var cards = {};
	var game = new Game();
	initializeGame();
	
	//players is the just a list of names
	var addPlayer = function(player){
		var p = new Player(player);
		game.players.push(p);
	}
	
	var setGameType = function(type){
		game.type = type;
	}
	
	//all private methods
	function initializeGame(){
		populateCardValues();
		createBoard();
	 }  
	  
	function populateCardValues(){
    for(var suit= 0; suit<cardSuits.length; suit++){
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
    for(row=0; row<rowMax; row++){
      if(game.board[row] == null){
        game.board[row] = [];
      }
    }
	
    populateBoard();
  }

  function populateBoard(){
    var bRow = 0;

    for(var card=0; card<52; card++){
      if(game.board[bRow].length < colMax){
        game.board[bRow].push(cards[card]);
      } else {
        bRow++;
        game.board[bRow].push(cards[card]);
      }
    }
  }

  function Card(id, display, value, suit){
    this.id = id;
    this.display = display;
    this.value = value;
    this.suit = suit;
	this.icon = suit == 'diamond' ? " &diams;" : " &"+suit+"s;"
    this.show = false;
    this.matched = false;
  }
  
   function getRandomValue(){
    var rand = getRandomId();
	return cards[rand] != null ? getRandomValue() : rand;
  }
  
  function getRandomId(){
	return Math.floor(Math.random() * numCards);
  }

  
  function Player(name){
	this.name = name;
	this.turn = 0;
	this.matches = [];
  }
  
  function Game(){
  	this.type = ''; 
	this.board = [],
	this.players = [],
	this.cards = cards
  }
  
  return {
	addPlayer: addPlayer,
	getGame: game,
	numCards: numCards,
	setType: setGameType
	}
  })
  /*.directive('singlePlayerGame', function(){
	
	return {
		restrict: 'E',
		templateUrl: '/singlePlayerGame.html',
		controller: gameController
	}
  })
  .directive('multiPlayerGame', function(){
	return {
		restrict: 'E',
		templateUrl: '/multiPlayerGame.html',
		controller: gameController
	}
  })*/
