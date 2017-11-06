'use strict';
(function(ns){

	ns.Widgets = ns.Widgets || {}

	ns.Widgets.MoveLabel = function(){

    var movingTime = 1000
    var status = 'iddle'
    var label, map, moveAction, endmoveAction, elapsedTime, startTime, selection
   
    function moveItRight(){
    	label.style.right = map.offsetWidth - 10 - elapsedTime / movingTime * (map.offsetWidth - 20) + 'px'
      map.style.right =  - elapsedTime / movingTime * (map.offsetWidth - 20) + 'px'
    }

    function endMoveRight(){
    	label.style.right =  '2.5%'
      map.style.display = 'none'
      selection.style.display = 'block'
    }

    function moveItLeft(){
    	label.style.right = - 10 + elapsedTime / movingTime * (map.offsetWidth - 20) + 'px'
      map.style.right = - map.offsetWidth + elapsedTime / movingTime * (map.offsetWidth - 20) + 'px'
    }

    function endMoveLeft(){
    	label.style.display = 'none'
      map.style.right = 0
      selection.classList.remove("map_selected")
    }

    function move(){
    	var currentTime = new Date().getTime()
      elapsedTime = currentTime - startTime
    	if (elapsedTime < movingTime){
    		moveAction()
        setTimeout(function(){ move() }, 20)
      }else{
      	endmoveAction()
        status = 'iddle'
      }
    }

    return {
      moveRight: function(){
        if(status == 'running')
          return

        status = 'running'
        label = document.querySelector(".mapLabel")
        map = document.querySelector(".map")
        startTime = new Date().getTime()
        selection = document.querySelector(".map_selected")
        label.style.display = 'block'
        moveAction = moveItRight
        endmoveAction = endMoveRight
        move()
      },
      moveLeft: function(){
        if(status == 'running')
          return

        status = 'running'
        label = document.querySelector(".mapLabel")
        map = document.querySelector(".map")
        startTime = new Date().getTime()
        selection = document.querySelector(".map_selected")
        selection.style.display = 'none'
        map.style.display = 'block'
        moveAction = moveItLeft
        endmoveAction = endMoveLeft
        move()
      }
    }
  }

 ns.Widgets.ActionSelector = function(slotWidget, stats){
    var actions = LB.Actions(stats)
    var _container = $('.game_container')
    var _statusbar = $(crel('div')).addClass('statusbar')
    _container.append(_statusbar)
    var _createdWidgetRow = $(crel('div')).addClass('row')

    var _mapLabel = $(crel('div')).addClass('mapLabel').css('display', 'none')
    var _createdWidget = $(crel('div')).addClass('map col-xs-12').css('display', 'block')

    var moveLabel = LB.Widgets.MoveLabel()
    _mapLabel.on('click', function(){
      moveLabel.moveLeft()
    })

    var _players = stats.players

    var contributions = function(player){
      var _contributions = $(crel('div')).addClass('contributions')

      var siblings = Object.keys(_players[player].shared_inventory).map(function(subStat){
        return $(crel('span')).addClass('resource').append(
          _players[player].shared_inventory[subStat],
          ns.t.html([':', ':'].join(subStat))
        );
      });
      _contributions.append(siblings)
      return _contributions
    }

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

      _playerButton.append(_wrapper)
      _playerButton.append(contributions(player))
      _playerButton.append(_name)

      var _player = LB.Widgets.Player(_players[player], actions, slotWidget).render()
      _createdWidgetRow.append(_player)

      _playerButton.on('click', function(){
        if(document.querySelector(".map").style.display == 'none'){
          var selected = document.querySelector(".map_selected")
          selected.style.display = 'none'
          selected.classList.remove("map_selected");
          _player.addClass('map_selected')
          _player.show()
        }else{
          _player.addClass('map_selected')
          moveLabel.moveRight()
        }
      })

      _statusbar.append(_playerButton)
    })

    var locationsInfo = stats.personal_info.locations
    if(locationsInfo)
      var emptyLocations = Object.keys(locationsInfo)

    stats.locations.forEach(function(location){

      if(emptyLocations)
        location.empty = emptyLocations.includes(location.uuid)

      var _room = ns.Widgets.Room(location, actions, slotWidget).render()
      _createdWidgetRow.append(_room)

      var _locationButton = ns.Widgets.Button(ns.t.text('locations.' + location.uuid), function(){
        _room.addClass('map_selected')
        moveLabel.moveRight()
      })

      _createdWidget.append(_locationButton.render())
    })

    _createdWidgetRow.append(_mapLabel, _createdWidget)

    return {
      render: function(){
        return _createdWidgetRow;
      }
    }
  }

  ns.Widgets.LockedRoom = function(location, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-xs-12')
    var _background = $(crel('div')).addClass('room locked col-xs-12')


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

    var _createdWidget = $(crel('div')).addClass('col-xs-12')
    var _background = $(crel('div')).addClass('room uuid'+ location.uuid + ' col-xs-12')
    
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

      _background.append(_actionButton)
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

    _createdWidget.append(_background)
    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Player = function(player, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-xs-12')
    var _background = $(crel('div')).addClass('room col-xs-12')

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
