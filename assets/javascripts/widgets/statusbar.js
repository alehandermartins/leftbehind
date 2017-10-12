'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PlayersStatus = function(stats){
    var actions = LB.AllActions(stats);
    var _createdWidget = $(crel('div')).addClass('statusbar');
    var _players = _players = stats.players;

    var contributions = function(player){
      var _contributions = $(crel('div')).addClass('contributions');

      var siblings = Object.keys(_players[player].shared_inventory).map(function(subStat){
        return $(crel('span')).addClass('resource').append(
          _players[player].shared_inventory[subStat],
          ns.t.html([':', ':'].join(subStat))
        );
      });
      _contributions.append(siblings);
      return _contributions;
    }

    Object.keys(_players).sort(function(a, b){
      var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

      if (a == ns.playerUuid())
        return -1

      if (b == ns.playerUuid())
        return 1

      return rolesOrder.indexOf(_players[a].role) - rolesOrder.indexOf(_players[b].role)

    }).forEach(function(player){

      var _cell = $(crel('div')).addClass('col-xs-3').css('padding', 0);
      var _wrapper = $(crel('div')).addClass('avatarWrapper');
      var _player = $(crel('div')).addClass('player');
      var _avatar = $(crel('div')).addClass('avatar');
      var _name = $(crel('div')).addClass('name').text(_players[player].name)
      var _status = 'lagging';
      var _role =_players[player].role

      if (['dead', 'devoured', 'crashed', 'trapped', 'exploded', 'radiated'].includes(_players[player].status))
        _status = 'wont-play';
      else
        if (_players[player].stage == 'wait' || _players[player].status == 'escaped')
          _status = 'ahead';

      _avatar.addClass(_status);
      _avatar.addClass(_role);
      _avatar.addClass(player);

      _wrapper.append(_avatar);

      _player.append(_wrapper);
      _player.append(contributions(player));
      _player.append(_name);

      // _player.on('click', function(){
      //   bootbox.alert({
      //     title: _players[player].name,
      //     message: playerInfo(player).render()
      //   });
      // });

      _createdWidget.append(_player)
    })

    var playerInfo = function(player){
      var _info = {}
      var _actions = {}
      var _infoContainer = $(crel('div')).addClass('row').addClass('player-log');
      if(stats.personal_info[player]){
        var _lastDay = 0;
        var _lastSelected = 0;

        Object.keys(stats.personal_info[player]).forEach(function(slot){
          var _date = $(crel('div')).addClass('col-xs-12').addClass('day-label');
          var _inventory = $(crel('div')).addClass('col-xs-10').addClass('col-xs-offset-2').addClass('inventory');

          var _day = Math.floor(slot / 6) + 1;
          var _dateText = ns.t.text('logs.day', {day: _day});

          var split = stats.personal_info[player][slot].action.split(':');
          var name = split[4].toLowerCase();

          var action = actions[name];

          var result = stats.personal_info[player][slot].result;
          result['performer'] = player;
          result['payload'] = stats.personal_info[player][slot].payload;
          result['slot'] = slot;

          var _actionResult = action.showResult(result, stats.players);
          if (!_actionResult)
            return

          var _resources = Object.keys(stats.personal_info[player][slot].inventory).map(function(resource){
            return [':', ':'].join(resource) + ' ' + stats.personal_info[player][slot].inventory[resource];
          }).join(', ');

          _date.text(_dateText);
          _inventory.html(ns.t.html('player.inventory', {resources: _resources}));

          _date.css({'text-decoration': 'underline'});
          _inventory.css({'font-style': 'italic'});

          if (_day != _lastDay){
            _lastDay = _day;
            _info[_day] = $(crel('div'));
            _actions[_day] = $(crel('div'));
            _info[_day].append(_date, _actions[_day]);
            _date.on('click', function(){
              if(_lastSelected != _day){
                _actions[_day].show();
                _actions[_lastSelected].hide();
              }
              _lastSelected = _day;
            });
            _lastSelected = _day;
          }

          _actions[_day].append(_actionResult);

          if (stats.personal_info[player][slot].inventory)
            _actions[_day].append(_inventory);
        });

        Object.keys(_info).forEach(function(key){
          _actions[key].hide();
          _infoContainer.append(_info[key]);
        });
        _actions[_lastSelected].show();
      }
      else
        _infoContainer.text(ns.t.text('logs.empty'));

      return{
        render: function(){
          return _infoContainer
        }
      }
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(LB || {}));
