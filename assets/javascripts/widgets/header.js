'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Header = function(stats){
    var _createdWidget = $(crel('div')).addClass('header row text-center')
    var avatar = $(crel('div')).addClass('statusbar col-2')

    var _players = stats.players
    Object.keys(_players).sort(function(a, b){
      var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

      if (a == ns.playerUuid())
        return -1

      if (b == ns.playerUuid())
        return 1

      return rolesOrder.indexOf(_players[a].role) - rolesOrder.indexOf(_players[b].role)

    }).forEach(function(player){
      if(player != ns.playerUuid())
        return

      var _wrapper = $(crel('div')).addClass('avatarWrapper')
      var _playerButton = $(crel('div')).addClass('player')
      var _avatar = $(crel('div')).addClass('avatar')
      var _name = $(crel('div')).addClass('name text-center').text(_players[player].name)
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
      avatar.append(_playerButton)
    })

    _createdWidget.append(avatar)

    var _info = $(crel('div')).addClass('info col-10')
    _createdWidget.append(_info)

    var _personal = $(crel('div')).addClass('row personal')
    var _team = $(crel('div')).addClass('row team')

    var _oxygen =  $(crel('div')).addClass('stat food col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('food'))),
      $(crel('span')).addClass('value').text(stats.personal['food'] + " / 2")
    )
    var _helmet = $(crel('div')).addClass('stat helmet col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('helmet'))),
      $(crel('span')).addClass('value').text(stats.personal['helmet'])
    )
    var _time = $(crel('div')).addClass('stat day col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('day'))),
      $(crel('span')).addClass('value').text(stats.status['day'])
    )
    var _shuttle = $(crel('div')).addClass('stat shuttle col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('shuttle'))),
      $(crel('span')).addClass('value').text(stats.status['shuttle'])
    )
    var _parts = $(crel('div')).addClass('stat parts col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('parts'))),
      $(crel('span')).addClass('value').text(stats.team['parts'])
    )
    var _energy = $(crel('div')).addClass('stat energy col-4').append(
      $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join('energy'))),
      $(crel('span')).addClass('value').text(stats.team['energy'])
    )

    _personal.append(_oxygen, _helmet, _time)
    _team.append(_shuttle, _energy, _parts)

    _info.append(_personal, _team)

    return {
      render: function(){
        return _createdWidget
      }
    }
  };

  ns.Widgets.EmptyLocationsInfo = function(provider){
    var _createdWidget = $(crel('div')).addClass('col-12')
    if (!provider)
      _createdWidget.append('You don\'t know of any')
    else
      Object.keys(provider).map(function(locationName){
        var _infoLine = $(crel('div')).addClass('row')
        var _locationName = $(crel('span')).addClass('col-4').text(locationName + ':')

        var _slot = provider[locationName]
        var _day = Math.floor(_slot / 7) + 1
        var _daySlot = ns.SLOTS[(_slot % 7) - 1]
        var _dateText = 'since day ' + _day + ', ' + _daySlot.label

        var _emptySince = $(crel('span')).addClass('col-4').html(ns.t.html(_dateText))

        _infoLine.append(
          _locationName,
          _emptySince
        )

        _createdWidget.append(_infoLine)
      })

    return {
      render: function(){
        bootbox.alert({
          title: 'Empty locations you are aware:',
          message: $(crel('div')).addClass('row').append(_createdWidget)
        })
      }
    }
  }

}(LB || {}));
