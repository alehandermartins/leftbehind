'use strict';
LB.selectActions = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();
  
  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 
  var _sidebar = $(crel('div')).addClass('sidebar col-2');

  var _dayPlannerToggler = $(crel('div')).addClass('dayPlannerToggler active text-center col-12');
  _dayPlannerToggler.html(LB.t.html(':fist_tone5:'));
  _sidebar.append(_dayPlannerToggler);

  _dayPlannerToggler.click(function(){
   if(_dayPlannerToggler.hasClass('active'))
    return;

    if(_targetSelector.hasClass('active')){
      _targetSelector.animateCss("fadeOutRight", function(){
        _targetSelector.removeClass('active');
        _dayPlanner.addClass('active');
        _dayPlannerToggler.addClass('active');
        _dayPlanner.css('display', 'block');
        _targetSelector.css('display', 'none');
        _dayPlanner.animateCss("fadeInRight");
      });
    }

    if(_actionSelector.hasClass('active')){
      _actionSelector.animateCss("fadeOutRight", function(){
        _actionSelector.removeClass('active');
        _dayPlanner.addClass('active');
        _dayPlannerToggler.addClass('active');
        _dayPlanner.css('display', 'block');
        _actionSelector.css('display', 'none');
        $(".selected-room").css('display', 'none');
        $(".selected-room").removeClass('selected-room');
        _dayPlanner.animateCss("fadeInRight");
      });
    }
  });
  
  var _dayPlanner = $(crel('div')).addClass('dayPlanner active col-10');
  var _targetSelector = $(crel('div')).addClass('targetSelector col-10');
  var _actionSelector = $(crel('div')).addClass('actionSelector col-10');

  _targetSelector.css('display', 'none');
  _actionSelector.css('display', 'none');

  var _headerWidget = LB.Widgets.Header(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  
  var _dayPlanningWidget = LB.Widgets.DayPlanning(LB.SLOTS, LB.Actions(stats));
  var _targetSelectorWidget = LB.Widgets.DayTargetSelector(_dayPlanningWidget, _actionSelector, stats);
  var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_dayPlanningWidget);

  _playGround.append(
    _sidebar,
    _dayPlanner,
    _targetSelector,
    _actionSelector
  );

  _dayPlanner.append(
    _dayPlanningWidget.render(),
    _sendActionsButtonWidget.render()
  )

  _targetSelector.append(
    _targetSelectorWidget.render()
  );

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );
};
