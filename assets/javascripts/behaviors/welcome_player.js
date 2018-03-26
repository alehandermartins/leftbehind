'use strict';
LB.welcomePlayer = function(){
  var cg = $('.game_container');
  cg.empty();
  var _gameFooter = $('.game_footer');
  //_gameFooter.append($(crel('h3')).html('Cooperate, betray... survive.&nbsp;&nbsp;'));

  var _content = $(crel('div')).addClass('content')

  _content.append(
    LB.Widgets.CreateGame().render(),
    LB.Widgets.JoinGame().render(),
    LB.Widgets.ResumeGame().render()
  );

  cg.append(_content)
};
