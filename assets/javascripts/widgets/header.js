'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Header = function(stats){
    var _createdWidget = $(crel('div')).addClass('header')

    var _info = $(crel('div')).addClass('info')
    _createdWidget.append(_info)

    var _personal = $(crel('div')).addClass('personal')
    var siblings = Object.keys(stats['personal']).map(function(subStat){
      var _subStat = $(crel('span')).addClass('value').text(stats['personal'][subStat])
      if (subStat == 'food')
        _subStat = $(crel('span')).addClass('value').text(stats['personal'][subStat] + " / 2")

      return $(crel('div')).addClass('stat ' + subStat).append(
        $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join(subStat))),
        _subStat
      )
    })

    _personal.append(siblings)
    _info.append(_personal)

    var _team = $(crel('div')).addClass('team').append(
      $(crel('div')).addClass('avatar').append(ns.t.html(':team:')))
    !['status', 'team'].forEach(function(stat){
      var siblings = Object.keys(stats[stat]).map(function(subStat){
        return $(crel('div')).addClass('stat ' + subStat).append(
          $(crel('span')).addClass('_label').html(ns.t.html([':', ':'].join(subStat))),
          $(crel('span')).addClass('value').text(stats[stat][subStat])
        )
      })
      _team.append(siblings)
      _info.append(_team)
    })

    return {
      render: function(){
        return _createdWidget
      }
    }
  };

  ns.Widgets.EmptyLocationsInfo = function(provider){
    var _createdWidget = $(crel('div')).addClass('col-xs-12')
    if (!provider)
      _createdWidget.append('You don\'t know of any')
    else
      Object.keys(provider).map(function(locationName){
        var _infoLine = $(crel('div')).addClass('row')
        var _locationName = $(crel('span')).addClass('col-xs-4').text(locationName + ':')

        var _slot = provider[locationName]
        var _day = Math.floor(_slot / 7) + 1
        var _daySlot = ns.SLOTS[(_slot % 7) - 1]
        var _dateText = 'since day ' + _day + ', ' + _daySlot.label

        var _emptySince = $(crel('span')).addClass('col-xs-4').html(ns.t.html(_dateText))

        _infoLine.append(
          _locationName,
          _emptySince
        )

        _createdWidget.append(_infoLine)
      })

    return {
      render: function(){
        bootbox.alert({
          title: 'Empty locations you are aware:',
          message: $(crel('div')).addClass('row').append(_createdWidget)
        })
      }
    }
  }

}(LB || {}));
