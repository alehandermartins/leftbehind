'use strict';
(function(ns){

	ns.Widgets.Sidebar = function(stats){
    var _sidebar = $(crel('div')).addClass('sidebar col-2');

    var _dayPlannerToggler = $(crel('div')).addClass('dayPlannerToggler text-center col-12');
    var _resultsToggler = $(crel('div')).addClass('resultsToggler text-center col-12');

    _dayPlannerToggler.html(LB.t.html(':fist_tone5:'));
    _resultsToggler.html(LB.t.html(':punch_tone5:'));

    if(stats.current_slot == 0){
      _dayPlannerToggler.addClass('active');
      _resultsToggler.css('display', 'none');
    }
    else
      _resultsToggler.addClass('active');

    _sidebar.append(
      _dayPlannerToggler,
      _resultsToggler
    );

    var activateDayPlanner = function(){
      $('.dayPlanner').addClass('active');
      $('.dayPlanner').animateCss("fadeInRight");
      _dayPlannerToggler.addClass('active');
      _resultsToggler.removeClass('active');
    }

    var activateResults = function(){
      $('.results').addClass('active');
      $('.results').animateCss("fadeInRight");
      _dayPlannerToggler.removeClass('active');
      _resultsToggler.addClass('active');
    }

    _dayPlannerToggler.click(function(){
     if(_dayPlannerToggler.hasClass('active'))
      return;

      if($('.targetSelector') && $('.targetSelector').hasClass('active')){
        $('.targetSelector').animateCss("fadeOutRight", function(){
          $('.targetSelector').removeClass('active');
          activateDayPlanner();
        });
      }

      if($('.actionSelector').hasClass('active')){
        $('.actionSelector').animateCss("fadeOutRight", function(){
          $('.actionSelector').removeClass('active');
          $(".selected-room").css('display', 'none');
          $(".selected-room").removeClass('selected-room');
          activateDayPlanner();
        });
      }

      if($('.results') && $('.results').hasClass('active')){
        $('.results').animateCss("fadeOutRight", function(){
          $('.results').removeClass('active');
          activateDayPlanner();
        });
      }
    });

    _resultsToggler.click(function(){
     if(_resultsToggler.hasClass('active'))
      return;

      if($('.targetSelector') && $('.targetSelector').hasClass('active')){
        $('.targetSelector').animateCss("fadeOutRight", function(){
          $('.targetSelector').removeClass('active');
          activateResults();
        });
      }

      if($('.actionSelector').hasClass('active')){
        $('.actionSelector').animateCss("fadeOutRight", function(){
          $('.actionSelector').removeClass('active');
          $(".selected-room").css('display', 'none');
          $(".selected-room").removeClass('selected-room');
          activateResults();
        });
      }

      if($('.dayPlanner') && $('.dayPlanner').hasClass('active')){
        $('.dayPlanner').animateCss("fadeOutRight", function(){
          $('.dayPlanner').removeClass('active');
          activateResults();
        });
      }
    });

    return {
      render: function(){
        return _sidebar;
      }
    }
  }

}(LB || {}))