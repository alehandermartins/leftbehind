'use strict';



(function(ns){

  (function renderOptions(){
    ns.options = ns.Options()
    ns.t = ns.Translator(ns.langs[ns.options.language()])
    ns.Widgets.Options(ns.options).render()

    ns.populateActions()
  })

  (function setUpBadgeClearance(){
    ns.background = false;

    window.addEventListener('load', function () {
      window.addEventListener('focus', function(){
        ns.Widgets.favicon.reset();
        ns.background = false;
      });

      window.addEventListener('blur', function(){
        ns.background = true;
      });
    });
  }());

  ns.paintScreen = function(){
    //ns.OneSignal()
    ns.Backend.getStats(
    function(data){
      if (data.response !== 'success'){
        console.log(data);
        return;
      }
      if (data.game.status == 'ready' || data.game.status == 'full'){
        ns.startGame(data.game);
        return;
      }

      var stage = data.day_status;
      clearAllTimeouts();

      $('.game_name').html(data.game.name);

      if (stage !== 'wait' && ns.background){
        ns.Widgets.favicon.badge('!');
        navigator.vibrate([200, 200, 200, 200, 500])
      }

      if (data.player_status !== 'alive'){
        var _message = ns.t.html('player.status.' + data.player_status);
        var _result = $(crel('h2')).append(_message).addClass('end-game');
        var _resultImage
        if(data.player_status != 'escaped')
          _result.css('color', 'red')

        _resultImage = $(crel('div')).addClass(data.player_status)
        var _headerWidget = LB.Widgets.Header(data);

        $('.game_container').empty().append(
          $(crel('div')).addClass('content').append(
            _headerWidget.render(),
            _result,
            _resultImage
          )
        );
        return;
      }

      ns.Game(data);

    });

  };


}(LB || {}));
