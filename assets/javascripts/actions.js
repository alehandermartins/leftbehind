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
        brainscan: {
          label: function(target){
            return ns.t.html('action.brainscan.label', {target: stats.players[target].name});
          },
          buildLabel: function(payload){
            return ns.t.html('action.brainscan.label');
          },
          showResult: function(result, players){
            var resultLabel = $(crel('div')).addClass('result-label col-12')
            console.log(result.payload.item)

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + ns.t.html('action.brainscan.result.' + result.status, {resource: [':', ':'].join(result.payload.item)})));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }
            return resultLabel;
          },
          run: function(location, slotWidget, target) {
            var _builtAction = {name: 'brainscan', payload: {target: target}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        craft: {
          label: function(resource){
            return ns.t.html('action.craft.label', {resource: [':', ':'].join(resource)});
          },
          buildLabel: function(payload){
            return ns.t.html('action.craft.selection', {resource: [':', ':'].join(payload.item)});
          },
          showResult: function(result, players){
            var resultLabel = $(crel('div')).addClass('result-label col-12')
            console.log(result.payload.item)

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + ns.t.html('action.craft.result.' + result.status, {resource: [':', ':'].join(result.payload.item)})));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }
            return resultLabel;
          },
          run: function(location, slotWidget, resource) {
            var _builtAction = {name: 'craft', payload: {item: resource}}
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
              var location_label = ns.t.text('locations.' + result.payload.location);
              if (!result.bounty)
                return ns.t.html('action.search.result.fail', {location: location_label});

              if(result.status == 'fail')
                return ns.t.html('action.search.result.full', {resources: [':', ':'].join(Object.keys(result.bounty)[0]), location: location_label});

              var _resources = Object.keys(result.bounty).map(function(resource){
                return result.bounty[resource] + ' ' +  [':', ':'].join(resource);
              })

              return ns.t.html('action.search.result.success', {resources: _resources, location: location_label});
            }

            var _resultLabel = _showbounty();
            var resultLabel = $(crel('div')).addClass('result-label col-12')
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }
            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'search', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
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
            var _label
            if(result.status == 'success')
              _label = 'action.oxygen.result.success'
            else
              _label = result.info.reason

            var _resultLabel = ns.t.html(_label)
            var resultLabel = $(crel('div')).addClass('result-label col-12')
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

            return resultLabel;
          },
          run: function(location, slotWidget){
            var _builtAction = {name: 'oxygen', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        // hack:{
        //   label: function(){
        //     return ns.t.html('action.hack.label')
        //   },
        //   buildLabel: function(payload){
        //     var location_label = ns.t.text('locations.' + payload.location)
        //     return ns.t.html('action.hack.selection', {location: location_label})
        //   },
        //   run: function(location, slotWidget) {
        //     var _builtAction = {name: 'hack', payload: {location: location.uuid}}
        //     slotWidget.selectActionForCurrentSlot(_builtAction)
        //   },
        //   showResult: function(result){
        //     var _resultLabel = result.status
        //     if(result.status == "fail")
        //       _resultLabel = result.info.reason

        //     var resultLabel = $(crel('div')).addClass('unpadded col-12')
        //     resultLabel.append($(crel('div')).html(slotLabel(result.slot) + ': '+ this.buildLabel(result.payload)));
        //     resultLabel.append($(crel('div')).html(' → ' + _resultLabel));

        //     return resultLabel;
        //   }
        // },
        unlock: {
          label: function(){
            return ns.t.html('action.unlock.label')
          },
          buildLabel: function(payload){
            return ns.t.html('action.unlock.selection', {location: ns.t.html('locations.' + payload.location)})
          },
          showResult: function(result, players){
            var _resultLabel;
            if(result.status == "success")
              _resultLabel = ns.t.html('action.unlock.result.success', {location: ns.t.html('locations.' + result.payload.location)});
            else
              _resultLabel = ns.t.html(result.info.reason);

            var resultLabel = $(crel('div')).addClass('result-label col-12');
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

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
            return ns.t.html('action.work.selection');
          },
          showResult: function(result, players){
            var _resultLabel = ns.t.html('action.work.result.success');
            if (result.status == 'fail')
              _resultLabel = ns.t.html(result.info.reason);

            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'work', payload: {item: 'escape shuttle', location: location.uuid}}
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
            var _inventoryLabel;

            if (result.status == 'fail'){
              _resultLabel = result.info.reason;
            }
            else {
              var _resources = Object.keys(result.info.target_info.inventory).map(function(resource){
                return [':', ':'].join(resource) + ' ' + result.info.target_info.inventory[resource];
              }).join(', ');
              _inventoryLabel = ns.t.html('action.spy.targetInventory', {target: players[result.payload.target].name, resources: _resources});
              _resultLabel = ns.t.html(_inventoryLabel);
            }

            if(result.info.warning == true){
              var androidName = players[result.info.android].name
              if(result.info.threat)
                _resultLabel += ns.t.html('&nbsp') + ns.t.html('action.hackandroid.result.revealed', {player: androidName});
              else
                _resultLabel += ns.t.html('&nbsp') + ns.t.html('action.hackandroid.result.revealed_safe', {player: androidName});
            }

            var resultLabel = $(crel('div')).addClass('result-label col-12')
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + this.buildLabel(result.payload)));

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'spy', payload: {target: target}}
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
          showResult: function(result, players){
            var resultLabel = $(crel('div')).addClass('result-label col-12')
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + this.buildLabel(result.payload)));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }
            return resultLabel;
          },
          run: function(target, slotWidget, resource) {
            var _builtAction = {name: 'share', payload: {target: target, resource: resource}}
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
                  return result.bounty[resource] + ' ' + [':', ':'].join(resource);
                });
                var targetName = stats.players[result.payload.target].name;
                _resultLabel = ns.t.html('action.steal.result.success', {resources: _resources, target: targetName});
              }

            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

            return resultLabel;
          },
          run: function(target, slotWidget){
            var _builtAction = {name: 'steal', payload: {target: target, resource: 'helmet'}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
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
            else{
              if (result.info.attackers.length > 0)
                _resultLabel = ns.t.text('action.defend.result.success');
              else
                _resultLabel = ns.t.text('action.defend.result.nobody_defended');
            }

            var resultLabel = $(crel('div')).addClass('result-label col-12');
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

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
            var _resultLabel = ns.t.html('action.escape.result.success');
            if (result.status == 'fail')
              _resultLabel = ns.t.html(result.info.reason);

            var resultLabel = $(crel('div')).addClass('result-label col-12');
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

            return resultLabel;
          },
          run: function(location, slotWidget) {
            var _builtAction = {name: 'escape', payload: {location: location.uuid}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        hackandroid: {
          label: function(target){
            var fix = stats.players[target].fix + '%';
            return ns.t.html('action.hackandroid.label', {fix: fix});
          },
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.hackandroid.selection', {target: targetName});
          },
          showResult: function(result, players){
            var _resultLabel;
            var targetName = stats.players[result.payload.target].name;
            if (result.status == 'fail')
              _resultLabel = ns.t.html(result.info.reason);
            else{
              var fix = result.info.fix + '%';
              _resultLabel = ns.t.html('action.hackandroid.result.success', {target: targetName, fix: fix})
            }

            var resultLabel = $(crel('div')).addClass('result-label col-12')

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }
            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'hackandroid', payload: {target: target}}
            slotWidget.selectActionForCurrentSlot(_builtAction)
          }
        },
        disconnectandroid: {
          label: function(){
            return ns.t.html('action.disconnectandroid.label');
          },
          buildLabel: function(payload){
            var targetName = stats.players[payload.target].name
            return ns.t.html('action.disconnectandroid.selection', {target: targetName});
          },
          showResult: function(result){
            var targetName = stats.players[result.payload.target].name;
            var performer = stats.players[result.performer].name;
            var _resultLabel = ns.t.html('action.disconnectandroid.result.success', {target: targetName, player: performer});
            if (result.status == 'fail')
              _resultLabel = ns.t.html(result.info.reason);

            var resultLabel = $(crel('div')).addClass('result-label col-12');
            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(slotLabel(result.slot) + '&nbsp' + _resultLabel));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + this.buildLabel(result.payload)));
            }

            return resultLabel;
          },
          run: function(target, slotWidget) {
            var _builtAction = {name: 'disconnectandroid', payload: {target: target}}
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
            var resultLabel = $(crel('div')).addClass('col-12').html(_resultLabel).addClass('result-label');
            return resultLabel;
          }
        },
        vote: {
          showResult: function(result){
            var _winners = [];
            var _candidates = [];
            var _general = $(crel('div')).html(ns.t.html('action.vote.label')).addClass('result-label');
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
          showResult: function(result, players){
            var _resultLabel;
            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if (result.info == 'player.status.starved'){
              if (result.performer == LB.playerUuid())
                resultLabel.append($(crel('div')).html(ns.t.html('action.eat.result.youstarved') + ns.t.html('action.eat.label')));
              else{
                resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
                resultLabel.append($(crel('div')).html('&nbsp' + ns.t.text('action.eat.result.otterstarved') + ns.t.html('action.eat.label')));
              }
            }
            return resultLabel;
          }
        },
        inject: {
          showResult: function(result){
            var _decision = result.payload.decision;
            var _resultLabel;
            if(_decision == true)
              _resultLabel = result.info.reason
            else
              _resultLabel = 'action.inject.result.no'

            var resultLabel = $(crel('div')).addClass('col-12').html(ns.t.html('action.inject.label') + " " + ns.t.text(_resultLabel)).addClass('result-label');
            return resultLabel
          }
        },
        betray: {
          showResult: function(result){
            var resultLabel = $(crel('div')).addClass('result-label col-12');
            if(result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(ns.t.html('action.betray.label') + " " + ns.t.html('action.betray.result.' + result.payload.decision)));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarUnknown().render());
              resultLabel.append($(crel('div')).html('&nbsp' + ns.t.html('action.betray.label') + " " + ns.t.html('action.betray.result.alert')));
            }

            return resultLabel
          }
        },
        gunsmith: {
          showResult: function(result){
            var resultLabel = $(crel('div')).addClass('result-label col-12');
            resultLabel.append($(crel('div')).html(ns.t.html('action.gunsmith.label') + " " + ns.t.html('action.gunsmith.result.' + result.payload.decision)));

            return resultLabel
          }
        },
        hitman: {
          showResult: function(result, players){
            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if (result.performer == LB.playerUuid())
              resultLabel.append($(crel('div')).html(ns.t.html('action.hitman.label') + " " + ns.t.html(result.info.reason, { target: players[result.info.target].name })));
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render())
              resultLabel.append($(crel('div')).html('&nbsp' + ns.t.html(result.info.reason, { target: players[result.performer].name })));
            }
            return resultLabel;
          }
        },
        android: {
          showResult: function(result, players){
            var _decision = result.payload.decision;
            var _resultLabel;
            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if(result.performer == LB.playerUuid()){
              if(_decision == true)
                _resultLabel = ns.t.html('action.android.result.yes')
              else
                _resultLabel = ns.t.html('action.android.result.no')

              resultLabel.append($(crel('div')).html(_resultLabel + ns.t.html('action.android.label')));
            }
            else{
              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render());
              resultLabel.append($(crel('div')).html('&nbsp' + ns.t.html('action.android.result.informed', {player: stats.players[result.performer].name}) + ns.t.html('action.android.label')));
            }
            return resultLabel
          }
        },
        fusion: {
          showResult: function(result, players){
            var _resultLabel;
            var resultLabel = $(crel('div')).addClass('result-label col-12');

            if (result.performer == LB.playerUuid()){
              if (result.info == 'action.fusion.result.entered')
                _resultLabel = ns.t.html('action.fusion.result.youentered')

              if (result.info == 'player.status.radiated')
                _resultLabel = ns.t.html('action.fusion.result.youdied')

              resultLabel.append($(crel('div')).html(_resultLabel + ns.t.html('action.fusion.label')));
            }
            else{
              if (result.info == 'action.fusion.result.entered')
                _resultLabel = ns.t.html('action.fusion.result.otterentered')

              if (result.info == 'player.status.radiated')
                _resultLabel = ns.t.html('action.fusion.result.otterdied')

              resultLabel.append(LB.Widgets.PlayerAvatarXS(players[result.performer]).render());
              resultLabel.append($(crel('div')).html('&nbsp' + _resultLabel + ns.t.html('action.fusion.label')));
            }

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
            var resultLabel = $(crel('div')).addClass('col-12').html(ns.t.html(slot.label) + ': ' + ns.t.text('action.none.label')).addClass('result-label');
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

