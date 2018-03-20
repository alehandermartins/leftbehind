'use strict';
(function(ns){

  ns.Widgets.Tutorial = function(stats){
    var _createdWidget = $(crel('div')).addClass('tutorial_layout');
    _createdWidget.css({
      'text-align': 'justify',
      'text-justify': 'inter-word'
    });

    var _toggler = $(crel('div')).addClass('row text-center');
    var _rulesLabel = $(crel('h5')).addClass('tutorial_toggler col-6 active').text('Reglas');
    var _actionsLabel = $(crel('h5')).addClass('tutorial_toggler col-6').text('Acciones');

    _toggler.append(_rulesLabel, _actionsLabel);
    _createdWidget.append(_toggler);

    var _rules = $(crel('div'));
    var _intro = $(crel('div')).addClass('intro');
    _intro.text('Estás a bordo de una nave espacial. Tras meses de viaje os adentráis en una zona prohibida.\
      Las alarmas empiezan a sonar. La Inteligencia Artificial (IA) de la nave toma el control.');

    var _mainPoints = $(crel('ul')).addClass('col-12');
    var _autoDestruction = $(crel('li'));
    var _scapePod = $(crel('li'));
    var _oxygen = $(crel('li'));

    _autoDestruction.html('LA IA ' +  LB.t.html(':ia:') +' inicia la secuencia de autodrestrucción. Quedan ' + stats.status['day'] + ' para que la nave estalle.');
    _scapePod.html('Provoca un cortocircuito en el control de la cápsula de escape ' + LB.t.html(':shuttle:') + '. Necesitarás ' + LB.t.html(':parts:') + ' para repararla y un ' + LB.t.html(':helmet:') + ' para escapar.');
    _oxygen.html('Suelta una neurotoxina en el aire, que lo hace inrespirable. Necesitarás ' + LB.t.html(':food:') + ' cada hora para sobrevivir.');

    _mainPoints.append(_autoDestruction, _scapePod, _oxygen);
    _rules.append(_intro, _mainPoints);

    var _actions = $(crel('div'));
    _actions.css('display', 'none');

    var _actionList = $(crel('ul')).addClass('col-12');
    Object.keys(LB.Actions(stats)).forEach(function(action){
      var _action =$(crel('li')).html(ns.t.html('action.' + action + '.tutorial'));
      _actionList.append(_action);
    });

    _actions.append(_actionList);
    _createdWidget.append(_rules, _actions);

    _rulesLabel.click(function(){
      if(_rulesLabel.hasClass('active'))
        return

      _actions.animateCss("fadeOutRight", function(){
        _actionsLabel.removeClass('active');
        _actions.css('display', 'none');
        _rulesLabel.addClass('active');
        _rules.css('display', 'block');
        _rules.animateCss("fadeInRight");
      });
    });

    _actionsLabel.click(function(){
      if(_actionsLabel.hasClass('active'))
        return

      _rules.animateCss("fadeOutRight", function(){
        _rulesLabel.removeClass('active');
        _rules.css('display', 'none');
        _actionsLabel.addClass('active');
        _actions.css('display', 'block');
        _actions.animateCss("fadeInRight");
      });
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };

}(LB || {}));
