'use strict';
LB.selectActions = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _dayPlanningWidget = LB.Widgets.DayPlanning(LB.SLOTS, LB.Actions(stats));
  var _actionSelectorWidget = LB.Widgets.ActionSelector(_dayPlanningWidget, stats);
  var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_dayPlanningWidget);
  var _content = $(crel('div')).addClass('content')

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _dayPlanningWidget.render(),
    _sendActionsButtonWidget.render()
  )

  dayContainer.append(
    _content
  );
};
