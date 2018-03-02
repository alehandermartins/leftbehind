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

  ns.Widgets.TimeSlot = function(slot, selected_action, callback, size){
    selected_action = selected_action || " Escoge una acción"
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

  ns.Widgets.Information = function(stats){
    var _createdWidget = $(crel('div')).addClass('row');

    var slotsToShow = {
      'actions': 2,
      'events': 4
    }

    var personalInfo = stats.personal_info

    var slots = [];
    var _infos = [];

    for (var i = stats.current_slot - slotsToShow[stats.day_status]; i < stats.current_slot; i++){
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
            if (personalInfo[player][slot].payload && personalInfo[player][slot].payload.target)
              result['target'] = personalInfo[player][slot].payload.target;
            result['performer'] = player;
            result['payload'] = personalInfo[player][slot].payload;
            result['slot'] = slot;
            var _action = action.showResult(result, stats.players);

            var _personalInfo = $(crel('div'));
            var _personalLabel = $(crel('span')).text(stats.players[player].name);

            if (player == LB.playerUuid())
              _personalLabel.text(ns.t.text('results.personal'))

            _personalLabel.css({'font-weight': 'bold'});
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

          _info.hide()
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
        var indx = 0

        if (_infos.length > 0){
          _infos[0].show()
          bootbox.dialog({
            title: ns.t.text('results.label', {day: stats.status.day}),
            message: _createdWidget,
            buttons: {
              previous: {
                label: "←",
                className: "btn-primary previous",
                callback: function() {
                  nextButton.disabled = true
                  okButton.disabled = true
                  previousButton.disabled = true

                  _infos[indx].hide("slide", { direction: "right" }, function(){
                    _infos[indx - 1].show("slide", { direction: "left" }, function(){
                      indx -= 1
                      nextButton.disabled = false
                      if (indx != 0)
                        previousButton.disabled = false
                    })
                  })
                  return false;
                }
              },
              next: {
                label: "→",
                className: "btn-primary next",
                callback: function() {
                  nextButton.disabled = true
                  okButton.disabled = true
                  previousButton.disabled = true

                  _infos[indx].hide("slide", { direction: "left" }, function(){
                    _infos[indx + 1].show("slide", { direction: "right" }, function(){
                      indx += 1
                      previousButton.disabled = false
                      if (indx != _infos.length - 1)
                        nextButton.disabled = false
                      else
                        okButton.disabled = false
                    })
                  })
                  return false
                }
              },
              ok: {
                label: "Ok",
                className: 'btn-default ok',
                callback: function(){
                }
              }
          }
          });

          var previousButton = document.querySelector('.previous')
          var nextButton = document.querySelector('.next')
          var okButton = document.querySelector('.ok')
          previousButton.disabled = true
          okButton.disabled = true

          if(_infos.length == 1){
            nextButton.disabled = true
            okButton.disabled = false
          }
        }
      }
    };
  };

  ns.Widgets.StageTutorial = function(stage){
    var storage = sessionStorage

    return {
      render: function(){
        if (storage['tutorial_'+ stage])
          return;

        bootbox.alert({
          title: ns.t.html('tutorial.' + stage + '.title'),
          message: ns.t.html('tutorial.' + stage + '.message'),
          callback: function(){
            storage['tutorial_'+ stage] = true;
          }
        });
      }
    }
  };

  ns.Widgets.ActionTutorial = function(id, menu){
    var storage = sessionStorage

    return  {
      render: function(){
        if (storage['tutorial_'+ id]){
          menu()
          return
        }

        bootbox.alert({
          title: ns.t.html('action.' + id + '.tutorialTitle'),
          message: ns.t.html('action.' + id + '.tutorialInfo'),
          callback: function(){
            storage['tutorial_'+ id] = true;
            menu()
          }
        });
      }
    }
  };
}(LB || {}));
