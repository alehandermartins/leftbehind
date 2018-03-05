'use strict';
LB.defaultEvent = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 
  var _sidebar = $(crel('div')).addClass('sidebar col-2');

  var _headerWidget = LB.Widgets.Header(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _OKButton = LB.Widgets.OKButton();

  _playGround.append(
    _sidebar,
    _OKButton.render()
  );

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _playGround
  )

  dayContainer.append(
    _content
  );
};
