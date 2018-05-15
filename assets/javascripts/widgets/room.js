'use strict';
(function(ns){

  ns.Widgets.LockedRoom = function(location, actions, slotWidget){
    var _createdWidget = $(crel('div'))

    var _roomName = $(crel('div')).addClass('text-center')
    var _roomNameLabel = $(crel('h4')).html(ns.t.text('locations.' + location.uuid))
    var _lockedInfo = $(crel('div'))
    var _lockedLabel = $(crel('span')).text('Esta habitación está bloqueada.')
    _roomName.append(_roomNameLabel)
    _lockedInfo.append(_lockedLabel)

    var _background = $(crel('div')).addClass('room-img');
    var _backgroundImg = $(crel('img')).addClass('img-responsive')
    _backgroundImg.attr('src', '/images/locked.jpg')
    _background.append(_backgroundImg)
    _createdWidget.append(_background)

    _createdWidget.append(_roomName, _lockedInfo)
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

  ns.Widgets.Room = function(location, actions, slotWidget, player){
    if(location.status == 'locked')
      return LB.Widgets.LockedRoom(location, actions, slotWidget)

    console.log()

    var _createdWidget = $(crel('div'))
    var _roomName = $(crel('div')).addClass('text-center')
    var _roomNameLabel = $(crel('h4')).html(ns.t.text('locations.' + location.uuid))
    _roomName.append(_roomNameLabel)
    _createdWidget.append(_roomName)

    var _background = $(crel('div')).addClass('room-img');
    var _backgroundImg = $(crel('img')).addClass('img-responsive')
    _backgroundImg.attr('src', '/images/room' + location.uuid + '.jpg')
    _background.append(_backgroundImg)
    _createdWidget.append(_background)

    if(location.status == 'marked'){
      var _ia = $(crel('div')).addClass('ia')
      _background.append(_ia)
    }

    var addActionButton = function(action, resource){
      var action = actions[action];
      var currentActionLabel = action.label(resource);
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(location, slotWidget, resource)
      }, 12).render()

      _createdWidget.append(_actionButton)
    }

    if(!location.empty)
      addActionButton('search')

    // if(location.status != 'hacked')
    //   addActionButton('hack')

    if(location.uuid == 6 && player.traits.includes('gunsmith')){
      addActionButton('craft', 'gun')
    }

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
