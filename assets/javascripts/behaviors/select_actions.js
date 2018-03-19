'use strict';
LB.selectActions = function(stats){

  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row');
  var _sidebar = LB.Widgets.Sidebar(stats);

  var _results = $(crel('div')).addClass('results col-10');
  var _tutorial = $(crel('div')).addClass('tutorial col-10');

  if(stats.current_slot != 0)
    _results.addClass('active');

  var _headerWidget = LB.Widgets.Header(stats);
  var _dayPlanner = LB.Widgets.DayPlanning(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _tutorialWidget = LB.Widgets.Tutorial(stats);

  _playGround.append(
    _sidebar.render(),
    _results,
    _tutorial,
    _dayPlanner.render()
  );

  _results.append(
    _resultsWidget.render()
  );

  _tutorial.append(
    _tutorialWidget.render()
  );

  _content.append(
    _headerWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );
};
