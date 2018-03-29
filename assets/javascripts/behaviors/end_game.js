'use strict';
LB.EndGame = function(stats){
  var _createdWidget = $(crel('div')).addClass('dayPlanner active col-12');
  var _message = LB.t.html('player.status.' + stats.player_status);
  var _result = $(crel('h2')).append(_message).addClass('end-game');
  var _resultImage = $(crel('div')).addClass(stats.player_status)
  
  if(stats.player_status != 'escaped')
     _result.css('color', 'red')

   _createdWidget.append(_result, _resultImage);

  return {
    render: function(){
      return _createdWidget;
    }
  }
};