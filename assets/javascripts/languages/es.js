'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.es = {
    options: {
      change_language: {
        title: 'Escoge idioma:',
        label: 'Cambiar idioma'
      },
      export_game: {
        label: 'Seguir jugando desde otro sitio',
        title: '¿Quieres llevarte la partida contigo?',
        text: 'Abre este enlace desde donde quieras continuarla: '
      }
    },
    locations: {
      1:'Puente de mando',
      2:'Camarotes',
      3:'Armería',
      4:'Enfermería',
      5:'Sala de motores',
      6:'Almacén',
      7:'Soporte vital',
      8:'Cápsula de escape'
    },
    welcome: {
      create: {
        label:'Nueva partida'
      },
      join: {
        label: 'Únete a una partida',
        recruited: 'Has sido reclutado junto con %{players} como miembro de la tripulación en %{game}, ¿quieres unirte?'
      },
      resume: {
        label: 'Continúa',
        select: 'Selecciona tu partida en marcha'
      },
      no_games: 'No hay juegos disponibles, crea el tuyo :)',
      game_name: 'nombre juego',
      player_name: 'nombre jugador'
    },
    start:{
      intro: 'Eres parte de la tripulación de una nave de prospección estacionada cerca del planeta Gliese 832 c, potencialmente habitable. Al aproximaros a Gliese los sensores de la nave empiezan a detectar altos niveles de radiación... uno tras otro todos los aparatos electrónicos dejan de funcionar. El núcleo de la nave está perdiendo potencia y es imposible de reparar. En diez días la nave se estrellará contra Gliese. Tu única esperanza es utilizar la cápsula de escape, pero su panel de control está destrozado. Debe haber alguna forma de salir...',
      players: 'JUGADORES:',
      invite: 'Invita a alguien',
      roles: {
        captain: 'capitán',
        pilot: 'piloto',
        mechanic: 'mecánico',
        scientist: 'científico'
      },
      style: {
        label: 'Elige la duración máxima de cada fase.',
        gentle: 'Gentil',
        turbo: 'Turbo'
      }
    },
    invite: {
      title: 'Recluta a tripulantes',
      link: 'Envía este link: ',
      click: 'click aquí: ',
      scan: 'o haz que escaneen esto',
      recruit: 'Invita a alguien al azar'
    },
    action: {
      android: {
        label: ':robot:',
        intro: 'Solamente puede haber una razón por la cual no has sangrado después de la inyección... no eres humano. Eres un androide. Ufff vaya desastre... te das cuenta de que el as en la manga de la IA es detonarte una vez estéis todos en la cápsula de escape. Si intentas escapar con los demás todos moriréis. Puedes evitarlo haciendo algunos cambios en tu estructura. Sin embargo te costará 6 :parts:. Si pides ayuda a tus compañeros sólo necesotarás 4 :parts:, pero es posible que se asusten y decidan desconectarte...',
        selection: {
          yes: 'Pedir ayuda',
          no: 'No decir nada'
        },
        result: {
          informed: "Ha descubierto que en realidad es un androide. La IA lo detonará si intenta escapar, matando a todos. Es posible hackear el mecanismo utilizando 4 :parts:. O simplemente puedes desconectar a %{player} y olvidar todo esto.",
          yes: 'Les cuentas a los demás lo que sucede, esperando ayuda.',
          no: "Decides no contar nada a nadie. Te las arreglarás tú solo."
        }
      },
      betray: {
        label: ':dagger:',
        intro: 'Una transmisión empieza a sonar en tu intercomunicador: "Han entrado en una zona prohibida por la Alianza. Este acto de rebeldía está penado con cárcel. Si coopera con nosotros garantizamos su libertad. No podemos asegurar lo mismo para sus compañeros... Para empezar, queremos que active el sistema de defensa de la IA."',
        selection: {
          yes: 'Activar defensas',
          no: 'Negarse'          
        },
        result: {
          true: 'Decides traicionar a tus colegas y cooperar con la Alianza. Activas las defensas de la IA. Si alguien entra en una habitación vigilada por la :ia: será aniquilado al instante.',
          false: "No vas a traicionar a tus colegas.",
          alert: "Alguien ha activdo las defensas de la IA. Si alguien entra en una habitación vigilada por la :ia: será aniquilado al instante."
        }
      },
      brainscan: {
        label: 'Escanear cerebro de %{target}'
      },
      craft: {
        label: 'Fabricar %{resource} (3 :parts: 3 :energy:)',
        selection: 'Fabricar %{resource}',
        result:{
          success: '%{resource} Añadido a tu invantario',
          fail: "No tenías los materiles necesarios"
        }
      },
      defend:{
        tutorial: ':defend: Defender evita que te espien o te roben. Además sabrás quién va detras tuya...',
        label: ':defend: Defenderte',
        result: {
          success: 'Éxito!',
          attack_defended: 'Se defendió y te pateó el culo!!',
          nobody_defended: 'Nadie te atacó'
        }
      },
      disconnectandroid: {
        label: ' Disconnect :robot:',
        selection: 'Disconnect %{target} :robot:',
        result: {
          success: '%{player} ha desconectado a %{target}.'
        }
      },
      eat: {
        label: ':skull:',
        result: {
          youstarved: 'Moriste por falta de oxígeno',
          otterstarved: 'Murió por falta de oxígeno'
        }
      },
      escape:{
        label: 'Escapar',
        tutorial: 'Escapar: Es hora de abandonar esta trampa mortal, ¿tienes puesto el casco?...',
        result: {
          success: 'Enciendes los motores y te marchas... :shuttle:',
          helmet_needed: 'Necesitas un :helmet: para sobrevivir en la cápsula',
          shuttle_left: 'El :shuttle: ya partió',
          you_left: 'Ya abandonaste la nave',
          target_left: 'Ya abandonó la nave'
        }
      },
      fusion: {
        label: ':radioactive:',
        intro: 'El núcleo se está sobrecalentando... alguien debe entrar en la cámara de control y detener el proceso manualmente. ' +
        'Con que entre una persona será suficiente, pero la radiación es tan alta que inutilizará el :helmet: de aquellos que entren. Si nadie entra la nave estallará',
        selection: {
          yes: 'Entrar',
          no: 'Quedarse'
        },
        result: {
          youdied: 'Moriste por sobredosis de radiación',
          otterdied: 'Murió por sobredosis de radiación',
          youentered: 'Entraste en la cámara',
          otterentered: 'Entró en la cámara'
        }
      },
      gunsmith: {
        label: ':gun:',
        intro: '"Aquí la Alianza. Buen trabajo activando las defensas. Ahora necesitamos que actives el control remoto de la nave para que podamos remolcarla a nuestra estación. El problema es que únicamente %{target} tiene el código que activa esta función. Estamos transmitiéndote el prototipo de una pistola :gun:. Podrás fabricar una en el almacén. Haz lo que tengas que hacer."',
        selection: {
          yes: 'Aceptar',
          no: 'Negarse'
        },
        result: {
          true: "Aceptas. Recibes el prototipo de la pistola. Recuerda que puedes fabricarla en el almacén.",
          false: "Esto ya es demasiado. Te niegas a asesinar a tus compañeros."
        }
      },
      hack: {
        label: 'Hackear (:energy: 2)',
        selection: 'Hackear: %{location}',
        result: {
          no_materials: "No disponías de las :energy: necesarias",
          redundancy: "Esta habitación ya ha sido hakiada",
          success: "Esta habitación es segura ahora"
        }
      },
      hackandroid: {
        label: ' Hack :robot: (1 :parts:) <strong>%{fix}</strong>',
        selection: 'Hack %{target} :robot:',
        result: {
          success: 'Hackear a %{target} :robot: <strong>%{fix}</strong>',
          no_fixing_materials: "No tenías los :parts: necesarios",
          already_fixed: 'Ya había sido arreglado.',
          revealed: "Has descubierto que en realidad %{player} es un androide. La IA lo detonará si intenta escapar, matando a todos. Es posible hackear el mecanismo utilizando 6 :parts:. O simplemente puedes desconectar a %{player} y olvidar todo esto.",
          revealed_safe: "Has descubierto que en realidad %{player} es un androide, pero ya no es una amenaza"
        }
      },
      hitman: {
        label: ":gun:",
        intro: "Al fin. Apuntas a %{target} con tu pistola y le pides el código... pero, y si se niega?",
        intro2: "%{target} te apunta con una pistola: \"Dame el código de activación del control remoto de la nave\". %{target} te ha tricionado. Ha sido él/ella quien ha activado las defensas de la IA, y ahora quiere el código de activación del control remoto de la nave para entregaros como criminales a la Alianza. Sólo tú tienes el código. Si se lo das, la Alianza llegará antes de una hora de la autodestrucción. Si no se lo das, quien sabe lo que es capaz de hacer...",
        selection: {
          yes: "Disparar",
          no: "No disparar",
          yes2: "Dar código",
          no2: "Negarse"
        },
        result: {
          peace: "%{target} se niega a darte el código. No quieres seguir con esta locura. Tendrás que escapar de la nave con los demás, si te dejan...",
          peace2: "Te niegas a dar el código. %{target} baja el arma. Después de todo parece que no ha perdido la razón.",
          surrender: "%{target} te entrega el código. Menos mal... no será necesario matarlo/a. Activas el control remoto de la nave. La Alianza llegará una hora antes de la autodestrucción de la nave.",
          surrender2: "Le entregas el código a %{target}. Mejor sobrevivir ahora e intentar escapar.",
          killing: "%{target} se niega a darte el código. Aprietas el gatillo... Ahora sólo hay una forma de obtener el código... lleva el cadáver de %{target} a la enfermería y escanea su cerebro.",
          killing2: "Te niegas a dar el código. %{target} aprieta el gatillo...",
          giveaway: "%{target} te entrega el código. Menos mal... activas el control remoto de la nave. La Alianza llegará una hora antes de la autodestrucción de la nave.",
          giveaway2: "Le entregas el código a %{target}. Mejor sobrevivir ahora e intentar escapar.",
          warning: "%{target} es un traidor. Ha contactado con la Alianza para entregaros a todos. La nave está ahora bajo control de la Alianza, que llegará una hora antes de la autodestrucción para apresaros."
        }
      },
      inject: {
        label: ':syringe:',
        intro: 'Encuentras una jeringuilla con lo que parece un antídoto para la neurotoxina. Si te lo inyectas no necesitarás más :food:. Pero... es seguro?',
        selection: {
          yes: 'Inyectarte',
          no: 'Da igual'
        },
        result: {
          injected: 'Te inyectas. Ahora puedes respirar aire tóxico',
          android: 'Te inyectas. Ahora puedes respirar aire tóxico. Pero pasa algo raro... no has sangrado después de la inyección.',
          no: "Decides que el riesgo no vale la pena"
        }
      },
      oxygen: {
        tutorial: ":food: Generarás 1 botella de oxígeno.",
        label: 'Generar :food:',
        result: {
          fail: 'Alcanzaste el límite de oxígeno',
          success: 'Generaste 1 :food:'
        }
      },
      none: {
        label: 'Acción por defecto'
      },
      playdead: {
        label: {
          0: 'No se ha movido un pelo',
          1: 'Sigue muerto',
          2: 'Se ha movido!!!... No...era un ratón',
          3: 'Muerto, tal vez pueda coger algo de sus bolsillos...'
        }
      },
      search: {
        label: ':search: Buscar',
        selection: ':search: Buscar: %{location}',
        tutorial: ':search: Search: Encontrarás :parts: o :energy:.',
        result: {
          success: 'Encontraste %{resources} (%{location})',
          fail: 'No encontraste nada (%{location})',
          full: "No puedes llevar más %{resources} (%{location})"
        }
      },
      share: {
        label: 'Dar %{resource}',
        selection: 'Dar %{resource} a %{target}',
        tutorial: 'Dar: transfiere recursos a otro jugador.',
        result: {
          teamReceived: ':arrows_clockwise: El :team: recibió: ',
          youReceived: ':arrows_clockwise: Recibiste: ',
          personalShare: 'Tú: %{resources}'
        }
      },
      spy:{
        label: 'Espiar',
        selection: 'Espiar a %{target}',
        tutorial: 'Espiar: te permite conocer lo que estaba haciendo un jugador en un determinado momento. Además conocerás su inventario.',
        targetInventory: 'Inventario de %{target}: %{resources}'
      },
      steal:{
        label: 'Robar :helmet:',

        selection: 'Robar %{resource} a %{target}',
        tutorial: 'Robar: transfiere recursos desde otro jugador.',
        result: {
          success: 'Robaste %{resources} a %{target}',
          empty: 'No tenía nada'
        }
      },
      unlock: {
        label: 'Desbloquear (:energy: 2)',
        selection: 'Desbloquear: %{location}',
        tutorial: ':lock: Desbloquear: Abre una habitación bloqueada.',
        result: {
          no_materials: "No disponías de las :energy: necesarias",
          redundancy: "Esta habitación ya ha sido desbloqueada",
          success: "%{location} Desbloqueado/a"
        }
      },
      vote: {
        label: ':ballot_box: Resultados: ',
        result: {
          votes: '%{player}: %{votes} votos.',
          winner: 'Ganador: %{players}',
          winners: 'Ganadores: %{players}'
        }
      },
      work:{
        label: 'Reparar el :shuttle: (:parts: 1)',
        selection: 'Reparar el :shuttle:',
        tutorial: ':work: Reparar: arregla un porcentaje de la cápsula de escape.',
        result: {
          success: 'Reparaste el :shuttle:',
          broken_shuttle: 'El :shuttle: aun necesita reparaciones',
          no_fixing_materials: "No tenías los :parts: necesarios",
          already_fixed: 'El :shuttle: ya está arreglado',
        }
      }
    },
    player: {
      inventory: 'Inventario: %{resources}',
      status: {
        dead: 'Moriste asfixiado',
        killed: 'La IA te encontró',
        escaped: 'Felicidades, lograste escapar... por ahora...',
        trapped: 'You... were... Left Behind.',
        crashed: 'La IA destruye la nave, matando a todos en su interior...no fuiste capaz de escapar a tiempo',
        exploded: 'La nave explota... nadie tuvo el valor de hacer lo que había que hacer',
        radiated: 'Demasiada radiación te fríe el cerebro',
        disconnected: 'Has sido desconectado',
        blown: '%{player} was an android. The IA detonates %{player} as soon as you start the escape pod engines.',
        detonated: 'LA IA te detona en cuanto enciendes los motores de la cápsula de escape. Nadie sobrevive.',
        murdered: 'Has sido asesinado.'
      }
    },
    buttons: {
      start: 'Empezar',
      send: 'Enviar'
    }
  }
}(LB || {}))
