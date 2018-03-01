'use strict';
LB.selectActions = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _dayPlanningWidget = LB.Widgets.DayPlanning(LB.SLOTS, LB.Actions(stats));
  var _actionSelectorWidget = LB.Widgets.ActionSelector(_dayPlanningWidget, stats);
  var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_dayPlanningWidget);
  var _content = $(crel('div')).addClass('content');
  var _mainDisplay = $(crel('div')).addClass('playgorund row'); 
  var _sidebar = $(crel('div')).addClass('sidebar col-2');
  var _selections = $(crel('div')).addClass('selections col-10');

  _mainDisplay.append(
    _sidebar,
    _selections
  )

  _selections.append(
    _dayPlanningWidget.render(),
    _sendActionsButtonWidget.render()
  )

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _mainDisplay
  )

  dayContainer.append(
    _content
  );
};
