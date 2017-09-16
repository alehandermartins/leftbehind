'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateGame = function(){
    var _createdWidget = $(crel('div')).addClass('create').addClass('form well');
    var _textRow = $(crel('div')).addClass('row');
    var _text = $(crel('div')).addClass('col-xs-12').append($(crel('span')).text(ns.t.html('welcome.create.label')));
    var _row = $(crel('div')).addClass('row');
    var _nameInput = $(crel('input')).prop({'type': 'text', placeholder: ns.t.html('welcome.game_name'), name: 'cg_name_game', autocomplete: 'on'}).addClass('col-xs-12');
    var _playerInput = $(crel('input')).attr({'type': 'text', placeholder: ns.t.html('welcome.player_name'), name: 'cg_player_game', autocomplete: 'on'}).addClass('col-xs-12');
    var _typeSelect = $(crel('select')).prop({name: 'cg_type_game'}).addClass('col-xs-12');
    _typeSelect.append($(crel('option')).text('Public match').val('public'));
    _typeSelect.append($(crel('option')).text('Private match').val('private'));
    var _password = $(crel('input')).prop({'type': 'text', placeholder: 'password', name: 'cg_password_game'}).addClass('col-xs-12');
    _password.hide();

    _typeSelect.on('change', function(){
      _password.hide();
      if (_typeSelect.val() == 'private')
        _password.show();
    });

    var _sendButton = ns.Widgets.SpinningButton(
      'GO',
      function(){
        console.log(_typeSelect.val());
        ns.Backend.createGame(
          _nameInput.val(),
          _typeSelect.val(),
          _password.val(),
          {
            name: _playerInput.val(),
            uuid: ns.playerUuid(),
          },
          ns.Events.GameCreated
        );
      },
      12
    );

    _row.append(
      _textRow.append(_text),
      _nameInput,
      _playerInput,
      //_typeSelect,
      _password,
      _sendButton.render()
    );
    _createdWidget.append(_row);

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };

  ns.Widgets.JoinGame = function(){
    var _createdWidget = $(crel('div')).addClass('join').addClass('form well');
    var _textRow = $(crel('div')).addClass('row');
    var _text = $(crel('div')).addClass('col-xs-12').append($(crel('span')).text(ns.t.html('welcome.join.label')));
    var _row = $(crel('div')).addClass('row');
    var _playerInput = $(crel('input')).attr({'type': 'text', placeholder: ns.t.html('welcome.player_name'), name: 'cg_player_game'}).addClass('col-xs-12');

    var _nameSelect = $(crel('select')).prop({name: 'cg_name_game'}).addClass('col-xs-12');
    ns.Backend.availableGames(function(data){
      if (!data.length) {
        _nameSelect.append($(crel('option')).text(ns.t.text('welcome.no_games')));
        return;
      }
      data.forEach(function(game){
        _nameSelect.append($(crel('option')).text(game.name).val(game.uuid));
      });
    });

    var _sendButton = ns.Widgets.SpinningButton(
      'GO',
      function(){
        ns.Backend.joinGame(
          _nameSelect.val(),
          {
            name: _playerInput.val(),
            uuid: ns.playerUuid()
          },
          ns.Events.JointGame
        );
      },
      12
    );

    _row.append(
      _textRow.append(_text),
      _nameSelect,
      _playerInput,
      _sendButton.render()
    );
    _createdWidget.append(_row);

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };

  ns.Widgets.ResumeGame = function(){
    var _createdWidget = $(crel('div')).addClass('join').addClass('form well');
    var _textRow = $(crel('div')).addClass('row');
    var _text = $(crel('div')).addClass('col-xs-12').append($(crel('span')).text(ns.t.html('welcome.resume.label')));
    var _row = $(crel('div')).addClass('row');
    var _playerInput = $(crel('input')).attr({'type': 'text', placeholder: 'your name', name: 'cg_player_game'}).addClass('col-xs-12');

    var _sendButton = ns.Widgets.SpinningButton('GO',function(){
      ns.Events.Play(_nameSelect.val());
    },12).render();
    _sendButton.attr('disabled',true);

    var _nameSelect = $(crel('select')).prop({name: 'cg_name_game'}).addClass('col-xs-12');
    ns.Backend.ongoingGames(ns.playerUuid(),function(data){
      if (!data || !data.length) {
        _nameSelect.append($(crel('option')).text(ns.t.html('welcome.no_games')));
        return;
      }
      _nameSelect.append($(crel('option')).text(ns.t.html('welcome.resume.select')).val('header'));
      data.forEach(function(game){
        _nameSelect.append($(crel('option')).text(game.name).val(game.uuid));
      });
    });


    _nameSelect.on('change', function(){
      if (_nameSelect.val() == 'header'){
        _sendButton.attr('disabled',true);
        return;
      }
      _sendButton.attr('disabled',false);
    });

    _row.append(
      _textRow.append(_text),
      _nameSelect,
      _sendButton
    );
    _createdWidget.append(_row);

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };


  ns.Widgets.EnterGame = function(){
    var _createdWidget = $(crel('div')).addClass('join').addClass('form well');
    var _row = $(crel('div')).addClass('row');
    var _playerInput = $(crel('input')).attr({'type': 'text', placeholder: 'your name', name: 'cg_player_game'}).addClass('col-xs-12');

    var _welcomeText = $(crel('span'));
    ns.Backend.players(function(players){
      ns.Backend.gameName(function(gameName){

        _welcomeText.html(ns.t.text('welcome.join.recruited', {
          game: gameName,
          players: players.map(function(player){
            return player.name
          }).join(', ')
        }))
      })
    });

    var _sendButton = ns.Widgets.SpinningButton(
      'join',
      function(){
        ns.Backend.joinGame(
          ns.currentGame(),
          {
            name: _playerInput.val(),
            uuid: ns.playerUuid()
          },
          ns.Events.JointGame
        );
      },
      12
    );

    _row.append(
      _welcomeText,
      _playerInput,
      _sendButton.render()
    );
    _createdWidget.append(_row);

    return {
      render: function(){
        return _createdWidget;
      }
    };
  };

}(LB || {}));
