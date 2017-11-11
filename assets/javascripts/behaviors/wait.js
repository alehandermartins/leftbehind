'use strict';
LB.wait = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _players = LB.Widgets.Players(stats);
  var _waitWidget = $(crel('div')).addClass('wait col-xs-12');
  var _content = $(crel('div')).addClass('content')

  _content.append(
    _headerWidget.render(),
    _waitWidget
  )

  dayContainer.append(
    _players.render(),
    _content
  );

  setTimeout(function() {
    LB.paintScreen();
  }, 5000);
};
