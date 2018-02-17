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
  var colMax = 4;
  var rowMax = 13;
  var numCards = colMax * rowMax;
  $scope.selectedCards = [];

  var cards = {};
  $scope.board = [];
  $scope.matches = [];
  $scope.numMatches = 0;
  $scope.expandMatches = false;
  $scope.showGameEnd = false;
  $scope.message = '';

  initializeGame();

  $scope.toggleCard = function(card){
    card.show = !card.show;

    //make sure you can't click on the same card twice, duh
    if(!containsCard(card)){
      $scope.selectedCards.push(card);
    }

    if($scope.selectedCards.length == 2){
      $scope.message = "you've already selected 2 cards!";
      checkForMatch($scope.selectedCards[0], $scope.selectedCards[1])
    }
  };

  var checkForMatch = function(card1, card2){
    if(card1 == card2){
      $scope.message = "Pick a different card kid";
    }else if(card1.value == card2.value ){
      $scope.message = "You found a match! Congrats!";

      //set the cards as matched
      //show the display value
      card1.matched = !card1.matched;
      card2.matched = !card2.matched;
      card1.show = true;
      card2.show = true;

      $scope.matches[$scope.numMatches] = [card1, card2];
      $scope.numMatches += 1;
      //clear the selected cards
      $scope.selectedCards = [];
      $scope.expandMatches = true;
      $timeout(function(){ $scope.message = "" }, 1000);

      //if you won the game dawg
      if($scope.numMatches == numCards/2){
        $scope.showGameEnd = true;
      }
    } else {
      //if the cards don't match, reset them
      $scope.message = "Not today! try again!";
      $timeout(function(){ resetCards(card1, card2)}, 1000);
    }
  };

  var resetCards = function(card1, card2){
    card1.show = !card1.show;
    card2.show = !card2.show;
    $scope.selectedCards = [];
    $scope.message = "";
  }


  function containsCard(card){
    for(var i=0; i<$scope.selectedCards.length; i++){
      if($scope.selectedCards[i] == card){
        return true
      }
    }
    return false;
  }

  //all the functions to initialize the game
  function initializeGame(){
    populateCardValues();
    createBoard();
  }

  function populateCardValues(){
    for(var suit=0; suit<cardSuits.length; suit++){
      for(var value=1; value<rowMax+1; value++) {
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

    //sets up the board
    for(var row=0; row<rowMax; row++){
      if(!$scope.board[row]){
        $scope.board[row] = [];
      }
    }
    populateBoard();
  }

  function populateBoard(){
    var bRow = 0;

    for(var card=0; card<numCards; card++){
      if($scope.board[bRow].length < colMax){
        $scope.board[bRow].push(cards[card]);
      } else {
        bRow++;
        $scope.board[bRow].push(cards[card]);
      }
    }
  }

  function Card(id, display, value, suit){
    this.id = id;
    this.display = display;
    this.value = value;
    this.suit = suit;
    this.show = false;
    this.matched = false;
  }

  function getRandomValue(){
    var rand = Math.floor(Math.random() * numCards);
    return cards[rand] != null ? getRandomValue() : rand;
  }
}