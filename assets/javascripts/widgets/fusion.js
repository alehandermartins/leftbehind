'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Fusion = function(stats){
    var _createdWidget = $(crel('div')).addClass('col-xs-12');
    var _instructions = ns.Widgets.Label(ns.t.html('events.fusion.intro'),'', 12);

    var _enterButton = ns.Widgets.Button(ns.t.html('buttons.enter'), function(){
      _sendSelections(true);
    }, 6);

    var _stayButton = ns.Widgets.Button(ns.t.html('buttons.stay'), function(){
      _sendSelections(false);
    }, 6);

    _createdWidget.append(
      _instructions.render(),
      _enterButton.render(),
      _stayButton.render()
    );

    var _sendSelections = function(selection){
      var _builtAction = {'events': {name: 'fusion', payload: {enter: selection}}}
      ns.Backend.daySelections(
        {
          game_uuid: ns.currentGame(),
          player_uuid: ns.playerUuid(),
          actions: _builtAction,
        },
        ns.Events.SentSelections
      );
    }


    return{
      render: function(){
        return _createdWidget;
      }
    };
  };

}(LB || {}));
