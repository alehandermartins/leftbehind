'use strict';
(function(ns){

  ns.Widgets.Tutorial = function(stats){
    var _createdWidget = $(crel('div'));

    _createdWidget.css({
      'text-align': 'justify',
      'text-justify': 'inter-word'
    });

    var _intro = $(crel('div'));
    _intro.text('Estás a bordo de una nave espacial. Tras meses de viaje os adentráis en una zona prohibida.\
      Las alarmas empiezan a sonar. La Inteligencia Artificial (IA) de la nave toma el control.');

    _intro.css({
      'margin-bottom': '1em'
    })

    var _mainPoints = $(crel('ul')).addClass('col-12');
    var _autoDestruction = $(crel('li'));
    var _scapePod = $(crel('li'));
    var _oxygen = $(crel('li'));

    _autoDestruction.html('LA IA ' +  LB.t.html(':ia:') +' inicia la secuencia de autodrestrucción. Quedan ' + stats.status['day'] + ' para que la nave estalle.');
    _scapePod.html('Provoca un cortocircuito en el control de la cápsula de escape ' + LB.t.html(':shuttle:') + '. Necesitarás ' + LB.t.html(':parts:') + ' para repararla y un ' + LB.t.html(':helmet:') + ' para escapar.');
    _oxygen.html('Suelta una neurotoxina en el aire, que lo hace inrespirable. Necesitarás ' + LB.t.html(':food:') + ' para sobrevivir.');

    _mainPoints.append(_autoDestruction, _scapePod, _oxygen);

    _createdWidget.append(_intro);
    _createdWidget.append(_mainPoints);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };

}(LB || {}));
