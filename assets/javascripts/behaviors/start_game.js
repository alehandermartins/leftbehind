'use strict';
LB.startGame = function(game){
  var _gameStartContainer = $('.game_container');
  var _gameFooter = $('.game_footer');
  //_gameFooter.append($(crel('h3')).html('Cooperate, betray... survive.&nbsp;&nbsp;'));
  _gameStartContainer.empty();

  var _currentPlayersWidget = LB.Widgets.CurrentPlayers();
  var _content = $(crel('div')).addClass('content');

  $('.game_name').html(game.name);


  _content.append(
    _currentPlayersWidget.render()
  )

  _gameStartContainer.append(
    _content
  );
};
