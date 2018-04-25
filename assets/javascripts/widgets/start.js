'use strict';
(function(ns){

  ns.Widgets.CurrentPlayers = function(){
    var _createdWidget = $(crel('div'));
    var _currentPlayers = $(crel('div')).addClass('col-12 start-players');

    var _label = $(crel('span')).text(ns.t.html('start.players'));
    _label.css({'font-weight': 'bold'});

    var _crew = $(crel('div')).addClass('row');

    var _refresh = function refresh(){
      var _roles = ['captain', 'pilot', 'mechanic', 'scientist'];
      ns.Backend.lobby(function(data){
        var players = data.players;
        var game = data.game;

        if (players.length > 3)
          _inviteButton.attr('disabled', true);

        _crew.empty();
        players.forEach(function(player){
          _roles.splice(_roles.indexOf(player.role), 1);
          var _player = $(crel('div')).addClass('start-player col-12');
          var _playerName = $(crel('div')).text(player.name).addClass('start-player-name col-6 text-center');
          _player.append(LB.Widgets.PlayerAvatarXS(player).render());
          _player.append(_playerName);
          _crew.append(_player);
        });

        _roles.forEach(function(role){
          var _player = $(crel('div')).addClass('start-player col-12');
          _player.append(LB.Widgets.PlayerAvatarXS({role: role}).render());
          var _inviteButton = ns.Widgets.Button(ns.t.html('start.invite'), function(){
            var joinUrl = location.origin + '/games/join/' + ns.currentGame();
            ns.Widgets.Invite(joinUrl).render();
          }, 6).render();
          _player.append(_inviteButton);
          _crew.append(_player);
        });

        if(game.host == LB.playerUuid()){
          _startWidget.css('display', 'block');
          if (players.length > 0)
          _playbuttonWidget.removeAttr('disabled');
        else
          _playbuttonWidget.attr('disabled', true);
        }
        else{
          _startWidget.css('display', 'none');
          if (data.game.status == 'ongoing')
            ns.paintScreen();
        }
      });
    };


    var _startWidget = $(crel('div')).addClass('col-12 timeSelector');
      _startWidget.css('display', 'none');

    var _text = $(crel('span')).text(ns.t.text('start.style.label'))
    var _timeSelect = $(crel('select')).addClass('col-12').css('background-color', '#303030');

    _timeSelect.append($(crel('option')).text('1 min (Expert)').val(60));
    _timeSelect.append($(crel('option')).text('2 min (Medium)').val(120));
    _timeSelect.append($(crel('option')).text('5 min (Novice)').val(300));
    _timeSelect.append($(crel('option')).text('10 min (Laid back)').val(600));
    _timeSelect.append($(crel('option')).text('15 min (Laid back XL)').val(900));

    _timeSelect.val(300).trigger('change');

     var _playbuttonWidget = ns.Widgets.SpinningButton(ns.t.text('buttons.start'), function(){
      ns.Backend.startGame('gentle', _timeSelect.val(), ns.Events.Play);
    }, 12).render();


    _startWidget.append(
      _text,
      _timeSelect,
      _playbuttonWidget
    );

    _currentPlayers.append(_label);
    _currentPlayers.append(_crew, _startWidget);
    _createdWidget.append(_currentPlayers);


    var _rules = $(crel('div')).addClass('start-players');
    _rules.css('padding', '5px');
    var _intro = $(crel('div')).addClass('intro');
    _intro.html('Estás a bordo de una nave espacial. Tras meses de viaje os adentráis en una zona prohibida.\
      Las alarmas empiezan a sonar. La Inteligencia Artificial ' +  LB.t.html(':ia:') + ' de la nave toma el control:');

    var _mainPoints = $(crel('ul')).addClass('col-12');
    var _autoDestruction = $(crel('li'));
    var _scapePod = $(crel('li'));
    var _oxygen = $(crel('li'));

    _autoDestruction.html('Inicia la secuencia de autodrestrucción. Quedan 10h para que la nave estalle.');
    _scapePod.html('Provoca un cortocircuito en el control de la cápsula de escape ' + LB.t.html(':shuttle:') + '. Necesitarás ' + LB.t.html(':parts:') + ' para repararla y un ' + LB.t.html(':helmet:') + ' para escapar.');
    _oxygen.html('Suelta una neurotoxina en el aire, que lo hace inrespirable. Necesitarás ' + LB.t.html(':food:') + ' cada hora para sobrevivir.');

    _mainPoints.append(_autoDestruction, _scapePod, _oxygen);
    _rules.append(_intro, _mainPoints);

    _createdWidget.append(_rules);

    return {
      render: function(){
        _refresh();
        setInterval(_refresh, 5000);
        return _createdWidget;
      }
    };
  };


  ns.Widgets.Invite = function(joinUrl){

    var generateInviteText = function(joinUrl){
      var whatsappHref = 'whatsapp://send?text=' + joinUrl;
      var emailHref = 'mailto:?subject=Join%20me%20in%20a%20Left%20Behind%20game&body=Click%20this%20link%20to%20play%20'+joinUrl

      var messageContainer = $(crel('div'));
      messageContainer.append($(crel('p')).text(ns.t.html('invite.link')).append($(crel('a')).attr('href', joinUrl).text(joinUrl)));
      messageContainer.append($(crel('p')).text(ns.t.html('invite.click'))
        .append($(crel('a')).attr('href', whatsappHref).append($(crel('i')).addClass('fab fa-whatsapp')))
        .append($(crel('a')).attr('href', emailHref).append($(crel('i')).addClass('fas fa-envelope')))
      );

      messageContainer.append($(crel('p')).text(ns.t.html('invite.scan'))).append($(crel('div')).attr('id', 'qr'));
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


}(LB || {}));


