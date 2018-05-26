'use strict';
(function(ns){

  ns.Widgets.LockedRoom = function(location, location_uuid, actions, slotWidget){
    var _createdWidget = $(crel('div'))

    var _roomName = $(crel('div')).addClass('text-center')
    var _roomNameLabel = $(crel('h4')).html(ns.t.text('locations.' + location_uuid))
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

    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Room = function(locations, location_uuid, actions, slotWidget, player){
    var location = locations[location_uuid];

    if(location.status == 'locked')
      return LB.Widgets.LockedRoom(location, location_uuid, actions, slotWidget)

    var _createdWidget = $(crel('div'))
    var _roomName = $(crel('div')).addClass('text-center')
    var _roomNameLabel = $(crel('h4')).html(ns.t.text('locations.' + location_uuid))
    _roomName.append(_roomNameLabel)
    _createdWidget.append(_roomName)

    var _background = $(crel('div')).addClass('room-img');
    var _backgroundImg = $(crel('img')).addClass('img-responsive')
    _backgroundImg.attr('src', '/images/room' + location_uuid + '.jpg')
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
        action.run(location_uuid, slotWidget, resource)
      }, 12).render()

      _createdWidget.append(_actionButton)
    }

    if(!location.empty)
      addActionButton('search')

    // if(location.status != 'hacked')
    //   addActionButton('hack')

    if(location_uuid == 1){
      ['2', '4', '6', '8'].forEach(function(locked_room){
        if(locations[locked_room].status == 'locked')
          addActionButton('unlock', locked_room);
      });
    }

    if(location_uuid == 4 && player.traits.includes('murderer')){
      addActionButton('brainscan', player.target)
    }

    if(location_uuid == 6 && player.traits.includes('gunsmith')){
      addActionButton('craft', 'gun')
    }

    if(location_uuid == 7){
      addActionButton('oxygen')
    }

    if(location_uuid == 8){
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
