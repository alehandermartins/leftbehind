'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.DayPlanning = function(slots, actions){
    var _createdWidget = $(crel('div')).addClass('day_planning');
    var _slots = {};
    var _currentSlot = '';
    var _selectedActions = {};

    slots.forEach(function(slot){
      _slots[slot.name] = ns.Widgets.TimeSlot(slot, '', function(slot){
        $(".dayPlanner").animateCss("fadeOutRight", function(){
          $(".targetSelector").css('display', 'block');
          $(".dayPlanner").css('display', 'none');
          $(".targetSelector").animateCss("fadeInRight");
        });
        _selectSlot(slot);
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
      $(".actionSelector").animateCss("fadeOutRight", function(){
        $(".dayPlanner").css('display', 'block');
        $(".actionSelector").css('display', 'none');
        $(".selected-room").css('display', 'none');
        $(".selected-room").removeClass('selected-room');
        $(".dayPlanner").animateCss("fadeInRight");
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
      render: function(){
        return _createdWidget;
      },
      selectActionForCurrentSlot: _selectActionForCurrentSlot,
      getSelections: _getSelections,
      getCurrentSlot: _getCurrentSlot
    };
  };

}(LB || {}));
