'use strict';
LB.selectActions = function(stats){

  var dayContainer = $('.game_container');
  dayContainer.empty();
  
  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 
  var _sidebar = LB.Widgets.Sidebar(stats);

  var _results = $(crel('div')).addClass('results col-10');
  var _dayPlanner = $(crel('div')).addClass('dayPlanner col-10');
  var _targetSelector = $(crel('div')).addClass('targetSelector col-10');
  var _actionSelector = $(crel('div')).addClass('actionSelector col-10');
  var _tutorial = $(crel('div')).addClass('tutorial col-10');

  if(stats.current_slot == 0)
    _dayPlanner.addClass('active');
  else
    _results.addClass('active');

  var _headerWidget = LB.Widgets.Header(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _tutorialWidget = LB.Widgets.Tutorial(stats);

  var _dayPlanningWidget = LB.Widgets.DayPlanning(LB.SLOTS, LB.Actions(stats));
  var _targetSelectorWidget = LB.Widgets.DayTargetSelector(_dayPlanningWidget, _actionSelector, stats);
  var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_dayPlanningWidget);

  _playGround.append(
    _sidebar.render(),
    _results,
    _tutorial,
    _dayPlanner,
    _targetSelector,
    _actionSelector
  );

  _tutorial.append(
    _tutorialWidget.render()
  );

  _results.append(
    _resultsWidget.render()
  );

  _dayPlanner.append(
    _dayPlanningWidget.render(),
    _sendActionsButtonWidget.render()
  );

  _targetSelector.append(
    _targetSelectorWidget.render()
  );

  _content.append(
    _headerWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );
};
