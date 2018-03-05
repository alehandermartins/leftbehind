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
      var _playerAvatar = LB.Widgets.PlayerAvatar(_players[player]).render();

      var _player = LB.Widgets.Player(_players[player], actions, slotWidget).render()
      actionSelector.append(_player)

      _playerAvatar.on('click', function(){
        $(".targetSelector").animateCss("fadeOutRight", function(){
          $(".targetSelector").removeClass('active');
          actionSelector.addClass('active');
          actionSelector.css('display', 'block');
          _player.addClass('selected-room');
          _player.css('display', 'block');
          $(".targetSelector").css('display', 'none');
          actionSelector.animateCss("fadeInRight");
        });
      })

      _selectPlayer.append(_playerAvatar)
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
          $(".targetSelector").removeClass('active');
          actionSelector.addClass('active');
          actionSelector.css('display', 'block');
          _room.addClass('selected-room');
          _room.css('display', 'block');
          $(".targetSelector").css('display', 'none');
          actionSelector.animateCss("fadeInRight");
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
    _createdWidget.append(_background)

    var addActionButton = function(action){
      var action = actions[action];
      var currentActionLabel = action.label();
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(location, slotWidget)
      }, 12).render()

      _createdWidget.append(_actionButton)
    }

    addActionButton('unlock')

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
      var currentActionLabel = action.label();
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(location, slotWidget)
      }, 12).render()

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
}(LB || {}))
