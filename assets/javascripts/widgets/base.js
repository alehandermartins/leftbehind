'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Label = function(type, value, size){
    size = size || 3;
    var _createdWidget = $(crel('div')).addClass('col-' + size)//.addClass(type);
    var _createdWidgetLabel = $(crel('span')).addClass('_label').html(ns.t.html(type));
    var _createdWidgetValue = $(crel('span')).addClass('value').text(value);

    _createdWidget.append(_createdWidgetLabel);
    _createdWidget.append(_createdWidgetValue);

    return {
      render: function(){
        return _createdWidget;
      },
      setValue: function(value){
        _createdWidgetValue.text(value);
      }
    };
  };

  ns.Widgets.TargetSelector = function(origin, amount, callback){
    amount = amount || 1;
    callback = callback || function(){};
    var _generatedContent = $(crel('div')).addClass('row');
    var _selectedTargets = [];
    var _selectedElements = [];
    var _generatedButtons = [];

    var createContent = function(targets){
      var size = 12;
      if (targets.length > 3)
        size = 6;
      targets.forEach(function(target){
        var _generatedButton = ns.Widgets.Button(target.label || target.name, function(){
          if (_selectedTargets.indexOf(target) >= 0)
            return;

          if (_selectedTargets.length == amount){
            var first = _selectedElements.shift();
            $(first).removeClass('btn-primary');
            _selectedTargets.shift();
          }
          $(this).addClass('btn-primary');
          _selectedTargets.push(target);
          _selectedElements.push($(this));
          callback(_selectedTargets);
        }, size).render();

        if (target.status == 'locked') {
          _generatedButton.attr('disabled', true);
          var _iconLock = $(crel('span')).addClass('glyphicon glyphicon-lock');
          _iconLock.css({'padding-left':'5px'});
          _generatedButton.append(_iconLock);
        }

        _generatedButtons.push(_generatedButton);
      });
      _generatedContent.append(_generatedButtons);

      if (targets.length === 1){
        if (targets[0].status != 'locked')
          $(_generatedButtons[0]).click();
      }
    };

    if (typeof origin === 'function'){
      origin(createContent);
    }else
      createContent(origin);

    return {
      render: function(){
        return _generatedContent;
      },
      selected: function(){
        return _selectedTargets;
      }
    };
  };

  ns.Widgets.ModalTargetSelector = function(origin, label, amount){
    amount = amount || 1;
    var mts = ns.Widgets.TargetSelector(origin, amount);
    return {
      select: function(callback){
        bootbox.confirm({
          title: (label || 'A though decision...').capitalize(true),
          message: mts.render(),
          callback: function(confirmed){
            var _selectedTargets = mts.selected();
            if (_selectedTargets.length != amount && confirmed)
              return false;
            else if (confirmed){
              callback(_selectedTargets);
            }
          },
        });
      }
    };
  };

  ns.Widgets.Results = function(stats){
    var _createdWidget = $(crel('div')).addClass('results col-12');

    if(stats.current_slot != 0 && stats.player_status === 'alive' && stats.day_status != 'wait')
      _createdWidget.addClass('active');

    var getLastSlot = function(){
      var maxSlots = Object.keys(stats.players).map(function(player){
        if(!stats.personal_info[player])
          return 0;
        return Math.max.apply(null, Object.keys(stats.personal_info[player]));
      });

      return Math.max.apply(null, maxSlots);
    }

    var personalInfo = stats.personal_info;
    var lastSlot = getLastSlot();
    var lastDaySlots = lastSlot % 6;

    if(lastDaySlots == 0)
      lastDaySlots = 2;

    if(lastDaySlots == 5)
      lastDaySlots = 1;

    var slots = [];
    var _infos = [];

    for (var i = lastSlot - lastDaySlots; i < lastSlot; i++){
      slots.push(i + 1);
    }

    var _displayActions = function(actions){
      slots.forEach(function(slot){
        var _personalInfos = [];

        Object.keys(stats.players).sort(function(a, b){
          var rolesOrder = ['captain', 'pilot', 'mechanic', 'scientist']

          if (a == ns.playerUuid())
            return -1

          if (b == ns.playerUuid())
            return 1

          return rolesOrder.indexOf(stats.players[a].role) - rolesOrder.indexOf(stats.players[b].role)
        }).forEach(function(player){
          if(personalInfo[player] && personalInfo[player][slot]){
            var split = personalInfo[player][slot].action.split(':');
            var name = split[4].toLowerCase();
            var action = actions[name];
            var result = personalInfo[player][slot].result;

            result['performer'] = player;
            result['payload'] = personalInfo[player][slot].payload;
            result['slot'] = slot;
            var _action = action.showResult(result, stats.players);

            var _personalInfo = $(crel('div'));
            var _personalLabel = $(crel('span')).text(stats.players[player].name);
            _personalLabel.css({'font-weight': 'bold'});

            if (player != LB.playerUuid())
             _personalInfo.append(_personalLabel);

            _personalInfo.append(_action);
            _personalInfos.push(_personalInfo);
          }
        });

        if(_personalInfos.length > 0){
          var _info = $(crel('div')).addClass('col-12');
          _info.css(
            {
              'display': 'inline-block',
              'border-style':'solid',
              'border-width':'5px',
              'border-top-width': '15px',
              'margin-bottom' : '5px',
              'padding': 5
            }
          );

          _personalInfos.forEach(function(_personalInfo){
            _info.append(_personalInfo)
          })

          _infos.push(_info)
        }
      });
    };

    _displayActions(ns.AllActions(stats));

    _infos.forEach(function(_info){
      _createdWidget.append(_info);
    })

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };

}(LB || {}));
