'use strict';
LB.defaultEvent = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 
  var _sidebar = LB.Widgets.Sidebar(stats);
  
  var _results = $(crel('div')).addClass('results active col-10');
  var _dayPlanner = $(crel('div')).addClass('dayPlanner col-10');
  var _tutorial = $(crel('div')).addClass('tutorial col-10');

  var _headerWidget = LB.Widgets.Header(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _tutorialWidget = LB.Widgets.Tutorial(stats);
  var _OKButton = LB.Widgets.OKButton();

  _playGround.append(
    _sidebar.render(),
    _results,
    _dayPlanner,
    _tutorial
  );

  _tutorial.append(
    _tutorialWidget.render()
  );

  _results.append(
    _resultsWidget.render()
  );

  _dayPlanner.append(
    _OKButton.render()
  );

  _content.append(
    _headerWidget.render(),
    _playGround
  )

  dayContainer.append(
    _content
  );
};
