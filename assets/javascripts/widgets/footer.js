'use strict';
(function(ns){

	ns.Widgets.Footer = function(stats){
    var _footer = $(crel('div')).addClass('footer row col-12');

    var _timer = $(crel('div')).addClass('col-12 text-center');
    _footer.append(_timer);

    var zeroPad = function(number){
      return ('0' + number).slice(-2)
    }

    if (stats.game.style == 'turbo' && stats.game.status == 'ongoing'){
      var _refreshCoundown = function(){
        var jsseconds = Math.round(new Date().getTime() / 1000);
        var remaining = stats.game.time + parseInt(stats.game.lapse) - jsseconds;
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

        _timer.html(countdown);
      }
      _refreshCoundown();
      setInterval(_refreshCoundown, 1000);
    }

    var _dayPlannerToggler = $(crel('div')).addClass('dayPlannerToggler text-center col-4');
    var _resultsToggler = $(crel('div')).addClass('resultsToggler text-center col-4');
    var _tutorialToggler = $(crel('div')).addClass('tutorialToggler text-center col-4');

    _dayPlannerToggler.html(LB.t.html(':fist_tone5:'));
    _resultsToggler.html(LB.t.html(':punch_tone5:'));
    _tutorialToggler.html(LB.t.html(':gear:'));

    if(stats.current_slot == 0 || stats.day_status == 'wait' || stats.player_status !== 'alive'){
      _dayPlannerToggler.addClass('active');
      if(stats.current_slot == 0 || stats.player_status === 'wait')
        _resultsToggler.css('display', 'none');
    }
    else
      _resultsToggler.addClass('active');

    _footer.append(
      _dayPlannerToggler,
      _resultsToggler,
      _tutorialToggler
    );

    var activateDayPlanner = function(){
      $('.dayPlanner').addClass('active');
      $('.dayPlanner').animateCss("fadeInRight");
      _resultsToggler.removeClass('active');
      _tutorialToggler.removeClass('active');
      _dayPlannerToggler.addClass('active');
    }

    var activateResults = function(){
      $('.results').addClass('active');
      $('.results').animateCss("fadeInRight");
      _dayPlannerToggler.removeClass('active');
      _tutorialToggler.removeClass('active');
      _resultsToggler.addClass('active');
    }

    var activateTutorial = function(){
      $('.tutorial').addClass('active');
      $('.tutorial').animateCss("fadeInRight");
      _dayPlannerToggler.removeClass('active');
      _resultsToggler.removeClass('active');
      _tutorialToggler.addClass('active');
    }

    var actions = {
      'dayPlanner': activateDayPlanner,
      'results': activateResults,
      'tutorial': activateTutorial
    }

    var clickFunction = function(toggler, option){
      if(toggler.hasClass('active'))
      return;

      if(option != 'dayPlanner'){
        if($('.dayPlanner') && $('.dayPlanner').hasClass('active')){
          $('.dayPlanner').animateCss("fadeOutRight", function(){
            $('.dayPlanner').removeClass('active');
            actions[option]();
          });
        }
      }

      if(option != 'results'){
        if($('.results') && $('.results').hasClass('active')){
          $('.results').animateCss("fadeOutRight", function(){
            $('.results').removeClass('active');
            actions[option]();
          });
        }
      }

      if(option != 'tutorial'){
        if($('.tutorial') && $('.tutorial').hasClass('active')){
          $('.tutorial').animateCss("fadeOutRight", function(){
            $('.tutorial').removeClass('active');
            actions[option]();
          });
        }
      }
    }

    _dayPlannerToggler.click(function(){
      clickFunction(_dayPlannerToggler, 'dayPlanner');
    });

    _resultsToggler.click(function(){
      clickFunction(_resultsToggler, 'results');
    });

    _tutorialToggler.click(function(){
      clickFunction(_tutorialToggler, 'tutorial');
    });

    return {
      render: function(){
        return _footer;
      }
    }
  }

}(LB || {}))
