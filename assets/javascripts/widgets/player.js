'use strict';
(function(ns){

	ns.Widgets.Player = function(player, actions, slotWidget){
    var _createdWidget = $(crel('div')).addClass('col-12')
    var _playerAvatar = LB.Widgets.PlayerAvatar(player).render()

    _createdWidget.append(_playerAvatar)

    var addActionButton = function(action, resource){
      var action = actions[action];
      var currentActionLabel = action.label(resource);
      var _actionButton = ns.Widgets.Button(currentActionLabel, function(){
        action.run(player.uuid, slotWidget, resource)
      }, 12).render()

      _createdWidget.append(_actionButton)
    }

    addActionButton('share', 'food')
    addActionButton('share', 'helmet')
    addActionButton('steal')
    addActionButton('spy')
    addActionButton('defend')

    _createdWidget.hide()

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PlayerAvatar = function(player){
    var _playerAvatar = $(crel('div')).addClass('player text-center col-4')
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