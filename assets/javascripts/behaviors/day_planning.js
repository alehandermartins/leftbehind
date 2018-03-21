'use strict';
(function(ns){

  ns.DayPlanning = function(stats){
    var slots = LB.SLOTS;
    var actions = LB.Actions(stats);

    var _createdWidget = $(crel('div')).addClass('dayPlanner col-10');
    var _slotSelector = $(crel('div')).addClass('slotSelector active');
    var _targetSelector = $(crel('div')).addClass('targetSelector');
    var _actionSelector = $(crel('div')).addClass('actionSelector');

    _createdWidget.append(
      _slotSelector,
      _targetSelector,
      _actionSelector
    );

    if(stats.current_slot == 0)
      _createdWidget.addClass('active');

    var slotWidget = function(){
      var _tutotial = $(crel('div')).addClass('col-12 text-center');
      _tutotial.text('Puedes realizar 4 acciones durante la siguiente hora. Cuando hayas escogido pulsa "Enviar"');
      _slotSelector.append(_tutotial);

      var _slots = {};
      var _currentSlot;
      var _selectedActions = {};

      slots.forEach(function(slot){
        _slots[slot.name] = ns.Widgets.TimeSlot(slot, '', function(slot){
         _slotSelector.animateCss("fadeOutRight", function(){
            _slotSelector.removeClass('active');
            _targetSelector.addClass('active');
            _targetSelector.animateCss("fadeInRight");
          });
          _selectSlot(slot);
        }, 12 );

        _slotSelector.append( _slots[slot.name].render() );
      });

      var _selectSlot = function(slot){
        _currentSlot = slot;
        _slots[_currentSlot].check();
        $('.slotTargetInfo').html(ns.t.html(_slots[_currentSlot].label()) + ' Selecciona un objetivo:' );
        $('.slotActionInfo').html(ns.t.html(_slots[_currentSlot].label()) + ' Selecciona una acción:' );
        if(Object.keys(_selectedActions).length == 4)
          _sendActionsButtonWidget.enable();
      };

      var _selectActionForCurrentSlot = function(action){
        _slots[_currentSlot].setSelectedAction(actions[action.name].buildLabel(action.payload));
        _selectedActions[_currentSlot] = action;
        _next();
        _actionSelector.animateCss("fadeOutRight", function(){
          _actionSelector.removeClass('active');
          _slotSelector.addClass('active');
          $(".selected-room").css('display', 'none');
          $(".selected-room").removeClass('selected-room');
          _slotSelector.animateCss("fadeInRight");
        });
      };

      var _getSelections = function(callback){
        callback(_selectedActions);
      };

      var _getCurrentSlot = function(){
        return _currentSlot;
      };

      var _next = function(){
        var _slotIds = Object.keys(_slots);
        var _currentSlotNumber = _slotIds.indexOf(_currentSlot);
        _currentSlotNumber ++;
        _currentSlotNumber %= _slotIds.length;
        _currentSlot = _slotIds[_currentSlotNumber];
        _selectSlot(_currentSlot);
      };

      _next();

      return {
        selectActionForCurrentSlot: _selectActionForCurrentSlot,
        getSelections: _getSelections,
        getCurrentSlot: _getCurrentSlot
      };
    }

    var targetWidget = function(){
      var _targetSelectorNav = $(crel('div')).addClass('row slotInfo');
      var _slotInfo = $(crel('div')).addClass('col-8');
      var _slotLabel = $(crel('span')).addClass('slotTargetInfo');

      _slotInfo.append(_slotLabel);
      _slotInfo.css('text-align','left');

      var _back = $(crel('div')).addClass('col-4');
      var _backLabel = $(crel('span')).text('Back ');
      var _arrow = $(crel('i')).addClass('fa fa-arrow-right');
      _backLabel.append(_arrow);
      _back.append(_backLabel);

      _targetSelectorNav.append(
        _slotInfo,
        _back
      );
      _back.css('text-align','right');
      _backLabel.css('cursor', 'pointer');

      _targetSelector.append(_targetSelectorNav);

      _backLabel.click(function(){
        _targetSelector.animateCss("fadeOutRight", function(){
          _targetSelector.removeClass('active');
          _slotSelector.addClass('active');
          _slotSelector.animateCss("fadeInRight");
        });
      });

      var _players = stats.players;
      if(Object.keys(_players).length > 1){

        var _selectPlayer = $(crel('div')).addClass('row text-center')
        var _selectPlayerLabel = $(crel('h5')).addClass('col-12').text('Tripulación')
        _selectPlayer.append(_selectPlayerLabel)
        _targetSelector.append(_selectPlayer)

        var _reorderedPlayers = Object.keys(_players).sort(function(a, b){
          var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

          if (a == ns.playerUuid())
            return -1

          if (b == ns.playerUuid())
            return 1

          return rolesOrder.indexOf(_players[a].role) - rolesOrder.indexOf(_players[b].role)

        });
        _reorderedPlayers.shift();
        _reorderedPlayers.forEach(function(player){
          _players[player].uuid = player;
          var _playerAvatar = LB.Widgets.PlayerAvatar(_players[player]).render();

          var _player = LB.Widgets.Player(_players[player], actions, _slotWidget).render();
          _actionSelector.append(_player);

          _playerAvatar.on('click', function(){
            _targetSelector.animateCss("fadeOutRight", function(){
              _targetSelector.removeClass('active');
              _actionSelector.addClass('active');
              _player.addClass('selected-room');
              _player.css('display', 'block');
              _actionSelector.animateCss("fadeInRight");
            });
          });

          _selectPlayer.append(_playerAvatar);
        })
      }

      var _selectRoom = $(crel('div')).addClass('row text-center');
      var _selectRoomLabel = $(crel('h5')).addClass('col-12').text('Habitaciones');

      _selectRoom.append(_selectRoomLabel);
      _targetSelector.append(_selectRoom);


      var locationsInfo = stats.personal_info.locations
      if(locationsInfo)
        var emptyLocations = Object.keys(locationsInfo)

      stats.locations.forEach(function(location){

        if(emptyLocations)
          location.empty = emptyLocations.includes(location.uuid)

        var _room = ns.Widgets.Room(location, actions, _slotWidget).render()
        _actionSelector.append(_room)

        var _locationButton = ns.Widgets.Button(ns.t.text('locations.' + location.uuid), function(){
          _targetSelector.animateCss("fadeOutRight", function(){
            _targetSelector.removeClass('active');
            _actionSelector.addClass('active');
            _room.addClass('selected-room');
            _room.css('display', 'block');
            _actionSelector.animateCss("fadeInRight");
          });
        })

        _selectRoom.append(_locationButton.render())
      })
    }

    var actionWidget = function(){
      var _actionSelectorNav = $(crel('div')).addClass('row slotInfo');
      var _slotInfo = $(crel('div')).addClass('col-8');
      var _slotLabel = $(crel('span')).addClass('slotActionInfo');

      _slotInfo.append(_slotLabel);
      _slotInfo.css('text-align','left');

      var _back = $(crel('div')).addClass('col-4');

      var _backLabel = $(crel('span')).text('Back ');
      var _arrow = $(crel('i')).addClass('fa fa-arrow-right');
      _backLabel.append(_arrow);
      _back.append(_backLabel);

      _actionSelectorNav.append(
        _slotInfo,
        _back
      );
      _back.css('text-align','right');
      _backLabel.css('cursor', 'pointer');

      _actionSelector.append(_actionSelectorNav);

      _backLabel.click(function(){
        _actionSelector.animateCss("fadeOutRight", function(){
          _actionSelector.removeClass('active');
          $(".selected-room").css('display', 'none');
          $(".selected-room").removeClass('selected-room');
          _targetSelector.addClass('active');
          _targetSelector.animateCss("fadeInRight");
        });
      });
    }

    var _slotWidget = slotWidget();
    var _sendActionsButtonWidget = LB.Widgets.SendActionsButton(_slotWidget);
    _sendActionsButtonWidget.disable();
    _slotSelector.append(_sendActionsButtonWidget.render());

    actionWidget();
    targetWidget();

    return {
      render: function(){
        return _createdWidget
      }
    }
  }

  ns.Widgets.TimeSlot = function(slot, selected_action, callback, size){
    selected_action = selected_action || " Escoge una acción";
    size = size || 12;
    var createdId = 'ts-' + slot.name;
    var _createdWidgetRow = $(crel('div')).addClass('row');
    var _createdWidget = $(crel('div')).addClass('col-' + size).addClass('time_slot');
    var _createdWidgetRadio = $(crel('input')).attr('type', 'radio').attr('name', 'xxx').attr('id', createdId);
    var _createdWidgetLabel = $(crel('label')).attr('for', createdId).addClass('col-12 btn-default btn-xs btn').html(ns.t.html(slot.label) + ns.t.html(selected_action));
    _createdWidgetRadio.click(function(e){
      callback(slot.name);
    });

    _createdWidget.append(_createdWidgetRadio);
    _createdWidget.append(_createdWidgetLabel);

    _createdWidgetRow.append(_createdWidget);

    return {
      render: function(){
        return _createdWidgetRow;
      },
      setSelectedAction: function(value){
        _createdWidgetLabel.html(ns.t.html(slot.label) + " " + ns.t.html(value));
      },
      check: function(){
        _createdWidgetRadio.prop('checked', true);
      },
      label: function(){
        return slot.label;
      }
    }
  }

}(LB || {}));
