'use strict';

(function(ns){

  ns.Imager = function(images){

    var _replace = function(text){

      var emojiRegexp = /\:[a-z0-9_\-\+]+\:/g

      return text.replace(emojiRegexp, function (match) {
        var name = String(match).slice(1, -1)

        if (images[name]) {
          if (images[name].path)
            return '<img class="emojione" src="' + images[name].path +'"/>'
            // '<img class="emoji" title=":' + name + ':" alt="' + name + '" src="' + url + '/' + encodeURIComponent(name) + '.png"' + (size ? (' height="' + size + '"') : '') + ' />';

          return images[name]
        }

        return match
      })
    }

    return {
      replace: _replace
    }
  }

}(LB || {}));
