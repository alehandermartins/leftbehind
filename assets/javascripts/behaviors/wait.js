'use strict';
LB.wait = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 

  var _headerWidget = LB.Widgets.Header(stats);
  var _waitWidget = $(crel('div')).addClass('wait col-12');

  _content.append(
    _headerWidget.render(),
    _waitWidget
  );

  dayContainer.append(
    _content
  );

  setTimeout(function() {
    LB.paintScreen();
  }, 5000);
};
