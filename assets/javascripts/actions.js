'use strict' ;

(function(ns){

  var slotLabel = function(slot) {
    return ns.t.html(ns.SLOTS[(slot - 1) % 6].label)
  }
  ns.populateActions = function(){
    ns.Actions = function(stats){

      var _giftables = function(target){
        var _isBasic = true

        if(target == 'team')
          _isBasic = ['food', 'parts'].includes(resource)

        var _gifts = Object.keys(stats.personal).filter(function(resource){
          return stats.personal[resource] > 0 && _isBasic
        })
        return _gifts.map(function(resource, indx){
          return {label: ':' + resource + ':', name: resource, uuid: indx}
        })
      }

      var _actions = {
        craft: {
          label: ':hammer:',
          buildLabel: function(payload){
            return ns.t.html('action.craft.label');
          },
          showResult: function(result){
            var _resultLabel
            if(result.status == 'success')
              _resultLabel = ns.t.html('action.craft.result.success')
            else
              _resultLabel = ns.t.html('action.craft.result.fail')

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel;
          },
          run: function(location, slotWidget) {
            var list = [{name: ns.t.html('action.craft.list'), uuid:'pick'}]
            var modalTitle = ns.t.html('action.craft.modalTitle')
            ns.Widgets.ModalTargetSelector(list, modalTitle).select(function(selection){
              var _builtAction = {name: 'craft', payload: {item: 'pick'}}
              slotWidget.selectActionForCurrentSlot(_builtAction)
            })
          }
        },
        defend: {
          label: ':defend:',
          buildLabel: function(payload){
            return ns.t.html('action.defend.label');
          },
          showResult: function(result, players){
            var _resultLabel;

            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else if (result.info.attackers.length > 0){
              result.info.attackers.map(function(attacker){
                var name = players[attacker.performer].name.capitalize();
                var action = attacker.action.split(':').pop().toLowerCase();
                if(action == 'spy')
                  _resultLabel = ns.t.text('action.defend.result.spy_defended', {player: name});

                if(action == 'steal')
                _resultLabel = ns.t.text('action.defend.result.steal_defended', {player: name});
              });
            }
            else{
              _resultLabel = ns.t.text('action.defend.result.nobody_defended');
            }

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'defend', payload: {}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        escape: {
          label: ':escape:',
          buildLabel: function(payload){
            return ns.t.html('action.escape.label');
          },
          showResult: function(result){
            var _resultLabel = '';
            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else{_resultLabel = ns.t.html('action.escape.result.success')};

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'escape', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        hack:{
          label: ':computer:',
          buildLabel: function(payload){
            var location_label = ns.t.text('locations_labels.' + payload.location)
            return ns.t.html('action.hack.label', {location: location_label})
          },
          run: function(location, slotWidget){
            var _builtAction = {name: 'hack', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          },
          showResult: function(result){
            var _resultLabel = ns.t.html('action.hack.result.' +  result.status )
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel
          }
        },
        oxygen:{
          label: ':food:',
          buildLabel: function(){
            return ns.t.html('action.oxygen.label')
          },
          showResult: function(result){
            var _resultLabel = ns.t.html('action.oxygen.result.' +  result.status )
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel() + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel
          },
          run: function(location, slotWidget){
            var _builtAction = {name: 'oxygen', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        search: {
          label: ':search:',
          buildLabel: function(payload){
            var location_label = ns.t.text('locations_labels.' + payload.location);
            return ns.t.html('action.search.label', {location: location_label});
          },
          showResult: function(result, players){
            var _coworkers = [];
            result.info.mates.forEach(function(mate){
              if(mate != result.performer)
                _coworkers.push(players[mate].name);
            });
            var _resources = [];
            var _resultLabel = '';

            var _showcoworkers = function(){
              var _label

              if (_resources.length > 0)
                _label = ns.t.html('action.search.result.teamInventory')

              if (_coworkers.length == 1){
                _label += ns.t.text('action.search.result.coworker', {coworker: _coworkers[0]})
                return $(crel('div')).addClass('col-xs-12').html(_label)
              }

              var _lastcoworker = _coworkers.pop()
              _label += ns.t.text('action.search.result.coworkers', {coworkers: _coworkers.join(', '), coworker: _lastcoworker})
              return $(crel('div')).addClass('col-xs-12').html(_label)
            }

            var _showbounty = function(){
              if (Object.keys(result.bounty).length == 0)
                return ns.t.html('action.search.result.nothing')


              _resources = Object.keys(result.bounty).map(function(resource){
                return [':', ':'].join(resource) + ' ' + result.bounty[resource]
              })

              if(_coworkers.length > 0){
                var _basicResources = Object.keys(result.bounty).filter(function(resource){
                  return ['food', 'parts'].includes(resource)
                })
                console.log(_basicResources)
                var _showResources = _basicResources.map(function(resource){
                  return [':', ':'].join(resource) + ' ' + result.bounty[resource]
                })
                return ns.t.html('action.search.result.bounty', {resources: _showResources.join(', ')})
              }

              return ns.t.html('action.search.result.bounty', {resources: _resources.join(', ')})
            }

            var _specialItem = function(){
              var _findings = [];
              Object.keys(result.info).forEach(function(mate){
                if (mate != 'mates'){
                  if (mate == result.performer)
                    _findings.push(ns.t.html('action.search.result.itemfound', {item: [':', ':'].join(result.info[mate])}));
                  else{
                    var _name = players[mate].name;
                    _findings.push(ns.t.html('action.search.result.itemfounder', {founder: _name, item: [':', ':'].join(result.info[mate])}));
                  }
                }
              });

              if (_findings.length > 0){
                var _label = _findings.join(', ');
                return $(crel('div')).addClass('col-xs-12').html(_label);
              }
              return false;
            }

            var _bounty = _showbounty();
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + _bounty).addClass('unpadded');
            if (_coworkers.length > 0){
              resultLabel.append(_showcoworkers());

              if (_specialItem()){
                resultLabel.append(_specialItem());
              }
            }

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'search', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        share: {
          label: ':gift:',
          buildLabel: function(payload){
            var targetName = 'Team'
            if(payload.target != 'team')
              targetName = stats.players[payload.target].name

            return ns.t.html('action.share.label', {resource: [':', ':'].join(payload.resource), target: targetName});
          },
          showResult: function(result){
            var resultLabel = $(crel('div')).addClass('col-xs-12')
            resultLabel.html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)).addClass('unpadded')
            return resultLabel
          },
          run: function(target, slotWidget) {
            var targetName
            var list = _giftables(target)
            if(target == LB.playerUuid()){
              target = 'team'
              targetName = ':team:'
            }
            else
              targetName = stats.players[target].name

            var modalTitle = ns.t.html('action.share.modalTitle', {target: targetName})
            ns.Widgets.ModalTargetSelector(list, modalTitle).select(function(selection){
              var _builtAction = {name: 'share', payload: {target: target, resource: selection[0].name}}
              slotWidget.selectActionForCurrentSlot(_builtAction)
            })
          }
        },
        spy: {
          label: ':spy:',
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.spy.label', {target: targetName});
          },
          showResult: function(result, players){
            var _resultLabel;
            var resultLabel = $(crel('div')).addClass('col-xs-12');
            var _inventoryLabel;

            if (result.status == 'fail'){
              _resultLabel = result.info.reason;
            }
            else {
              var _resources = Object.keys(result.info.target_info.inventory).map(function(resource){
                return [':', ':'].join(resource) + ' ' + result.info.target_info.inventory[resource];
              }).join(', ');
              _inventoryLabel = ns.t.text('action.spy.targetInventory', {target: players[result.payload.target].name, resources: _resources});
              _resultLabel = ns.t.html(_inventoryLabel);
            }

            resultLabel.html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload, players) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'spy', payload: {target: target}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        steal: {
          label: ':steal:',
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.steal.label', {resource: [':', ':'].join(payload.resource), target: targetName});
          },
          showResult: function(result, players){
            var _resultLabel;
            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else
              if ('bounty' in result){
                var _resources = Object.keys(result.bounty).map(function(resource){
                  return [':', ':'].join(resource) + ' ' + result.bounty[resource];
                }).join(', ');

                _resultLabel = ns.t.text('action.steal.result.bounty', {resources: _resources});
              }

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': ' + this.buildLabel(result.payload, players) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');

            return resultLabel;
          },
          run: function(target, slotWidget){
            var modalTitle = ns.t.html('action.steal.modalTitle')
            var list = [
              {label: ':parts:', name: 'parts', uuid:'2'},
              {label: ':helmet:', name: 'helmet', uuid:'3'}
            ]
            ns.Widgets.ModalTargetSelector(list, modalTitle).select(function(selection){
              var _builtAction = {name: 'steal', payload: {target: target, resource: selection[0].name}}
              slotWidget.selectActionForCurrentSlot(_builtAction)
            })
          }
        },
        unlock: {
          label: ':unlock:',
          buildLabel: function(payload){
            return ns.t.html('action.unlock.label', {location: ns.t.html('locations_labels.' + payload.location)})
          },
          showResult: function(result){
            var _label = result.status
            if(result.status == "fail")
              _label = result.info.reason

            var _resultLabel = ns.t.html('action.unlock.result.' +  _label )
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel
          },
          run: function(location, slotWidget) {
            var modalTitle = ns.t.html('action.unlock.modalTitle', {location: ns.t.html('locations_labels.' + location.uuid)})
            var list = [{name: ns.t.html('action.unlock.list')}]
            ns.Widgets.ModalTargetSelector(list, modalTitle).select(function(selection){
              var _builtAction = {name: 'unlock', payload: {location: location.uuid}}
              slotWidget.selectActionForCurrentSlot(_builtAction)
            })
          }
        },
        work: {
          label: ':work:',
          buildLabel: function(payload){
            return ns.t.html('action.work.label');
          },
          showResult: function(result, players){
            var _resultLabel = '';
            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else{_resultLabel = ns.t.html('action.work.result.success')};

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
            return resultLabel;
          },
          run: function(location, slotWidget) {
            var list = [{name: ns.t.html('action.work.list'), uuid:'escape_shuttle'}]
            var modalTitle = ns.t.html('action.work.modalTitle')
            ns.Widgets.ModalTargetSelector(list, modalTitle).select(function(selection){
              var _builtAction = {name: 'work', payload: {item: 'escape shuttle', location: location.uuid}}
              slotWidget.selectActionForCurrentSlot(_builtAction)
            })
          }
        }
      }

      return _actions

    }

    ns.OtherActions = function(stats){
      return {
        death: {
          showResult: function(result){
            var _resultLabel = ns.t.html('action.eat.label') + 'Was killed by the IA'
            if (result.info == 'player.status.starved'){
              if (result.performer == LB.playerUuid())
                _resultLabel = ns.t.html('action.eat.label') + ns.t.html('action.eat.result.youstarved')
              else
                _resultLabel = ns.t.html('action.eat.label') + ns.t.text('action.eat.result.otterstarved')
            }
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(_resultLabel).addClass('unpadded');
            return resultLabel;
          }
        },
        vote: {
          showResult: function(result){
            var _winners = [];
            var _candidates = [];
            var _general = $(crel('div')).html(ns.t.html('action.vote.label')).addClass('unpadded');
            result.winners.forEach(function(winner){
              _winners.push(stats.players[winner].name);
            });

            var _resultLabel = ns.t.text('action.vote.result.winners', {players: _winners.join(', ')});
            if(_winners.length == 1)
              _resultLabel = ns.t.text('action.vote.result.winner', {players: _winners.join(', ')});

            var _winnersLabel = $(crel('div')).addClass('col-xs-12').text(_resultLabel);

            Object.keys(result.results).map(function(candidate){
              if (result.results[candidate] != 0){
                var _name = stats.players[candidate].name;
                var _candidateLabel = ns.t.text('action.vote.result.votes', {player: _name, votes: result.results[candidate]});
                var _label = $(crel('div')).addClass('col-xs-12').text(_candidateLabel);
                _candidates.push(_label);
              };
            });

            _candidates.forEach(function(label){
              _general.append(label);
            });
            _general.append(_winnersLabel);

            if (_winners.length == 0)
              _general.text('');

            return _general;
          }
        },
        eat: {
          showResult: function(result){
            var _resultLabel = ''
            if (result.info == 'player.status.starved'){
              if (result.performer == LB.playerUuid())
                _resultLabel = ns.t.html('action.eat.label') + ns.t.html('action.eat.result.youstarved')
              else
                _resultLabel = ns.t.html('action.eat.label') + ns.t.text('action.eat.result.otterstarved')
            }
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(_resultLabel).addClass('unpadded');
            return resultLabel;
          }
        },
        fusion: {
          showResult: function(result){
            var _resultLabel
            if (result.info == 'action.fusion.result.entered'){
              if (result.performer == LB.playerUuid())
                _resultLabel = ns.t.html('action.fusion.result.youentered')
              else
                _resultLabel = ns.t.text('action.fusion.result.otterentered')
            }
            if (result.info == 'player.status.radiated'){
              if (result.performer == LB.playerUuid())
                _resultLabel = ns.t.html('action.fusion.result.youdied')
              else
                _resultLabel = ns.t.text('action.fusion.result.otterdied')
            }

            var resultLabel = $(crel('div')).addClass('col-xs-12').html(ns.t.html('action.fusion.label') + _resultLabel).addClass('unpadded');
            return resultLabel
          }
        },
        none: {
          buildLabel: function(payload){
            return ns.t.text('action.none.label');
          },
          showResult: function(result, players){
            if((result.slot - 1) % 6 > 3)
              return false

            var slot = LB.SLOTS[(result.slot - 1) % 4]
            var resultLabel = $(crel('div')).addClass('col-xs-12').html(ns.t.html(slot.label) + ': ' + ns.t.text('action.none.label')).addClass('unpadded');
            return resultLabel;
          }
        },
        playdead: {
          buildLabel: function(payload){
            var random = Math.floor(Math.random() * 4);
            return ns.t.text('action.playdead.label.' + random);
          }
        }
      }
    }
    ns.SLOTS = [
      {
        name: 'morning',
        label: ':waxing_crescent_moon:'
      },
      {
        name: 'afternoon',
        label: ':first_quarter_moon:'
      },
      {
        name: 'evening',
        label: ':waxing_gibbous_moon:'
      },
      {
        name: 'midnight',
        label: ':full_moon:'
      },
    ];

    ns.AllActions = function(stats){
      return $.extend({}, LB.Actions(stats), LB.OtherActions(stats))
    }

    ns.ALL_SLOTS = ns.SLOTS.concat([
      {
        name: 'sharing',
        label: ':arrows_clockwise:'
      }
    ]);
  }

}(LB || {}));

