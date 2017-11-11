'use strict';
LB.defaultEvent = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _players = LB.Widgets.Players(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _OKButton = LB.Widgets.OKButton();
  var _content = $(crel('div')).addClass('content')

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _OKButton.render()
  )

  dayContainer.append(
    _players.render(),
    _content
  );
};
