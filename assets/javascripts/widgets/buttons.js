'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback, size){
    size = size || 6;
    var _createdButton = $(crel('div'))
     .addClass('btn btn-default col-' + size)
     .html(ns.t.html(label))
     .click(callback);

    return {
      render: function(){
        return _createdButton;
      }
    };
  };

  ns.Widgets.ExtraSmallButton = function(label, callback, size){
    size = size || 10;
    var _createdButton = $(crel('div'))
     .addClass('btn btn-default btn-xs col-' + size)
     .text(label)
     .click(callback);

    return {
      render: function(){
        return _createdButton;
      }
    };
  };

  ns.Widgets.SpinningButton = function(label, callback, size){
    var _button = ns.Widgets.Button(label, function(){
      var _spinner = $(crel('span'))
        .addClass('spinner')
        .append(
          '&nbsp;',
          $(crel('i')).addClass('glyphicon glyphicon-refresh glyphicon-spin')
        )

      $(this).append(_spinner);
      $(this).attr('disabled', true);
      callback();
    }, size).render().addClass('spinning-button');
    return {
      render: function(){
        return _button;
      },
      disable: function(){
        _button.attr('disabled', true);
      },
      enable: function(){
        _button.attr('disabled', false).find('.spinner').remove();
      }
    }
  };

  ns.Widgets.SendActionsButton = function(origin){
    var _createdWidget = $(crel('div')).addClass('col-12 text-center');
    _createdWidget.css('margin-top', '20px');
    var _createdButton = ns.Widgets.Button(ns.t.html('buttons.send'), function(){
      if(_createdButton.hasClass('disabled'))
        return

      origin.getSelections(function(selections){
        ns.Backend.daySelections(
          {
            game_uuid: ns.currentGame(),
            player_uuid: ns.playerUuid(),
            actions: selections,
          },
          ns.Events.SentSelections
        );
      });
    }, 6).render();

    _createdWidget.append(_createdButton);
    return {
      render: function(){
        return _createdWidget;
      },
      disable: function(){
        _createdButton.removeClass('btn-default disabled');
        _createdButton.addClass('btn-default disabled');
      },
      enable: function(){
        _createdButton.removeClass('btn-default disabled');
        _createdButton.addClass('btn-success');
      }
    };
  };

  ns.Widgets.OKButton = function(){
    var _createdWidget = $(crel('div')).addClass('send-shares');
    var _createdButton = ns.Widgets.SpinningButton('OK', function(){
      var _builtAction =  {'events': {name: 'none', payload: {}}}
      ns.Backend.daySelections(
        {
          game_uuid: ns.currentGame(),
          player_uuid: ns.playerUuid(),
          actions: _builtAction,
        },
        ns.Events.SentSelections
      );
    }, 12);
     _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };

  ns.Widgets.SendVotesButton = function(builtAction, number_of_votes){
    var _createdButton = ns.Widgets.SpinningButton(ns.t.html('buttons.send'), function(){
      console.log(builtAction);

      if (builtAction['events']['payload']['target'].length == number_of_votes){
        ns.Backend.daySelections(
          {
            game_uuid: ns.currentGame(),
            player_uuid: ns.playerUuid(),
            actions: builtAction,
          },
          ns.Events.SentSelections
        );
      }
      else {
        bootbox.alert({
          title: ns.t.html('events.voting.title'),
          message: ns.t.text('events.voting.message', {votes: number_of_votes}),
          callback: function(){
            _createdButton.enable()
          }
        });
      }
    }, 12);

    return {
      render: function(){
        return _createdButton.render();
      }
    };
  };


}(LB || {}));
