'use strict';
LB.Game = function(stats){

  var stagesMap = {
    actions: LB.DayPlanning,
    events: LB.gameEvents,
    wait: LB.Wait
  }

  var _stageWidget = stagesMap[stats.day_status](stats);
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');

  var _headerWidget = LB.Widgets.Header(stats);
  var _playGround = $(crel('div')).addClass('playground row'); 

  var _sidebar = LB.Widgets.Sidebar(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _tutorialWidget = LB.Widgets.Tutorial(stats);

  _playGround.append(
    _sidebar.render(),
    _stageWidget.render(),
    _resultsWidget.render(),
    _tutorialWidget.render()
  );
  
  _content.append(
    _headerWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );
}

LB.gameEvents = function(stats){

  var eventsMap = {
    defaultEvent: LB.DefaultEvent,
    voting: LB.Voting,
    fusion: LB.Fusion
  };

  return eventsMap[stats.players[LB.playerUuid()]['event']](stats);
};
