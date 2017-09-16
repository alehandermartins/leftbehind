'use strict';
LB.fusion = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _headerWidget = LB.Widgets.Header(stats);
  var _playersStatus = LB.Widgets.PlayersStatus(stats);
  var _informationWidget = LB.Widgets.Information(stats);
  var _fusionWidget = LB.Widgets.Fusion(stats);
  var _content = $(crel('div')).addClass('content')

  _content.append(
    _headerWidget.render(),
    _informationWidget.render(),
    _fusionWidget.render()
  )

  dayContainer.append(
    _playersStatus.render(),
    _content
  );
};
