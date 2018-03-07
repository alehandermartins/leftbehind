'use strict' ;

(function(ns){

  var slotLabel = function(slot) {
    return ns.t.html(ns.SLOTS[(slot - 1) % 6].label)
  }
  ns.populateActions = function(){
    ns.Actions = function(stats){

      var _giftables = function(target){
        var _gifts = Object.keys(stats.personal).filter(function(resource){
          return stats.personal[resource] > 0
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

            var resultLabel = $(crel('div')).addClass('col-12').html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload) + ' → ' + ns.t.html(_resultLabel)).addClass('unpadded');
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
          label: function(){
            return ns.t.html('action.defend.label')
          },
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

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'defend', payload: {}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        escape: {
          label: function(){
            return ns.t.html('action.escape.label');
          },
          buildLabel: function(payload){
            return ns.t.html('action.escape.label');
          },
          showResult: function(result){
            var _resultLabel = '';
            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else{_resultLabel = ns.t.html('action.escape.result.success')};

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'escape', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        hack:{
          label: function(){
            return ns.t.html('action.hack.label')
          },
          buildLabel: function(payload){
            var location_label = ns.t.text('locations.' + payload.location)
            return ns.t.html('action.hack.selection', {location: location_label})
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'hack', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          },
          showResult: function(result){
            var _resultLabel = result.status
            if(result.status == "fail")
              _resultLabel = result.info.reason

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          }
        },
        oxygen:{
          label: function(){
            return ':food:'
          },
          buildLabel: function(){
            return ns.t.html('action.oxygen.label')
          },
          showResult: function(result){
            var _resultLabel = ns.t.html('action.oxygen.result.' +  result.status )
            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(location, slotWidget){
            var _builtAction = {name: 'oxygen', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        search: {
          label: function(){
            return ns.t.html('action.search.label')
          },
          buildLabel: function(payload){
            var location_label = ns.t.text('locations.' + payload.location);
            return ns.t.html('action.search.selection', {location: location_label});
          },
          showResult: function(result, players){
            var _showbounty = function(){
              if (Object.keys(result.bounty).length == 0)
                return ns.t.html('action.search.result.nothing')

              var _resources = Object.keys(result.bounty).map(function(resource){
                return [':', ':'].join(resource) + ' ' + result.bounty[resource]
              })

              return ns.t.html('action.search.result.bounty', {resources: _resources})
            }

            var _resultLabel = _showbounty();
            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'search', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        share: {
          label: function(resource){
            return ns.t.html('action.share.label', {resource: [':', ':'].join(resource)});
          },
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.share.selection', {resource: [':', ':'].join(payload.resource), target: targetName});
          },
          showResult: function(result){
            var resultLabel = $(crel('div')).addClass('col-12')
            resultLabel.html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)).addClass('unpadded')
            return resultLabel
          },
          run: function(target, slotWidget, resource) {
            var _builtAction = {name: 'share', payload: {target: target, resource: resource}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        spy: {
          label: function(){
            return ns.t.html('action.spy.label')
          },
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.spy.selection', {target: targetName});
          },
          showResult: function(result, players){
            var _resultLabel;
            var resultLabel = $(crel('div')).addClass('col-12');
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

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'spy', payload: {target: target}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        steal: {
          label: function(){
            return ns.t.html('action.steal.label')
          },
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.steal.selection', {resource: [':', ':'].join(payload.resource), target: targetName});
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

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(target, slotWidget){
            var _builtAction = {name: 'steal', payload: {target: target, resource: 'helmet'}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        unlock: {
          label: function(){
            return ns.t.html('action.unlock.label')
          },
          buildLabel: function(payload){
            return ns.t.html('action.unlock.selection', {location: ns.t.html('locations.' + payload.location)})
          },
          showResult: function(result){
            var _label = result.status
            if(result.status == "fail")
              _label = result.info.reason

            var _resultLabel = ns.t.html('action.unlock.result.' +  _label )
            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'unlock', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        work: {
          label: function(){
            return ns.t.html('action.work.label')
          },
          buildLabel: function(payload){
            return ns.t.html('action.work.label');
          },
          showResult: function(result, players){
            var _resultLabel = '';
            if (result.status == 'fail')
              _resultLabel = result.info.reason;
            else{_resultLabel = ns.t.html('action.work.result.success')};

            var resultLabel = $(crel('div')).addClass('unpadded col-12')
            resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
            resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'work', payload: {item: 'escape shuttle', location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
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
            var resultLabel = $(crel('div')).addClass('col-12').html(_resultLabel).addClass('unpadded');
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

            var _winnersLabel = $(crel('div')).addClass('col-12').text(_resultLabel);

            Object.keys(result.results).map(function(candidate){
              if (result.results[candidate] != 0){
                var _name = stats.players[candidate].name;
                var _candidateLabel = ns.t.text('action.vote.result.votes', {player: _name, votes: result.results[candidate]});
                var _label = $(crel('div')).addClass('col-12').text(_candidateLabel);
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
            var resultLabel = $(crel('div')).addClass('col-12').html(_resultLabel).addClass('unpadded');
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

            var resultLabel = $(crel('div')).addClass('col-12').html(ns.t.html('action.fusion.label') + _resultLabel).addClass('unpadded');
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
            var resultLabel = $(crel('div')).addClass('col-12').html(ns.t.html(slot.label) + ': ' + ns.t.text('action.none.label')).addClass('unpadded');
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
        label: ':day:'
      },
      {
        name: 'afternoon',
        label: ':second_quarter:'
      },
      {
        name: 'evening',
        label: ':third_quarter:'
      },
      {
        name: 'midnight',
        label: ':fourth_quarter:'
      },
    ];

    ns.AllActions = function(stats){
      return $.extend({}, LB.Actions(stats), LB.OtherActions(stats))
    }
  }

}(LB || {}));

