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

  var zeroPad = function(number){
    return ('0' + number).slice(-2)
  }

  ns.paintScreen = function(){
    ns.Backend.getStats(
    function(data){
      if (data.response !== 'success'){
        console.log(data);
        return;
      }
      if (data.game.status == 'ready'){
        ns.startGame(data.game);
        return;
      }

      var stage = data.day_status;
      clearAllTimeouts();

      $('.game_name').html(data.game.name);

      if (data.game.style == 'turbo' && data.game.status == 'ongoing'){
        var _refreshCoundown = function(){
          var jsseconds = Math.round(new Date().getTime() / 1000);
          var remaining = data.game.time + parseInt(data.game.lapse) - jsseconds;
          var hours = Math.floor(remaining / 3600);
          var minutes = Math.floor((remaining - hours * 3600) / 60);
          var seconds = ((remaining - hours * 3600) - minutes *60);

          if (remaining <= 0){
            clearAllTimeouts();
            LB.paintScreen();
          }

          var countdown = zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds);
          if (hours == 0)
            countdown = zeroPad(minutes) + ':' + zeroPad(seconds);

          $('.timer').html(countdown);
        }
        _refreshCoundown();
        setInterval(_refreshCoundown, 1000);
      }

      if (stage !== 'wait' && ns.background){
        ns.Widgets.favicon.badge('!');
        navigator.vibrate([200, 200, 200, 200, 500])
      }

      if (data.player_status !== 'alive'){
        var _message = ns.t.html('player.status.' + data.player_status);
        var _result = $(crel('h2')).append(_message).addClass('end-game');
        var _resultImage
        if(data.player_status == 'killed'){
          _result.css('color', 'red')
          _resultImage = $(crel('div')).addClass('killed')
        }
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

      var behaviorsMap = {
        actions: ns.selectActions,
        sharing: ns.share,
        events: ns.gameEvents,
        wait: ns.wait
      };

      behaviorsMap[stage](data);
      // if (ns.Cache.lastStatus != stage){
      //   ns.Widgets.StageTutorial(stage).render();
      //   ns.Cache.lastStatus = stage;
      // }
    });
  };

}(LB || {}));
