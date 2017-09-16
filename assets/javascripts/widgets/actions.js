'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.DayPlanning = function(slots, actions){
    var _createdWidgetRow = $(crel('div')).addClass('row');
    var _createdWidget = $(crel('div')).addClass('day_planning col-xs-12');
    var _slots = {};
    var _currentSlot = '';
    var _selectedActions = {};

    slots.forEach(function(slot){
      _slots[slot.name] = ns.Widgets.TimeSlot(slot, '', function(slot){
        _selectSlot(slot);
        console.log(slot);
      }, 12 );

      _createdWidget.append( _slots[slot.name].render() );
    });

    var _selectSlot = function(slot){
      _currentSlot = slot;
      _slots[_currentSlot].check();
    };

    var _selectActionForCurrentSlot = function(action){
      _slots[_currentSlot].setSelectedAction(actions[action.name].buildLabel(action.payload));
      _selectedActions[_currentSlot] = action;
      _next();
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

    _createdWidgetRow.append(_createdWidget);

    _next();

    return {
      render: function(){
        return _createdWidgetRow;
      },
      selectActionForCurrentSlot: _selectActionForCurrentSlot,
      getSelections: _getSelections,
      getCurrentSlot: _getCurrentSlot
    };
  };

  // ns.Widgets.ActionSelector = function(actions, slotWidget, stats){
  //   var _createdWidgetRow = $(crel('div')).addClass('row');
  //   var _createdWidget = $(crel('div')).addClass('action_selector col-xs-12');

  //   var lockStolenPlayers = function(callback){
  //     slotWidget.getSelections(function(selections){
  //       ns.Backend.teamMates(function(teamMates){

  //         var otherStealSlots = Object.keys(selections).filter(function(slot){
  //           var isCurrent = slot == slotWidget.getCurrentSlot()
  //           var isSteal = selections[slot].name == 'steal'

  //           return (!isCurrent && isSteal)
  //         })

  //         teamMates.forEach(function(mate){
  //           var targetAlreadySelected = otherStealSlots.some(function(slot){
  //             return selections[slot].payload.target == mate.uuid
  //           })

  //           mate['status'] = 'unlocked'

  //           if (!targetAlreadySelected)
  //             return

  //           mate['status'] = 'locked'
  //         })
  //       });

  //       callback()
  //     });
  //   }

  //   var unlockPlayers = function(callback){
  //     ns.Backend.teamMates(function(teamMates){
  //       teamMates.forEach(function(mate){
  //         mate['status'] = 'unlocked'
  //       })

  //       callback()
  //     })
  //   }

  //   var lockEmptyRooms = function(callback){
  //     if (!stats.personal_info.locations) {
  //       callback()
  //       return
  //     }

  //     ns.Backend.availableLocations(function(locations){
  //       locations.forEach(function(location){
  //         if (Object.keys(stats.personal_info.locations).includes(location.uuid))
  //           location.status = 'locked'
  //       })

  //       callback()
  //     })
  //   }

  //   Object.keys(actions).forEach(function (currentActionId) {
  //     var action = actions[currentActionId];
  //     var _builtAction = {};

  //       var currentActionLabel = action.label;
  //       _createdWidget.append(ns.Widgets.Button(currentActionLabel, function(){
  //         var _actionMenu = function(){

  //           if (currentActionId == 'search'){
  //             lockEmptyRooms(_modalpopup)
  //             return
  //           }

  //           if (currentActionId == 'steal'){
  //             lockStolenPlayers(_modalpopup)
  //             returncreatedrow
  //           }

  //           unlockPlayers(_modalpopup)
  //         };

  //         var _modalpopup = function(){
  //           if (action.list){
  //             ns.Widgets.ModalTargetSelector(action.list, action.modalTitle).select(function(selection){
  //               selection = selection[0];
  //               if (action.secondList){
  //                 ns.Widgets.ModalTargetSelector(action.secondList, action.secondModalTitle).select(function(secondSelection){
  //                   var secondSelection = secondSelection[0];
  //                   var _builtAction = action.buildAction(selection, secondSelection);
  //                   slotWidget.selectActionForCurrentSlot(_builtAction);
  //                 });
  //               } else {
  //                 _builtAction = action.buildAction(selection);
  //                 slotWidget.selectActionForCurrentSlot(_builtAction);
  //               }
  //             });
  //           } else {
  //             console.log(action)
  //             _builtAction = action.buildAction()
  //             console.log( _builtAction );
  //             slotWidget.selectActionForCurrentSlot(_builtAction);
  //           }
  //         };

  //         ns.Widgets.ActionTutorial(currentActionId, _actionMenu).render()

  //       }).render());
  //   });

  //   _createdWidgetRow.append(_createdWidget);

  //   return {
  //     render: function(){
  //       return _createdWidgetRow;
  //     }
  //   }
  // };
}(LB || {}));
