'use strict';
(function(ns){

  ns.Voting = function(stats){
    var _createdWidget = $(crel('div')).addClass('dayPlanner col-12');

    var _alive_players = [];
    Object.keys(stats.players).forEach(function(player){
      var selectable_player = stats.players[player];
      selectable_player['uuid'] = player;
      if (stats.players[player].status == 'alive') _alive_players.push(selectable_player);
    });

    var _food_amount = stats.team.food;
    var _number_of_votes = _alive_players.length - _food_amount;

    var _instructions = ns.Widgets.Label(ns.t.html(ns.t.text('events.voting.intro', {alive: _alive_players.length.toString(), food: _food_amount.toString(), votes: _number_of_votes})),
      '', 12);
    var _createdWidgetContainer = $(crel('div')).addClass('col-12');
    var _label = ns.Widgets.Label('Your vote', '', 12);

    var _selectedTargets = [];
    var _selectedTargetsNames = [];

    var _candidatesWidget = ns.Widgets.TargetSelector(_alive_players, _number_of_votes, function(candidates){
       candidates.map(function(candidate){
        if (_selectedTargets.length >= _number_of_votes){
          _selectedTargets.shift();
          _selectedTargetsNames.shift();
        }
        _selectedTargets.push(candidate.uuid);
        _selectedTargetsNames.push(candidate.name);
        _label.setValue(_selectedTargetsNames.join(', '));
      });
    });

    var _builtAction = {'events': {name: 'vote', payload: {target: _selectedTargets}}}

    _createdWidget.append(_createdWidgetContainer);
    _createdWidgetContainer.append(_instructions.render(), _candidatesWidget.render());

    var _sendButtonVotingWidget = ns.Widgets.SendVotesButton(_builtAction, _number_of_votes);
    _createdWidget.append( _label.render(), _sendButtonVotingWidget.render());

    return{
      render: function(){
        return _createdWidget;
      }
    };
  };

}(LB || {}));
