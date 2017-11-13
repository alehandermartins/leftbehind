'use strict';
(function(ns){

	ns.Widgets.Players = function(stats){
    var _statusbar = $(crel('div')).addClass('statusbar')
		var _players = stats.players

		Object.keys(_players).sort(function(a, b){
      var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

      if (a == ns.playerUuid())
        return -1

      if (b == ns.playerUuid())
        return 1

      return rolesOrder.indexOf(_players[a].role) - rolesOrder.indexOf(_players[b].role)

	    }).forEach(function(player){
	      _players[player].uuid = player
	      var _cell = $(crel('div')).addClass('col-xs-3').css('padding', 0)
	      var _wrapper = $(crel('div')).addClass('avatarWrapper')
	      var _playerButton = $(crel('div')).addClass('player')
	      var _avatar = $(crel('div')).addClass('avatar')
	      var _name = $(crel('div')).addClass('name').text(_players[player].name)
	      var _status = 'lagging'
	      var _role =_players[player].role

	      if (['dead', 'crashed', 'trapped', 'exploded', 'radiated'].includes(_players[player].status))
	        _status = 'wont-play'
	      else
	        if (_players[player].stage == 'wait' || _players[player].status == 'escaped')
	          _status = 'ahead';

	      _avatar.addClass(_status)
	      _avatar.addClass(_role)
	      _avatar.addClass(player)

	      _wrapper.append(_avatar)

	      _playerButton.append(_name)
	      _playerButton.append(_wrapper)
	      _statusbar.append(_playerButton)
	    })

	  return {
	  	render: function(){
	  		return _statusbar;
	  	}
	  }
	}

}(LB || {}))