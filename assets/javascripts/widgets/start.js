'use strict';
(function(ns){

  ns.Widgets.CurrentPlayers = function(){
    var _createdWidget = $(crel('div'));
    var _currentPlayers = $(crel('div')).addClass('col-12 start-players');

    var _label = $(crel('span')).text(ns.t.html('start.players'));
    _label.css({'font-weight': 'bold'});

    var _crew = $(crel('div')).addClass('row');

    var _refresh = function refresh(){
      ns.Backend.players(function(players){
        if (players.length > 3)
          _inviteButton.attr('disabled', true);

        _crew.empty();
        players.forEach(function(player){
          var _player = $(crel('div')).addClass('start-player col-12');
          var _playerName = $(crel('div')).text(player.name).addClass('start-player-name');
          _player.append(LB.Widgets.PlayerAvatarXS(player).render());
          _player.append(_playerName);
          _crew.append(_player);
        });
      });
    };

    _currentPlayers.append(_label);
    _currentPlayers.append(_crew);

    _createdWidget.append(_currentPlayers);

    var _inviteButton = ns.Widgets.Button(ns.t.html('start.invite'), function(){
      var joinUrl = location.origin + '/games/join/' + ns.currentGame();
      ns.Widgets.Invite(joinUrl).render();
    }, 12).render();
    _currentPlayers.append(_inviteButton);

    return {
      render: function(){
        _refresh()
        setInterval(_refresh, 50000);
        return _createdWidget;
      },
      refresh: _refresh
    };
  };

  ns.Widgets.Invite = function(joinUrl){

    var generateInviteText = function(joinUrl){
      var whatsappHref = 'whatsapp://send?text=' + joinUrl;
      var emailHref = 'mailto:?subject=Join%20me%20in%20a%20Left%20Behind%20game&body=Click%20this%20link%20to%20play%20'+joinUrl

      var messageContainer = $(crel('div'));
      messageContainer.append($(crel('p')).text(ns.t.html('invite.link')).append($(crel('a')).attr('href', joinUrl).text(joinUrl)));
      messageContainer.append($(crel('p')).text(ns.t.html('invite.click'))
        .append($(crel('a')).attr('href', whatsappHref).append($(crel('i')).addClass('glyphicon glyphicon-earphone wa')))
        .append($(crel('a')).attr('href', emailHref).append($(crel('i')).addClass('glyphicon glyphicon-envelope mail')))
      );

      messageContainer.append($(crel('p')).text(ns.t.html('invite.scan'))).append($(crel('div')).attr('id', 'qr'));

      // messageContainer.append(ns.Widgets.Button(ns.t.html('invite.recruit'), function(){
      //   LB.Backend.recruit();
      //   bootbox.hideAll();
      // }, 12).render());

      return messageContainer;
    };

    var _render = function(){
      bootbox.alert({
        title: ns.t.html('invite.title'),
        message: generateInviteText(joinUrl)
      });
      new QRCode($("#qr").get(0), {
        text: joinUrl,
        width: 240,
        height: 240
      });
    };

    return {
      render: _render
    }
  };

  ns.Widgets.Introduction = function(){
    var _createdWidget = $(crel('div')).addClass('col-12');
    var _introduction = $(crel('div')).addClass('text-center').text(ns.t.text('start.intro'));
    _introduction.css({'border-style':'solid','border-width':'5px', 'border-top-width': '15px'});

    _createdWidget.append(_introduction);

    return {
      render: function(){
        return _createdWidget;
      }
    };
  }

  ns.Widgets.PlayButton = function(game){
    var _createdWidget = $(crel('div')).addClass('col-12');

    var _text = $(crel('span')).text(ns.t.text('start.style.label'))

    // var _styleSelect = $(crel('select')).addClass('col-12').css('background-color', '#303030');
    // _styleSelect.append($(crel('option')).text(ns.t.text('start.style.gentle')).val('gentle'));
    // _styleSelect.append($(crel('option')).text(ns.t.text('start.style.turbo')).val('turbo'));

    var _timeSelect = $(crel('select')).addClass('col-12').css('background-color', '#303030');

    _timeSelect.append($(crel('option')).text('1 min (Expert)').val(60));
    _timeSelect.append($(crel('option')).text('2 min (Medium)').val(120));
    _timeSelect.append($(crel('option')).text('5 min (Novice)').val(300));
    _timeSelect.append($(crel('option')).text('10 min (Laid back)').val(600));
    _timeSelect.append($(crel('option')).text('15 min (Laid back XL)').val(900));

    _timeSelect.val(300).trigger('change');

    // _styleSelect.on('change', function(){
    //   _timeSelect.hide();
    //   if (_styleSelect.val() == 'turbo')
    //     _timeSelect.show();
    // }).change();

    var _playbuttonWidget = ns.Widgets.SpinningButton(ns.t.text('buttons.start'), function(){
      ns.Backend.startGame('gentle', _timeSelect.val(), ns.Events.Play);
    }, 12).render();

    var _refreshHost = function(){
      ns.Backend.gameReady(
        {
          uuid: ns.currentGame(),
          player: ns.playerUuid(),
        },
        function(data){
          if (data['status'] == 'fail')
            _playbuttonWidget.attr('disabled', true);
          if (data['status'] == 'success')
            _playbuttonWidget.removeAttr('disabled');
      });
    };

    var _refresh = function(){
      ns.Backend.getStats(function(data){
        if (data.game.status == 'ongoing')
          ns.paintScreen();
      })
    };

    _createdWidget.append(
      _text,
      _timeSelect,
      _playbuttonWidget
    );

    return {
      render: function(){
        if (game.host == ns.playerUuid()){
          _refreshHost();
          setInterval(_refreshHost, 5000);
          return _createdWidget;
        }
        else{
          _refresh();
          setInterval(_refresh, 5000);
        }
      },
      refresh: _refresh
    };
  };

}(LB || {}));


