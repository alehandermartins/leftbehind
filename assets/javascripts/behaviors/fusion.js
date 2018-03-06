'use strict';
LB.fusion = function(stats){
  var dayContainer = $('.game_container');
  dayContainer.empty();

  var _content = $(crel('div')).addClass('content');
  var _playGround = $(crel('div')).addClass('playground row'); 
  var _sidebar = LB.Widgets.Sidebar(stats);

  var _results = $(crel('div')).addClass('results active col-10');
  var _dayPlanner = $(crel('div')).addClass('dayPlanner col-10');

  var _headerWidget = LB.Widgets.Header(stats);
  var _resultsWidget = LB.Widgets.Results(stats);
  var _fusionWidget = LB.Widgets.Fusion(stats);

  _playGround.append(
    _sidebar.render(),
    _results,
    _dayPlanner
  );

  _results.append(
    _resultsWidget.render()
  );

  _dayPlanner.append(
    _fusionWidget.render()
  );
  
  _content.append(
    _headerWidget.render(),
    _playGround
  );

  dayContainer.append(
    _content
  );
};
