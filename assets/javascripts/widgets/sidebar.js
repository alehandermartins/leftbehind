'use strict';
(function(ns){

	ns.Widgets.Sidebar = function(stats){
    var _sidebar = $(crel('div')).addClass('sidebar col-2');

    var _dayPlannerToggler = $(crel('div')).addClass('dayPlannerToggler text-center col-12');
    var _resultsToggler = $(crel('div')).addClass('resultsToggler text-center col-12');
    var _tutorialToggler = $(crel('div')).addClass('tutorialToggler text-center col-12');

    _dayPlannerToggler.html(LB.t.html(':fist_tone5:'));
    _resultsToggler.html(LB.t.html(':punch_tone5:'));
    _tutorialToggler.html(LB.t.html(':question:'));

    if(stats.current_slot == 0){
      _dayPlannerToggler.addClass('active');
      _resultsToggler.css('display', 'none');
    }
    else
      _resultsToggler.addClass('active');

    _sidebar.append(
      _dayPlannerToggler,
      _resultsToggler,
      _tutorialToggler
    );

    var activateDayPlanner = function(){
      $('.dayPlanner').addClass('active');
      $('.slotSelector').addClass('active');
      $('.targetSelector').removeClass('active');
      $('.actionSelector').removeClass('active');
      $(".selected-room").css('display', 'none');
      $(".selected-room").removeClass('selected-room');
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
        return _sidebar;
      }
    }
  }

}(LB || {}))
