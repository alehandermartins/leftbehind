'use strict';
LB.startGame = function(game){
  var _gameStartContainer = $('.game_container');
  _gameStartContainer.empty();

  var _currentPlayersWidget = LB.Widgets.CurrentPlayers();
  var _introduction = LB.Widgets.Introduction();
  var _playButtonWidget = LB.Widgets.PlayButton(game);
  var _content = $(crel('div')).addClass('content')

  $('.game_name').html(game.name);

  _content.append(
    _currentPlayersWidget.render(),
    _introduction.render(),
    _playButtonWidget.render()
  )

  _gameStartContainer.append(
    _content
  );
};
