'use strict';
(function(ns){

	ns.Widgets = ns.Widgets || {}

  ns.Widgets.DayTargetSelector = function(slotWidget, actionSelector, stats){
    var actions = LB.Actions(stats)
    var _createdWidget = $(crel('div'))

    var _selectPlayer = $(crel('div')).addClass('row text-center');
    var _selectPlayerLabel = $(crel('div')).addClass('col-12').text('Select target');

    var _selectRoom = $(crel('div')).addClass('row text-center');
    var _selectRoomLabel = $(crel('div')).addClass('col-12').text('Select room');

    _selectPlayer.append(_selectPlayerLabel);
    _selectRoom.append(_selectRoomLabel);

    _createdWidget.append(_selectPlayer, _selectRoom);

    var _players = stats.players;
    Object.keys(_players).sort(function(a, b){
      var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

      if (a == ns.playerUuid())
        return -1

      if (b == ns.playerUuid())
        return 1

      return rolesOrder.indexOf(_players[a].role) - rolesOrder.indexOf(_players[b].role)

    }).forEach(function(player){
      _players[player].uuid = player
      var _playerButton = $(crel('div')).addClass('player col-4')
      var _wrapper = $(crel('div')).addClass('avatarWrapper')
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

      _playerButton.append(_wrapper)
      _playerButton.append(_name)

      //var _player = LB.Widgets.Player(_players[player], actions, slotWidget).render()
      //_createdWidget.append(_player)

      _playerButton.on('click', function(){
        if(document.querySelector(".map").style.display == 'none'){
          var selected = document.querySelector(".map_selected")
          selected.style.display = 'none'
          selected.classList.remove("map_selected");
          _player.addClass('map_selected')
          _player.show()
        }else{
          _player.addClass('map_selected')
        }
      })

      _selectPlayer.append(_playerButton)
    })

    var locationsInfo = stats.personal_info.locations
    if(locationsInfo)
      var emptyLocations = Object.keys(locationsInfo)

    stats.locations.forEach(function(location){

      if(emptyLocations)
        location.empty = emptyLocations.includes(location.uuid)

      var _room = ns.Widgets.Room(location, actions, slotWidget).render()
      actionSelector.append(_room)

      var _locationButton = ns.Widgets.Button(ns.t.text('locations.' + location.uuid), function(){
        $(".targetSelector").animateCss("fadeOutRight", function(){
          actionSelector.css('display', 'block');
          _room.css('display', 'block');
          $(".targetSelector").css('display', 'none');
          actionSelector.addClass("animated fadeInRight");
        });
      })

      _selectRoom.append(_locationButton.render())
    })

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.LockedRoom = function(location, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-12')
    var _background = $(crel('div')).addClass('room locked col-12')


    var addActionButton = function(action){
      var action = actions[action];
      var currentActionLabel = action.label;
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(location, slotWidget)
      }).render()

      _background.append(_actionButton)
    }

    addActionButton('unlock')

    _createdWidget.append(_background)
    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Room = function(location, actions, slotWidget){
    if(location.status == 'locked')
      return LB.Widgets.LockedRoom(location, actions, slotWidget)

    var _createdWidget = $(crel('div'))
    var _background = $(crel('div')).addClass('room uuid'+ location.uuid + ' col-12')
    _createdWidget.append(_background)

    if(location.status == 'marked'){
      var _ia = $(crel('div')).addClass('ia')
      _createdWidget.append(_ia)
    }

    var addActionButton = function(action){
      var action = actions[action];
      var currentActionLabel = action.label;
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(location, slotWidget)
      }).render()

      _createdWidget.append(_actionButton)
    }

    if(!location.empty)
      addActionButton('search')

    if(location.status != 'hacked')
      addActionButton('hack')

    if(location.uuid == 7){
      addActionButton('oxygen')
    }

    if(location.uuid == 8){
      addActionButton('work')
      addActionButton('escape')
    }

    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Player = function(player, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-12')
    var _background = $(crel('div')).addClass('room col-12')

    var addActionButton = function(action){
      var action = actions[action];
      var currentActionLabel = action.label;
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(player.uuid, slotWidget)
      }).render()

      _background.append(_actionButton)
    }

    var _name = $(crel('div')).addClass('name').text(player.name)
    _background.append(_name)
    addActionButton('share')

    if(player.uuid == LB.playerUuid()){
      addActionButton('defend')
    }else{
      addActionButton('spy')
      addActionButton('steal')
    }

    _createdWidget.append(_background)
    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(LB || {}))
