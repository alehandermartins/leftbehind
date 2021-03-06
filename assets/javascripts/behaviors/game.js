'use strict';
LB.Game = function(stats){

  $(".game_header").empty();
  $(".game_footer").empty();

  var stagesMap = {
    actions: LB.DayPlanning,
    events: LB.Event,
    wait: LB.Wait,
    dead: LB.EndGame
  }

  var _stageWidget = stagesMap[stats.stage](stats);
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');

  var _headerWidget = LB.Widgets.Header(stats);
  var _playGround = $(crel('div')).addClass('playground row');

  var _footer = LB.Widgets.Footer(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _tutorialWidget = LB.Widgets.Tutorial(stats);

  _playGround.append(
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

  $(".game_footer").append(
    _footer.render()
  );

  var scalePlayground = function(){
    $(".game_container").css('height', window.innerHeight - $(".game_header").height() - $(".game_footer").height());
  }

  $(window).resize(function(){
    scalePlayground();
  });

  scalePlayground()
}
