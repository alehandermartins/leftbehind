'use strict';

window.crel = function(type){
  return document.createElement(type)
};

String.prototype.capitalize = function(lower) {
  return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/, function(a) { return a.toUpperCase(); });
};

Array.prototype.delete = function(element){
  var index = this.indexOf(element);
  if (index < 0)
    return;
  this.splice(index, 1);
};

Object.values = function(o) {
  return Object.keys(o).map( function (key){
    return o[key];
  });
};


(function(w){
  var originalSetTimeout = w.setTimeout;

  w.setTimeout = function(fn, delay){
    w.timers = w.timers || [];

    var generatedTimeout = originalSetTimeout(function(){
      fn();
      w.timers.delete(generatedTimeout);
    }, delay);

    w.timers.push(generatedTimeout);
  };

  w.setInterval = function(fn, delay){
    setTimeout(function intervalFunction(){
      fn();
      setTimeout(intervalFunction, delay);
    }, delay);
  };

  w.clearAllTimeouts = function(){
    if (!w.timers)
      return;
    w.timers.forEach(function(id){
      clearTimeout(id);
    });
    w.timers = [];
  };
}(window));

(function(ns){

  ns.generateExportLink = function(){
    var link = location.origin + '/play/' + ns.currentGame() + '#' + ns.playerUuid();
    return $(crel('a')).attr('href', link).text(link);
  };

  var fingerprintOptions = {
    excludeUserAgent : false,
    excludeLanguage : false,
    excludeColorDepth : false,
    excludeScreenResolution : true,
    detectScreenOrientation : false,
    excludeTimezoneOffset : false,
    excludeSessionStorage : false,
    excludeIndexedDB : false,
    excludeAddBehavior : false,
    excludeOpenDatabase : false,
    excludeCpuClass : false,
    excludePlatform : false,
    excludeDoNotTrack : false
  };

  ns.playerUuid = function(){
    var importedFingerprint = location.hash.slice(1);
    if (importedFingerprint.length > 0) {
      return importedFingerprint;
    }

    var savedFingerprint = localStorage['player-id'];
    if (savedFingerprint) {
      return savedFingerprint;
    }

    var calculatedPlayerUuid = new Fingerprint2(fingerprintOptions).get();
    localStorage['player-id'] = calculatedPlayerUuid;
    return calculatedPlayerUuid;
  };

  ns.currentGame = function(){
    return location.pathname.split('/').pop();
  };

  //Animation callbacks
  $.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function() {
        if (typeof callback === 'function')
          callback();
        
        $(this).removeClass('animated ' + animationName);
      });

      return this;
    },
  });

  return ns;
}(LB || {}));
