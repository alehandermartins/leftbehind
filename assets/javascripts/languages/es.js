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
        result: {
          informed: "%{player} os dice que en realidad es un androide. La IA detonará a %{player} si intenta escapar, matando a todos con él/ella. Se puede arreglar cambiando la estructura de %{player}, utilizando 4 :parts:. O puedes simplemente desconectar a %{player} y olvidar todo esto.",
          yes: 'Les cuentas a los demás lo que sucede, esperando ayuda.',
          no: "Decides no contar nada a nadie. Te las arreglarás tú solo."
        }
      },
      hackandroid: {
        label: ' Hack :robot: (1 :parts:) <strong>%{fix}</strong>',
        selection: 'Hack %{target} :robot:',
        result: {
          success: 'Bien hecho. Sighe así.',
          no_fixing_materials: "No tenías los :parts: necesarios",
          finally_fixed: 'Arreglado!! %{player} ya no es una amenaza.',
          already_fixed: 'Ya había sido arreglado.'
        }
      },
      disconnectandroid: {
        label: ' Disconnect :robot:',
        selection: 'Disconnect %{target} :robot:',
        result: {
          success: '%{player} ha sido desconectado/a.'
        }
      },
      craft: {
        modalTitle: 'Elige lo que necesitas fabricar',
        list: ':pick: ( 3 :parts:)',
        label: 'Fabricar un :pick:',
        result:{
          success: 'Añadido a tu inventario',
          fail: "No tenías las :parts: necesarias"
        }
      },
      defend:{
        tutorial: ':defend: Defender evita que te espien o te roben. Además sabrás quién va detras tuya...',
        label: ':defend: Defenderte',
        result: {
          attack_defended: 'Se defendió y te pateó el culo!!',
          spy_defended: '%{player} te estaba espiando.',
          steal_defended: '%{player} intentó robarte.',
          nobody_defended: 'Nadie te atacó'
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
          success: 'Enciendes los motores y te marchas...',
          helmet_needed: 'Necesitas un :helmet: para sobrevivir en la cápsula',
          shuttle_left: 'El :shuttle: ya partió',
          you_left: 'Ya abandonaste la nave',
          target_left: 'Ya abandonó la nave'
        }
      },
      fusion: {
        label: ':radioactive:',
        result: {
          youdied: 'Moriste por sobredosis de radiación',
          otterdied: 'Murió por sobredosis de radiación',
          youentered: 'Entraste en la cámara',
          otterentered: 'Entró en la cámara'
        }
      },
      hack: {
        tutorial: ':computer: Hackear: La IA no será capaz de atacar esta habitación.',
        label: 'Hackear (:energy: 2)',
        selection: 'Hackear: %{location}',
        result: {
          no_materials: "No disponías de las :energy: necesarias",
          redundancy: "Esta habitación ya ha sido hakiada",
          success: "Esta habitación es segura ahora"
        }
      },
      inject: {
        label: ':syringe:',
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
          nothing: 'No encontraste nada. ',
          bounty: 'Encontraste %{resources}',
          teamInventory: '(Añadido al inventario del :team:). ',
          itemfound: 'Encontraste un %{item}.',
          itemfounder: '%{founder} encontró un %{item}.'
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
          empty: 'No tenía nada',
          bounty: 'Robaste %{resources}'
        }
      },
      unlock: {
        label: 'Desbloquear (:energy: 2)',
        selection: 'Desbloquear: %{location}',
        tutorial: ':lock: Desbloquear: Abre una habitación bloqueada.',
        result: {
          no_materials: "No disponías de las :energy: necesarias",
          redundancy: "Esta habitación ya ha sido desbloqueada",
          success: "Desbloqueada"
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
        tutorial: ':work: Reparar: arregla un porcentaje de la cápsula de escape.',
        result: {
          success: 'Bien hecho, ya queda menos...',
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
        radiated: 'Demasiada radiación te fríe el cerebro'
      }
    },
    events: {
      actions: {
        title: 'Ups!',
        message: 'No has seleccionado suficientes acciones...',
      },
      voting: {
        intro:'Hay %{alive} personas con vida, pero sólo queda %{food} ' +
          ':food:. Elige a %{votes} personas que no utilizaran el :food: del :team:',
        title: 'Ups!',
        message: "Los números no cuadran, deberías votar a %{votes} personas"
      },
      fusion: {
        intro: 'El núcleo se está sobrecalentando... alguien debe entrar en la cámara de control y detener el proceso manualmente. ' +
        'Con que entre una persona será suficiente, pero la radiación es tan alta que inutilizará el :helmet: de aquellos que entren. Si nadie entra la nave estallará',
        yes: 'Entrar',
        no: 'Quedarse'
      },
      inject: {
        intro: 'Encuentras una jeringuilla con lo que parece un antídoto para la neurotoxina. Si te lo inyectas no necesitarás más :food:. Pero... es seguro?',
        yes: 'Inyectarte',
        no: 'Da igual'
      },
      android: {
        intro: 'Solamente puede haber una razón por la cual no has sangrado después de la inyección... no eres humano. Eres un androide. Ufff vaya desastre... te das cuenta de que el as en la manga de la IA es detonarte una vez estéis todos en la cápsula de escape. Si intentas escapar con los demás todos moriréis. Puedes evitarlo haciendo algunos cambios en tu estructura. Sin embargo te costará 4 :parts:. Puedes pedir ayuda a tus compañeros, pero es posible que se asusten y decidan desconectarte...',
        yes: 'Pedir ayuda',
        no: 'No decir nada'
      }
    },
    buttons: {
      start: 'Empezar',
      send: 'Enviar'
    },
    results: {
      label: 'Resultados %{day}:',
      general: 'INFO GENERAL'
    },
    logs: {
      day: 'Hora %{day}:',
      empty: 'Registro vacío.'
    },
    tutorial:{
      actions: {
        title: 'Tutorial: Seleccionar acciones',
        message: 'Cada :day: tienes la posibilidad de realizar 4 acciones. Estas acciones se resuelven en orden cronológico una vez todos los jugadores han enviado las suyas. Para escapar necesitarás encontrar varios recursos. GASTARÁS 1 :food: AL FINAL DE CADA :day:. Asegúrate de tener al menos 1 :food: o morirás. Escoge sabiamente.'
      },
      sharing: {
        title: 'Tutorial: Compartir',
        message: 'Es el momento de ver como ha ido... Ahora puedes compartir tus recursos con el equipo o el resto de los jugadores. MÁS TARDE UTILIZARÉIS 1 :food: DE LOS RECURSOS DEL :team:. Si no hay para todos habrá una votación.'
      },
      events:{
        title: 'Tutorial: Eventos',
        message: 'Movidas varias...'
      },
      wait:{
        title: 'Tutorial: Espera',
        message: 'El :team: está tomando decisiones, espera pacientemente hasta que comience la siguiente fase.'
      }
    }
  }
}(LB || {}))
