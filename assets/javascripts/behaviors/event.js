'use strict';

LB.Event = function(stats){
  var event = stats.context['event'];
  if(event == 'defaultEvent')
    return LB.DefaultEvent(stats);

  var _createdWidget = $(crel('div')).addClass('dayPlanner col-12');
  var _instructions = LB.Widgets.Label(LB.t.html('action.' + event + '.intro'),'', 12);

  var _yesButton = LB.Widgets.Button(LB.t.html('action.' + event + '.selection.yes'), function(){
    _sendSelections(true);
  }, 6);

  var _noButton = LB.Widgets.Button(LB.t.html('action.' + event + '.selection.no'), function(){
    _sendSelections(false);
  }, 6);

  _createdWidget.append(
    _instructions.render(),
    _yesButton.render(),
    _noButton.render()
  );

  var _sendSelections = function(selection){
    var _builtAction = {'events': {name: event, payload: {decision: selection}}}
    LB.Backend.daySelections(
      {
        game_uuid: LB.currentGame(),
        player_uuid: LB.playerUuid(),
        actions: _builtAction,
      },
      LB.Events.SentSelections
    );
  }

  return{
    render: function(){
      return _createdWidget;
    }
  }
}

LB.DefaultEvent = function(stats){
  var _createdWidget = $(crel('div')).addClass('dayPlanner col-12');
  var _OKButton = LB.Widgets.OKButton();

  _createdWidget.append(_OKButton.render());

  return {
    render: function(){
      return _createdWidget;
    }
  }
}
