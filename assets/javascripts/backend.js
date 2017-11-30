'use strict';

(function(ns){

  ns.Cache = {};

  ns.Backend = (function(){

    var _send = function(url, data, callback, cached){
      if (cached) {
        if (ns.Cache[url] && ns.Cache[url][JSON.stringify(data)]) {
          callback(ns.Cache[url][JSON.stringify(data)]);
          console.log('cache hit!')
          return;
        }
        else{
          console.log('cache miss!');
          console.log(url);
        }
      }

      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: 'application/json'
      })
      .done(function(response) {
        if (cached){
          ns.Cache[url] = ns.Cache[url] || {};
          ns.Cache[url][JSON.stringify(data)] = response;
        }

        if (callback)
          callback(response);
      })
      .fail(function(error) {
        console.log("error");
        console.log(url)
        console.log(error)
      });
    };

    var _createGame = function(gameName, type, password, host, callback){
      _send(
        '/games/create',
        {
          name: gameName,
          type: type,
          password: password,
          player: host
        },
        callback
      );
    };

    var _recruit = function(){
      _send(
        '/bots/url',
        {
          game: LB.currentGame()
        },
        function(response){
          console.log(response)
          if (response.status == 'success'){
            _send(
            response.url,
            {
              game: response.uuid
            })

            return
          }

          bootbox.alert({
            title: 'error',
            message: 'Cannot recruit a bot right now, try again later or reach support',
          });
        }
      );
    }

    var _pingBots = function(){
      _send(
        '/bots/url',
        {
          game: LB.currentGame()
        },
        function(response){
          if (response.status == 'success'){
            _send(response.url, {})
          }
        },
        true
      )
    }

    var _joinGame = function(gameUuid, player, callback){
      _send(
        '/games/join',
        {
          uuid: gameUuid,
          player: player
        },
        callback
      );
    };

    var _gameReady = function(data, callback){
      _send(
        '/games/ready',
        data,
        function(data){
          callback(data);
        }
      );
    };

    var _availableGames = function(callback){
      _send(
        '/games/available',
        {},
        function(data){
          callback(data);
        }
      );
    };

    var _ongoingGames = function(uuid, callback){
      _send(
        '/games/ongoing',
        {
          player_uuid: uuid
        },
        function(data){
          callback(data);
        }
      );
    };

    var _daySelections = function(data, callback){
      _pingBots()

      _send(
        '/actions/send-selected',
        data,
        function(data){
          callback(data);
        }
      );
    };

    var _players = function(callback){
      _send(
        '/games/players',
        {
          game_uuid: LB.currentGame()
        },
        function(data){
          callback(data);
        }
      );
    };

    var _gameName = function(callback){
      _send(
        '/games/game-name',
        {
          game_uuid: LB.currentGame()
        },
        function(data){
          callback(data);
        },
        true
      );
    };

    var _notifyMe = function(data){
      _send(
        '/games/notify_me',
        data,
        function(data){
        },
        true
      );
    };

    var _fiutur = function(data, callback){
      _send(
        '/beholder/fiutur',
        data,
        function(data){
          callback(data.game_status);
        },
        true
      );
    };

    var _past = function(data, callback){
      _send(
        '/beholder/past',
        data,
        function(data){
          callback(data.game_status);
        },
        true
      );
    };

    var _getStats = function(callback){
      if (!!!LB.currentGame()){
        return
      };
      _send(
        '/games/get-stats',
        {
          game_uuid: LB.currentGame(),
          player_uuid: LB.playerUuid()
        },
        function(data){
          callback({
            response: data.status,
            day_status: data.stats.game_stats.players[ns.playerUuid()].stage,
            game: data.stats.game_stats.game,
            locations: data.stats.game_stats.locations,
            current_slot: parseInt(data.stats.game_stats.current_slot),
            status: {
              day: parseInt(10 - (data.stats.game_stats.current_slot / 6)) + 'h',
              shuttle: (10 - data.stats.game_stats.escape_shuttle) * 10 + '%'
            },
            player_status: data.stats.game_stats.players[ns.playerUuid()].status,
            players: data.stats.game_stats.players,
            personal: data.stats.personal_stats.inventory,
            personal_info: data.stats.personal_stats.information,
            team: {
              parts: data.stats.team_stats.inventory.parts,
              energy: data.stats.team_stats.inventory.energy
            },
            team_info: data.stats.team_stats.information
          }
          );
        }
      );
    };

    var _startGame = function(style, lapse, callback){
      if (!!!LB.currentGame()){
        return
      };
      _send(
        '/games/start',
        {
          uuid: LB.currentGame(),
          player: LB.playerUuid(),
          style: style,
          lapse: lapse
        },
        function(data){
          if (data['status'] == 'success'){
            callback(data.uuid);
          }
          else {
            bootbox.alert({
              title: 'error',
              message: data.reason,
              callback: function(){
                document.location.reload();
              }
            });
          }
        }
      );
    };

    return {
      createGame: _createGame,
      joinGame: _joinGame,
      gameReady: _gameReady,
      availableGames: _availableGames,
      ongoingGames: _ongoingGames,
      daySelections: _daySelections,
      send: _send,
      getStats: _getStats,
      players: _players,
      gameName: _gameName,
      fiutur: _fiutur,
      past: _past,
      startGame: _startGame,
      recruit: _recruit,
      notifyMe: _notifyMe
    };

  }());

}(LB || {}));
