'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.en = {
    options: {
      change_language: {
        title: 'Choose language:',
        label: 'Change language'
      },
      export_game: {
        label: 'Continue game elsewhere',
        title: 'So you want to take this game with you?',
        text: 'No prob mate open this link wherever you want to continue with your game: '
      }
    },
    locations: {
      1:'Bridge',
      2:'Cabins',
      3:'Weapons bay',
      4:'Infirmary',
      5:'Engines room',
      6:'Supplies room',
      7:'Life support',
      8:'Escape shuttle'
    },
    welcome: {
      create: {
        label:'New game'
      },
      join: {
        label: 'Join a game',
        recruited: 'You have been recruited along %{players} as a crew member on %{game} do you want to join in?'
      },
      resume: {
        label: 'Resume',
        select: 'Select your ongoing game'
      },
      no_games: 'No available games, create your own :)',
      game_name: 'game name',
      player_name: 'player name'
    },
    start:{
      intro: 'You are part of the crew of a prospecting vessel near the planet of Gliese 832 c, a potential habitable planet. As you approach Gliese the sensors of the ship begin to detect high levels of radiation... one electronic device after another start to fail. The main engine of the ship is losing power, broken beyond reparation. In ten days the ship will crash into Gliese. Your only hope is to use the escape shuttle, but its control panel is broken too. There must be a way out...',
      players: 'PLAYERS:',
      invite: 'Invite Someone else',
      roles: {
        captain: 'captain',
        pilot: 'pilot',
        mechanic: 'mechanic',
        scientist: 'scientist'
      },
      style: {
        label: 'Choose the max duration for each phase.',
        gentle: 'Gentle',
        turbo: 'Turbo'
      }
    },
    invite: {
      title: 'Recruit crew members',
      link: 'Send them this link: ',
      click: 'click here: ',
      scan: 'or make them scan this',
      recruit: 'Recruit a random player'
    },
    action: {
      android: {
        label: ':robot:',
        result: {
          informed: "%{player} Tells you that he/she is an android. The IA will detonate %{player} if he/she tries to escape, killing you all. It can be fixed by changing %{player}'s structure, using 4 :parts:. Or you can just disconnect %{player} and forget all about this.",
          yes: 'You tell the others hoping they will help you',
          no: "You decide it's not worth taking the risk to tell the others. You will fix yourself"
        }
      },
      hackandroid: {
        label: 'Hack :robot: (1 :parts:) <strong>%{fix}</strong>',
        selection: 'Hack %{target} :robot:',
        result: {
          success: 'Well done. Keep it up.',
          no_fixing_materials: "You didn't have the needed :parts:",
          finally_fixed: "Fixed!! %{player} is no longer a threat",
          already_fixed: "Already fixed."
        }
      },
      disconnectandroid: {
        label: ' Disconnect :robot:',
        selection: 'Disconnect %{target} :robot:',
        result: {
          success: '%{player} has been disconnected.'
        }
      },
      craft: {
        modalTitle: 'Choose what you need to craft',
        list: ':pick: ( 3 :parts:)',
        label: 'Craft a :pick:',
        result:{
          success: 'Added to your inventory',
          fail: "You didn't have the needed :parts:"
        }
      },
      defend:{
        tutorial: ':defend: Defending avoids being robbed or spied. You will also know who is after you...',
        label: ':defend: Defend',
        result: {
          attack_defended: 'He was defending and kicked your ass!!',
          spy_defended: '%{player} was spying on you.',
          steal_defended: '%{player} tried to steal from you.',
          nobody_defended: 'Nobody attacked you'
        }
      },
      eat: {
        label: ':skull:',
        result: {
          youstarved: 'You died from lack of oxigen',
          otterstarved: 'Died from lack of oxigen'
        }
      },
      escape:{
        label: 'Escape',
        tutorial: 'Escapar: It is time to leave this death trap, do you have your helmet on?...',
        result: {
          success: 'You turn the engines on and leave...',
          helmet_needed: 'You need a :helmet: to survive in the :shuttle:',
          shuttle_left: 'The :shuttle: already left',
          you_left: 'You already left the ship',
          target_left: 'He already left the ship'
        }
      },
      fusion: {
        label: ':radioactive:',
        result: {
          youdied: 'You died from radiation overdose',
          otterdied: 'Died from radiation overdose',
          youentered: 'You entered the chamber',
          otterentered: 'Entered the chamber'
        }
      },
      hack: {
        tutorial: ":computer: Hack: The IA won't be able to attack this room.",
        label: 'Hack (:energy: 2)',
        selection: 'Hack: %{location}',
        result: {
          no_materials: "You didn't have the needed :energy:",
          redundancy: "Already hacked",
          success: "This room is safe now"
        }
      },
      inject: {
        label: ':syringe:',
        result: {
          injected: 'You injected yourself. You can now breath toxic air',
          android: 'You injected yourself. You can now breath toxic air. But something is odd... you did not bleed after the injection.',
          no: "You decide it's not worth taking the risk"
        }
      },
      oxygen: {
        tutorial: ":food: You will generate 1 bottle of oxygen.",
        label: 'Generate :food:',
        result: {
          fail: 'You reached the oxygen limit',
          success: 'You produced 1 :food:'
        }
      },
      none: {
        label: 'Default action'
      },
      search: {
        label: ':search: Search',
        selection: ':search: Search: %{location}',
        tutorial: ':search: Search: You will find :parts: or :energy:.',
        result: {
          nothing: 'You found nothing. ',
          bounty: 'You found %{resources}',
          itemfound: 'You found a %{item}.',
          itemfounder: '%{founder} found a %{item}.'
        }
      },
      share: {
        label: 'Give %{resource}',
        selection: 'Give %{resource} to %{target}',
        tutorial: 'Give: transfers resources to another player',
        result: {
          teamReceived: ':arrows_clockwise: The :team: received: ',
          youReceived: ':arrows_clockwise: You received: ',
          personalShare: 'You: %{resources}'
        }
      },
      spy:{
        label: 'Spy',
        selection: 'Spy on %{target}',
        tutorial: 'Spy: will let you know what a player was doing at an specific time. You will also know his/her inventory.',
        targetInventory: '%{target} Inventory: %{resources}'
      },
      steal:{
        label: 'Steal :helmet:',
        selection: 'Steal %{resource} from %{target}',
        tutorial: 'Steal: transfers resources from another player.',
        result: {
          empty: 'He had nothing',
          bounty: 'You stole %{resources}'
        }
      },
      playdead: {
        label: {
          0: 'He did not move a bit',
          1: 'He is pretty much dead',
          2: 'He moved!!!... No...it was just a mice',
          3: 'Dead, maybe I can steal something from his pockets...'
        }
      },
      unlock: {
        label: 'Unlock (:energy: 2)',
        selection: 'Unlock: %{location}',
        tutorial: ':lock: Unlock: Opens a locked room.',
        result: {
          no_materials: "You didn't have the needed :energy:",
          redundancy: "Already unlocked",
          success: "Unlocked"
        }
      },
      vote: {
        label: ':ballot_box: Results: ',
        result: {
          votes: '%{player}: %{votes} votes.',
          winner: 'Winner: %{players}',
          winners: 'Winners: %{players}'
        }
      },
      work:{
        label: ':work: Repair the :shuttle: (:parts: 1)',
        tutorial: ':work: Repair: fix a percentaje of the escape shuttle.',
        result: {
          success: 'Well done, you are closer...',
          broken_shuttle: 'The :shuttle: still needs fixing',
          no_fixing_materials: "You didn't have the needed :parts:",
          already_fixed: 'The :shuttle: is already fixed',
        }
      }
    },
    player: {
      inventory: 'Inventory: %{resources}',
      status: {
        dead: 'You died of suffocation',
        killed: 'The IA found you',
        escaped: 'Congratulations, you managed to escape... for now...',
        trapped: 'You... were... Left Behind.',
        crashed: 'The IA destroys the ship, killing everyone inside... you were not able to escape on time',
        exploded: 'The ship explodes... nobody had the guts to do what should had been done',
        radiated: 'Too much radiation fries your brain'
      }
    },
    events: {
      actions: {
        title: 'Ooops!',
        message: "You didn't select enough actions, you must schedule your whole :day: planning before sending"
      },
      voting: {
        intro:'There are %{alive} people alive, but only %{food} ' +
          ':food: left. Chose %{votes} who will not eat from :team:\'s :food:',
        title: 'Ooops!',
        message: "The numbers don't add up, you shoud vote %{votes} people"
      },
      fusion: {
        intro: 'The core of the nucleus is melting... someone has to enter to the control chamber and stop it manually. ' +
        'Only with one person entering will be enough, but the radiation is so high it will render the :helmet: of those who enter useless. If nobody enters the ship will explode',
        yes: 'Enter',
        no: 'Stay'
      },
      inject: {
        intro: 'You fond a syringe with what appears to be an antidote for the neurotoxin. If you inject yourself you will no need :food: anymore. But... is this safe?',
        yes: 'Inject',
        no: 'Nevermind'
      },
      android: {
        intro: 'There can only be one reason for you not bleeding after the injection... you are not human. You are an android. Ooohh this is not good... you realize that the IA hidden move is to detonate you once you all are in the escape pod. If you try to escape it is sure that you all will die. But you can avoid this by making some changes in your structure. However this will cost you 4 :parts:. You can ask your teammates for help, but maybe they will get scared and disconnect you...',
        yes: 'Ask for help',
        no: 'Say nothing'
      }
    },
    buttons: {
      start: 'Start',
      send: 'Send',
    },
    results: {
      label: 'Results %{day}:',
      general: 'GENERAL INFO'
    },
    logs: {
      day: 'Hour %{day}:',
      empty: 'Your logs are empty.'
    },
    tutorial:{
      actions: {
        title: 'Tutorial: Selecting actions',
        message: 'Each :day: you are allowed to perform 4 actions. Actions are resolved in chronological order once every player has chosen how to spend the :day:. In order to escape you will need to gather different resources. YOU WILL CONSUME 1 :food: AT THE END OF EACH :day:. Be sure to have at least one piece of :food: by the end of the :day: or you will die. Choose wisely.'
      },
      sharing: {
        title: 'Tutorial: Sharing',
        message: 'Now it is time to see how well you performed through the :day:. Now you can share some of your resources. YOU WILL ALL CONSUME 1 :food: FROM THE :team: resources. If there were not enough :food: for everybody you will have to decide who eats and who starves to death in the next phase.'
      },
      events:{
        title: 'Tutorial: Events',
        message: 'Things happen...'
      },
      wait:{
        title: 'Tutorial: Wait',
        message: 'The :team: is still taking their decisions, wait patiently until the next phase.'
      }
    }
  }
}(LB || {}))
