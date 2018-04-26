'use strict';
LB.welcomePlayer = function(){
  var cg = $('.game_container');
  cg.empty();
  var _content = $(crel('div')).addClass('content welcome');

  var _welcome = $(crel('div')).addClass('welcome-selector');
  var _createRow = $(crel('div')).addClass('row welcome');
  var _createButton = LB.Widgets.Button(LB.t.html('welcome.create.label'), function(){
    _welcome.animateCss("fadeOutRight", function(){
      _welcome.css('display', 'none');
      _create.css('display', 'block');
      _create.animateCss("fadeInRight");
    });
  });

  _createRow.append(
    _createButton.render(),
  );

  var _joinRow = $(crel('div')).addClass('row welcome');
  var _joinButton = LB.Widgets.Button(LB.t.html('welcome.join.label'), function(){
    _welcome.animateCss("fadeOutRight", function(){
      _welcome.css('display', 'none');
      _join.css('display', 'block');
      _join.animateCss("fadeInRight");
    });
  });

  _joinRow.append(
    _joinButton.render(),
  );

  var _resumeRow = $(crel('div')).addClass('row welcome');
  var _resumeButton = LB.Widgets.Button(LB.t.html('welcome.resume.label'), function(){
    _welcome.animateCss("fadeOutRight", function(){
      _welcome.css('display', 'none');
      _resume.css('display', 'block');
      _resume.animateCss("fadeInRight");
    });
  });

  _resumeRow.append(
    _resumeButton.render(),
  );

  var _gameFooter = $('.game_footer').addClass('col-12');
  _gameFooter.append($(crel('h3')).html('Cooperate, betray... survive.&nbsp;&nbsp;'));

  _welcome.append(
    _createRow,
    _joinRow,
    _resumeRow
  );


  var _create = $(crel('div')).addClass('welcome-create');
  _create.append(LB.Widgets.CreateGame().render());
  _create.css('display', 'none');

  var _join = $(crel('div')).addClass('welcome-join');
  _join.append(LB.Widgets.JoinGame().render());
  _join.css('display', 'none');

  var _resume = $(crel('div')).addClass('welcome-resume');
  _resume.append(LB.Widgets.ResumeGame().render());
  _resume.css('display', 'none');

  _content.append(_welcome, _create, _join, _resume);

  var scalePlayground = function(){
    $(".game_container").css('height', window.innerHeight - $(".game_header").height() - $(".game_footer").height());
  }

  $(window).resize(function(){
    scalePlayground();
  });

  scalePlayground()

  cg.append(_content)
};
