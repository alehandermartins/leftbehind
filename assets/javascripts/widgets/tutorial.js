'use strict';
(function(ns){

  ns.Widgets.Tutorial = function(stats){
    var _createdWidget = $(crel('div')).addClass('tutorial col-12');
    _createdWidget.css({
      'text-align': 'justify',
      'text-justify': 'inter-word'
    });

    var _toggler = $(crel('div')).addClass('row text-center');
    
    var _rulesLabel = $(crel('h5')).addClass('tutorial_toggler col-4 active').text('Reglas');
    var _actionsLabel = $(crel('h5')).addClass('tutorial_toggler col-4').text('Acciones');
    var _optionsLabel = $(crel('h5')).addClass('tutorial_toggler col-4').text('Opciones');

    _toggler.append(_rulesLabel, _actionsLabel, _optionsLabel);
    _createdWidget.append(_toggler);

    var _rules = $(crel('div'));
    var _intro = $(crel('div')).addClass('intro');
    _intro.html('Estás a bordo de una nave espacial. Tras meses de viaje os adentráis en una zona prohibida.\
      Las alarmas empiezan a sonar. La Inteligencia Artificial ' +  LB.t.html(':ia:') + ' de la nave toma el control:');

    var _mainPoints = $(crel('ul')).addClass('col-12');
    var _autoDestruction = $(crel('li'));
    var _scapePod = $(crel('li'));
    var _oxygen = $(crel('li'));

    _autoDestruction.html('Inicia la secuencia de autodrestrucción. Quedan ' + stats.status['day'] + ' para que la nave estalle.');
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

    var _options = $(crel('div')).addClass('text-center');
    _options.css('display', 'none');

    var _exitGame = LB.Widgets.Button('Exit Game',function(){
      document.location = "/";
    }, 10).render();


    var _languages = [
      {
        uuid: 'es',
        name: 'Español'
      },
      {
        uuid: 'en',
        name: 'English'
      }
    ]

    var _changeLanguage = LB.Widgets.Button(LB.t.text('options.change_language.label'),function(){
      LB.Widgets.ModalTargetSelector(
          _languages,
          LB.t.text('options.change_language.title')
        ).select(function(selected){
          LB.options.setLanguage(selected[0].uuid)
          document.location.reload()
        })
    }, 10).render();

    var _exportGame = LB.Widgets.Button(LB.t.text('options.export_game.label'),function(){
      bootbox.alert({title: LB.t.text('options.export_game.title'),
        message: $(crel('p')).text(LB.t.text('options.export_game.text'))
        .append(LB.generateExportLink())
      });
    }, 10).render();

    _options.append(_exitGame, _changeLanguage, _exportGame);

    _createdWidget.append(_rules, _actions, _options);

    _rulesLabel.click(function(){
      if(_rulesLabel.hasClass('active'))
        return;

      if(_actionsLabel.hasClass('active')){
        _actions.animateCss("fadeOutRight", function(){
          _actionsLabel.removeClass('active');
          _actions.css('display', 'none');
          _rulesLabel.addClass('active');
          _rules.css('display', 'block');
          _rules.animateCss("fadeInRight");
        });
      }

      if(_optionsLabel.hasClass('active')){
        _options.animateCss("fadeOutRight", function(){
          _optionsLabel.removeClass('active');
          _options.css('display', 'none');
          _rulesLabel.addClass('active');
          _rules.css('display', 'block');
          _rules.animateCss("fadeInRight");
        });
      }
    });

    _actionsLabel.click(function(){
      if(_actionsLabel.hasClass('active'))
        return;

      if(_rulesLabel.hasClass('active')){
        _rules.animateCss("fadeOutRight", function(){
          _rulesLabel.removeClass('active');
          _rules.css('display', 'none');
          _actionsLabel.addClass('active');
          _actions.css('display', 'block');
          _actions.animateCss("fadeInRight");
        });
      }

      if(_optionsLabel.hasClass('active')){
        _options.animateCss("fadeOutRight", function(){
          _optionsLabel.removeClass('active');
          _options.css('display', 'none');
          _actionsLabel.addClass('active');
          _actions.css('display', 'block');
          _actions.animateCss("fadeInRight");
        });
      }
    });

    _optionsLabel.click(function(){
      if(_optionsLabel.hasClass('active'))
        return;


      if(_rulesLabel.hasClass('active')){
        _rules.animateCss("fadeOutRight", function(){
          _rulesLabel.removeClass('active');
          _rules.css('display', 'none');
          _optionsLabel.addClass('active');
          _options.css('display', 'block');
          _options.animateCss("fadeInRight");
        });
      }

      if(_actionsLabel.hasClass('active')){
        _actions.animateCss("fadeOutRight", function(){
          _actionsLabel.removeClass('active');
          _actions.css('display', 'none');
          _optionsLabel.addClass('active');
          _options.css('display', 'block');
          _options.animateCss("fadeInRight");
        });
      }
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };

}(LB || {}));
