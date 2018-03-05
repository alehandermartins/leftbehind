'use strict';

(function(ns){

  ns.Translator = function(language){

    var imager = ns.Imager(ns.customImages)

    var _text = function(key, interpolations){

      var translatedKey = key.split('.').reduce(function(prev, curr){
        if (prev == null || !prev.hasOwnProperty(curr))
          return null

        return prev[curr]
      }, language)

      if ('string' != typeof translatedKey)
        translatedKey = key

      if (!interpolations)
        return translatedKey

      return translatedKey.replace(/%\{(.+?)\}/g, function(_, subkey){
        if (!interpolations.hasOwnProperty(subkey))
          return '_' + subkey + '_'

        return interpolations[subkey]
      })
    }

    var _html = function(key, interpolations){
      console.log(key)
      var translated = _text(key, interpolations)

      return emojione.shortnameToImage(imager.replace(translated))
    }

    return {
      text:_text,
      html:_html
    }
  }

  // ns.t = ns.Translator('en')
}(LB || {}));
