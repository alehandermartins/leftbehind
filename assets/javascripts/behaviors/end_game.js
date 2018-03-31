'use strict';
LB.EndGame = function(stats){
  var _createdWidget = $(crel('div')).addClass('dayPlanner active col-12');
  var _message = LB.t.html('player.status.' + stats.player_status);
  var _result = $(crel('h2')).append(_message).addClass('end-game');

  var _background = $(crel('img')).addClass('img-responsive')
  _background.attr('src', '/images/endings/' + stats.player_status + '.jpg')

  if(stats.player_status != 'escaped')
     _result.css('color', 'red')

   _createdWidget.append(_result, _background);

  return {
    render: function(){
      return _createdWidget;
    }
  }
};
