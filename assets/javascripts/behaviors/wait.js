'use strict';
LB.wait = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row');
  var _sidebar = LB.Widgets.Sidebar(stats);
  var _tutorial = $(crel('div')).addClass('tutorial col-10');

  var _headerWidget = LB.Widgets.Header(stats);
  var _waitWidget = $(crel('div')).addClass('wait dayPlanner active col-10');
  var _tutorialWidget = LB.Widgets.Tutorial(stats);

   _tutorial.append(
    _tutorialWidget.render()
  );

  _playGround.append(
    _sidebar.render(),
    _waitWidget,
    _tutorial
  );

  _content.append(
    _headerWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );

  var checkStatus = function(){
    LB.Backend.getStats(function(data){
      if(data.day_status == 'wait'){
        setTimeout(function() {
          checkStatus();
        }, 5000);
      }
      else
        LB.paintScreen();
    });
  }

  setTimeout(function() {
    checkStatus();
  }, 5000);
};
