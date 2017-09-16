'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.GameCreated = function(data){
    if (data['status'] == 'success'){
      history.pushState({}, 'created game', '/play/' + data.uuid + location.hash);
      LB.paintScreen();
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason,
        callback: function(){
          document.location.reload();
        }
      });
    }
  };

  ns.Events.JointGame = function(data){
    if (data['status'] == 'success'){
      history.pushState({}, 'joint game', '/play/' + data.uuid + location.hash);
      LB.paintScreen();
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason,
        callback: function(){
          document.location.reload();
        }
      });
    }
  };

  ns.Events.Play = function(game){
    history.pushState({}, 'play game', '/play/' + game + location.hash);
    LB.paintScreen();
  };

  ns.Events.SentSelections = function(data){
    if (data['status'] == 'success'){
      LB.paintScreen();
    }
    else {
      if (data.reason == 'not_enough_selected')
      bootbox.alert({
        title: ns.t.html('events.actions.title'),
        message: ns.t.html('events.actions.message'),
        callback: function(){
          $('.spinning-button').attr('disabled', false).find('.spinner').remove();
        }
      });
    }
  };

  window.onpopstate = function(state){
    // console.log(location.pathname);
    // console.log(state);

    clearAllTimeouts();

    bootbox.hideAll();
    if (location.pathname == '/'){
      LB.welcomePlayer();
      return;
    }

    LB.paintScreen();
  };

}(LB || {}));
