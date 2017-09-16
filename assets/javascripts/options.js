'use strict';
(function(ns){

  ns.Widgets = ns.Widgets || {}

  ns.Widgets.QuickModalSelector = function(origin, label, callback){
    var mts = ns.Widgets.TargetSelector(origin, 1, callback);
    return {
      render: function(){
        bootbox.alert({
          title: label.capitalize(true),
          message: mts.render()
        });
      }
    };
  };

  ns.Widgets.Options = function(options){
    var _options = [
      {
        uuid: 'language',
        name: ns.t.text('options.change_language.label')
      },
      {
        uuid: 'export',
        name: ns.t.text('options.export_game.label')
      }
    ]

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

    var actions = {
      'export': function(){
        bootbox.alert({title: ns.t.text('options.export_game.title'),
          message: $(crel('p')).text(ns.t.text('options.export_game.text'))
          .append(ns.generateExportLink())
        })
      },
      language: function(){
        ns.Widgets.ModalTargetSelector(
          _languages,
          ns.t.text('options.change_language.title')
        ).select(function(selected){
          options.setLanguage(selected[0].uuid)
          document.location.reload()
        })
      }
    }

    var _render = function(){
      $('.options')
        .html(ns.t.html(':gear:'))
        .on('click', function(){
          ns.Widgets.QuickModalSelector(_options, 'Options', function(selection){
            actions[selection[0].uuid]()
          }).render()
        })
    }

    return {
      render: _render
    }

  }

  ns.Options = function(){
    var localStorageKey = 'LeftBehind'

    if (!localStorage[localStorageKey])
      localStorage[localStorageKey] = JSON.stringify({language: 'es'})

    var gameStorage = JSON.parse(localStorage[localStorageKey])

    return {
      language: function(){
        return gameStorage.language
      },
      setLanguage: function(lang){
        gameStorage.language = lang
        localStorage[localStorageKey] = JSON.stringify(gameStorage)
      }
    }
  }
}(LB || {}));
