'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.DayPlanning = function(slots, actions){
    var _createdWidgetRow = $(crel('div')).addClass('row');
    var _createdWidget = $(crel('div')).addClass('day_planning col-12');
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

}(LB || {}));
