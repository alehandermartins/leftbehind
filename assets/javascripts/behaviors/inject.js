'use strict';

LB.Inject = function(stats){
  var _createdWidget = $(crel('div')).addClass('dayPlanner col-10');
  var _instructions = LB.Widgets.Label(LB.t.html('events.inject.intro'),'', 12);

  var _yesButton = LB.Widgets.Button(LB.t.html('events.inject.yes'), function(){
    _sendSelections(true);
  }, 6);

  var _noButton = LB.Widgets.Button(LB.t.html('events.inject.no'), function(){
    _sendSelections(false);
  }, 6);

  _createdWidget.append(
    _instructions.render(),
    _yesButton.render(),
    _noButton.render()
  );

  var _sendSelections = function(selection){
    var _builtAction = {'events': {name: 'inject', payload: {decision: selection}}}
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
