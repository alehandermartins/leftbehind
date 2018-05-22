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
        label: 'Join game',
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
        intro: 'There can only be one reason for you not bleeding after the injection... you are not human. You are an android. Ooohh this is not good... you realize that the IA hidden move is to detonate you once you all are in the escape pod. If you try to escape it is sure that you all will die. But you can avoid this by making some changes in your structure. However this will cost you 6 :parts:. If you ask for help, then you can be fixed with only 4 :parts:, but maybe they will get scared and disconnect you...',
        selection: {
          yes: 'Ask for help',
          no: 'Say nothing'
        },
        result: {
          informed: "Tells you that he/she is an android. The IA will detonate him/her if he/she tries to escape, killing you all. It is possible to hack the mechanism using 4 :parts:. Or you can just disconnect %{player} and forget all about this.",
          yes: 'You tell the others hoping they will help you',
          no: "You decide it's not worth taking the risk to tell the others. You will fix yourself"
        }
      },
      betray: {
        label: ':dagger:',
        intro: 'A transmission begins to sound on your intercom: "You have entered an area forbidden by the Alliance. This act of rebellion is punishable by jail, but if you cooperate we guarantee your freedom. We can not assure the same thing for your colleagues. To begin with, we want you to activate the IA ​​defense system."',
        selection: {
          yes: 'Activate defenses',
          no: 'Refuse'
        },
        result: {
          true: 'You decide to betray your colleagues and cooperate with the Alliance. You activate the IA defenses. If someone enters a room guarded by the :ia: he/she will be annihilated instantly.',
          false: "You are not betraying your colleagues.",
          alert: "Someone activated the IA defenses. If someone enters a room guarded by the :ia: he/she will be annihilated instantly"
        }
      },
      craft: {
        label: 'Craft %{resource} (3 :parts: 3 :energy:)',
        selection: 'Craft %{resource}',
        result:{
          success: '%{resource} Added to your inventory',
          fail: "You didn't have the needed materials"
        }
      },
      defend:{
        tutorial: ':defend: Defending avoids being robbed or spied. You will also know who is after you...',
        label: ':defend: Defend',
        result: {
          success: 'Success!',
          attack_defended: 'He was defending and kicked your ass!!',
          nobody_defended: 'Nobody attacked you'
        }
      },
      disconnectandroid: {
        label: ' Disconnect :robot:',
        selection: 'Disconnect %{target} :robot:',
        result: {
          success: '%{player} has disconnected %{target}.'
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
          success: 'You turn the engines on and leave... :shuttle:',
          helmet_needed: 'You need a :helmet: to survive in the :shuttle:',
          shuttle_left: 'The :shuttle: already left',
          you_left: 'You already left the ship',
          target_left: 'He already left the ship'
        }
      },
      fusion: {
        label: ':radioactive:',
        intro: 'The core of the nucleus is melting... someone has to enter to the control chamber and stop it manually. ' +
        'Only with one person entering will be enough, but the radiation is so high it will render the :helmet: of those who enter useless. If nobody enters the ship will explode',
        selection: {
          yes: 'Enter',
          no: 'Stay'
        },
        result: {
          youdied: 'You died from radiation overdose',
          otterdied: 'Died from radiation overdose',
          youentered: 'You entered the chamber',
          otterentered: 'Entered the chamber'
        }
      },
      gunsmith: {
        label: ':gun:',
        intro: '"This is the Alliance. Good job on activating the defenses. Now we need you to enable the remote controlling of the ship, so we can tow it to our station. The problem is that only %{target} has the code to enable this function. We are transmitting the blueprints of a gun :gun: to you. You can craft one at the supplies room. Do what you have to do."',
        selection: {
          yes: 'Accept',
          no: 'Refuse'  
        },
        result: {
          true: "Ypu accept. You recive the gun blueprints. Don't forget you can craft one at the supplies room.",
          false: "This is too much. You refuse to assassinate your colleagues."
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
      hackandroid: {
        label: 'Hack :robot: (1 :parts:) <strong>%{fix}</strong>',
        selection: 'Hack %{target} :robot:',
        result: {
          success: 'Hack %{target} :robot: <strong>%{fix}</strong>',
          no_fixing_materials: "You didn't have the needed :parts:",
          already_fixed: "Already fixed.",
          revealed: "You discover that %{player} is an android. The IA will detonate him/her if he/she tries to escape, killing you all. It is possible to hack the mechanism using 6 :parts:. Or you can just disconnect %{player} and forget all about this.",
          revealed_safe: "You discover that %{player} is an android, but he/she is no longer a threat."
        }
      },
      hitman: {
        intro: "This is it. You point your gun to %{target} and ask him for the code... but what if he/she refuses?",
        intro2: "%{target} points a gun at you: \"Give me the activation code for the ship's remote control\". %{target} has betrayed you. He/She has been the one who activated the IA defenses, and now he/she wants the activation code for the remote control of the ship, in order to deliver you as criminals to the Alliance. Only you have the code. If you give it to him/she, the Alliance will arrive one hour before the ship self-destruction. If you do not give it, who knows what %{target} is capable of doing...",
        selection: {
          yes: "Shoot anyway",
          no: "Don't shoot"
          yes2: "Give code",
          no2: "Refuse"
        }
      },
      inject: {
        label: ':syringe:',
        intro: 'You fond a syringe with what appears to be an antidote for the neurotoxin. If you inject yourself you will no need :food: anymore. But... is this safe?',
        selection: {
          yes: 'Inject',
          no: 'Nevermind'
        },
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
          success: 'You found %{resources} (%{location})',
          fail: 'You found nothing (%{location})',
          full: "You can't carry more %{resources} (%{location})"
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
          success: 'You stole %{resources} from %{target}',
          empty: 'He had nothing'
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
          success: "%{location} unlocked"
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
        selection: 'Repair the :shuttle:',
        tutorial: ':work: Repair: fix a percentaje of the escape shuttle.',
        result: {
          success: 'You repaired the :shuttle:',
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
        radiated: 'Too much radiation fries your brain',
        disconnected: 'You have been disconnected',
        blown: '%{player} was an android. The IA detonates %{player} as soon as you start the escape pod engines.',
        detonated: 'The IA detonates you as soon as you start the escape pod engines. No one survives.'
      }
    },
    buttons: {
      start: 'Start',
      send: 'Send',
    }
  }
}(LB || {}))
