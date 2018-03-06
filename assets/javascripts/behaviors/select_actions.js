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

  var _back = $(crel('div'));
  var _backLabel = $(crel('span')).text('Back ');
  var _arrow = $(crel('i')).addClass('fa fa-arrow-right');
  _backLabel.append(_arrow);
  _back.append(_backLabel);
  _actionSelector.append(_back);
  _back.addClass('col-12')
  _back.css('text-align','right');
  _backLabel.css('cursor', 'pointer');

  if(stats.current_slot == 0)
    _dayPlanner.addClass('active');
  else
    _results.addClass('active');

  _backLabel.click(function(){
    $('.actionSelector').animateCss("fadeOutRight", function(){
      $('.actionSelector').removeClass('active');
      $(".selected-room").css('display', 'none');
      $(".selected-room").removeClass('selected-room');
      $(".targetSelector").addClass('active');
      $(".targetSelector").animateCss("fadeInRight");
    });
  });

  var _headerWidget = LB.Widgets.Header(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  
  var _dayPlanningWidget = LB.Widgets.DayPlanning(LB.SLOTS, LB.Actions(stats));
  var _targetSelectorWidget = LB.Widgets.DayTargetSelector(_dayPlanningWidget, _actionSelector, stats);
  var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_dayPlanningWidget);

  _playGround.append(
    _sidebar.render(),
    _results,
    _dayPlanner,
    _targetSelector,
    _actionSelector
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
