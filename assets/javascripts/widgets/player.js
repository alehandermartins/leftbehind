'use strict';
(function(ns){

	ns.Widgets.Player = function(player, actions, slotWidget, size){
    var _createdWidget = $(crel('div')).addClass('col-12')
    var _playerAvatar = LB.Widgets.PlayerAvatar(player, size).render()

    _createdWidget.append(_playerAvatar)

    var addActionButton = function(action, resource){
      var action = actions[action];
      var currentActionLabel = action.label(resource);
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(player.uuid, slotWidget, resource)
      }, 12).render()

      _createdWidget.append(_actionButton)
    }

    if(player.condition == 'broken'){
      if(player.uuid != LB.playerUuid()){
        if(player.traits.includes('c3po')){
          addActionButton('hackandroid', player.uuid)
          addActionButton('disconnectandroid')
        }
      }
      else{
        if(player.traits.includes('c3po') || player.traits.includes('terminator'))
          addActionButton('hackandroid', player.uuid)
          addActionButton('defend')
      }
    }

    if(player.uuid != LB.playerUuid()){
      addActionButton('share', 'food')
      addActionButton('share', 'helmet')
      addActionButton('steal')
      addActionButton('spy')
      addActionButton('defend')
    }

    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PlayerAvatar = function(player, size){
    size = size || 4
    var _playerAvatar = $(crel('div')).addClass('player text-center col-' + size)
    var _wrapper = $(crel('div')).addClass('avatarWrapper')
    var _avatar = $(crel('div')).addClass('avatar')
    var _name = $(crel('div')).addClass('name').text(player.name)
    var _status = 'lagging'
    var _role = player.role

    if (['dead', 'crashed', 'trapped', 'exploded', 'radiated'].includes(player.status))
      _status = 'wont-play'

    _avatar.addClass(_status)
    _avatar.addClass(_role)
    _avatar.addClass(player)

    _wrapper.append(_avatar)

    _playerAvatar.append(_wrapper)
    _playerAvatar.append(_name)

    return {
      render: function(){
        return _playerAvatar;
      }
    }
  }

  ns.Widgets.PlayerAvatarXS = function(player){
    var _wrapper = $(crel('div')).addClass('avatarWrapper avatar-xs')
    var _avatar = $(crel('div')).addClass('avatar')
    var _status = 'lagging'
    var _role = player.role

    if (['dead', 'crashed', 'trapped', 'exploded', 'radiated'].includes(player.status))
      _status = 'wont-play'

    _avatar.addClass(_status)
    _avatar.addClass(_role)
    _avatar.addClass(player)

    _wrapper.append(_avatar)

    return {
      render: function(){
        return _wrapper;
      }
    }
  }


}(LB || {}))
