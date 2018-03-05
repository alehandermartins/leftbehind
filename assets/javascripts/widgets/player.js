'use strict';
(function(ns){

	ns.Widgets.Player = function(player, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-12')
    var _background = $(crel('div')).addClass('room col-12')

    var addActionButton = function(action){
      var action = actions[action];
      var currentActionLabel = action.label;
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(player.uuid, slotWidget)
      }, 12).render()

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

  ns.Widgets.PlayerAvatar = function(player){
    var _playerAvatar = $(crel('div')).addClass('player col-4')
    var _wrapper = $(crel('div')).addClass('avatarWrapper')
    var _avatar = $(crel('div')).addClass('avatar')
    var _name = $(crel('div')).addClass('name').text(player.name)
    var _status = 'lagging'
    var _role =player.role

    if (['dead', 'crashed', 'trapped', 'exploded', 'radiated'].includes(player.status))
      _status = 'wont-play'
    else
      if (player.stage == 'wait' || player.status == 'escaped')
        _status = 'ahead';

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

}(LB || {}))