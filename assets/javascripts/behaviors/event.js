'use strict';

LB.Event = function(stats){
  var event = stats.event;
  if(event == 'defaultEvent')
    return LB.DefaultEvent(stats);

  var introText = LB.t.html('action.' + event + '.intro', {target: target});
  var yesText = LB.t.html('action.' + event + '.selection.yes');
  var noText = LB.t.html('action.' + event + '.selection.no');

  var target;
  var attacker = Object.keys(stats.players).filter(function(player){
    return stats.players[player].target;
  })[0];

  if(attacker){
    if(attacker == LB.playerUuid())
      target = stats.players[stats.players[attacker].target].name;
    else{
      target = stats.players[attacker].name;
      introText = LB.t.html('action.' + event + '.intro2', {target: target});
      yesText = LB.t.html('action.' + event + '.selection.yes2');
      noText = LB.t.html('action.' + event + '.selection.no2');
    }
  }

  var _createdWidget = $(crel('div')).addClass('dayPlanner col-12');
  var _instructions = LB.Widgets.Label(introText,'', 12);

  var _yesButton = LB.Widgets.Button(yesText, function(){
    _sendSelections(true);
  }, 6);

  var _noButton = LB.Widgets.Button(noText, function(){
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
