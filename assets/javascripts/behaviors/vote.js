'use strict';
LB.vote = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _playersStatus = LB.Widgets.PlayersStatus(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _votingWidget = LB.Widgets.Voting(stats);
  var _content = $(crel('div')).addClass('content')

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _votingWidget.render()
  )


  dayContainer.append(
    _playersStatus.render(),
    _content
  );
};
