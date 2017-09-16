'use strict';
LB.gameEvents = function(stats){

  var behaviorsMap = {
    defaultEvent: LB.defaultEvent,
    voting: LB.vote,
    fusion: LB.fusion
  };

  behaviorsMap[stats.players[LB.playerUuid()]['event']](stats);
};
