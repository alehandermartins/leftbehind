module Services
  class GameStatus

    def initialize game, max_slots = nil
      @stats = {}
      @situation = {}
      @game = Repos::Games.game(game)
      @context = Context.build_for game
      @roles = %i(captain pilot mechanic scientist).shuffle(random: @context.random_generator)
      @current_slot = 0
      @max_slots = max_slots || @context.slots.completed_number
    end

    def get_context
      compute
      @context
    end

    def get_stats
      compute
      @stats
    end

    def current_context
      @context
    end

    private
    def stage_actions
      {
        :actions => 4,
        :events => 2,
      }
    end

    def next_stage
      {
        :actions => :events,
        :events => :actions,
      }
    end

    def slots_per_day
      stage_actions.values.reduce(:+)
    end

    def context
      @context
    end

    def current_slot
      @current_slot
    end

    def compute stage = :actions
      stage_slots = remaining_slots.take(stage_actions[stage])

      #context.ia.activate if stage == :events
      compute_stage stage_slots

      @current_slot = stage_slots.last || 0
      store_situation
      store_stats
      game_over?

      compute(next_stage[stage]) unless remaining_slots.empty?
      add_default_actions if time_exceeded? && remaining_slots.empty?
    end

    def game_over?
      return if @game[:status] == 'ended'
      @game[:status] = 'ended' if context.players.alive.size == 0
      Services::Games.end @game[:uuid] if context.players.alive.size == 0
    end

    def time_exceeded?
      @game[:style] != 'gentle' && @game[:status] == 'ongoing' && (Time.now.to_i - (@game[:time].to_i + @game[:lapse].to_i) >= 0)
    end

    def add_default_actions
      Services::Actions.add_default @game, context, @stats
      recompute
    end

    def absent? player
      context.slots.completed_number == context.slots.max_completed || @context.slots.completed_number_for(player) != context.slots.max_completed
    end

    def recompute
      @max_slots = nil if @max_slots == @context.slots.completed_number
      @game = Repos::Games.game(@game[:uuid])
      @context = Context.build_for @game[:uuid]
      @current_slot = 0
      @max_slots = @max_slots || @context.slots.completed_number
      compute
    end

    def remaining_slots
      ((current_slot + 1)..@max_slots).to_a
    end

    def compute_stage stage_slots
      stage_slots.each do |slot|
        context.slots[slot].run_on context
        context.slots[slot].resolve_for context
      end
    end

    def store_stats
      context.players.each{ |player|
        store_stats_for player.uuid
      }
    end

    def store_stats_for player
      @stats[player] = {
        game_stats: {
          game: @game,
          current_slot: @max_slots,
          escape_shuttle: context.items['escape shuttle'][:fix],
          players: @situation,
          locations: locations
        },
        team_stats:{
          inventory: context.team.inventory.to_h,
          information: context.team.information.to_h
        },
        personal_stats: {
          inventory: context.players[player].inventory.to_h,
          information: context.players[player].information.to_h
        }
      }
    end

    def store_situation
      random_player = context.players.to_a.sample(random: context.random_generator)
      context.players.each{ |player|
        player.crash if (current_slot >= 58 && player.alive?)
        @situation[player.uuid] = compose_situation player, random_player
      }
    end

    def compose_situation player, random_player
      {
        name: player.name,
        status: player.status,
        traits: player.traits,
        condition: player.condition,
        fix_left: player.fix_left,
        role: role(player),
        stage: player_stage(player),
        event: player_event(player, random_player),
      }
    end

    def role player
      @roles[context.players.to_a.index(player)]
    end

    def player_stage player
      unless alive_players_ready?
        return :wait if context.slots.completed_number_for(player.uuid) == context.slots.max_completed
      end
      completed_slots = context.slots.completed_number_for(player.uuid) % slots_per_day
      stage_for completed_slots
    end

    def stage_for slots
      stage_actions.each{ |stage, actions|
        return stage if slots < actions
        slots = slots - actions
      }
    end

    def player_event player, random_player
      return :defaultEvent unless player_stage(player) == :events
      return :fusion if !player.events.include?(:fusion)
      return :inject if !player.events.include?(:inject) && player == random_player
      return :android if !player.events.include?(:android) && player.traits.include?(:android)
      :defaultEvent
    end

    def locations
      context.locations.to_h.map { |uuid, location|
        {
          uuid: uuid,
          status: location[:status]
        }
      }
    end

    def alive_players_ready?
      context.players.alive.all?{ |the_player|
        context.slots.completed_number_for(the_player.uuid) == context.slots.max_completed
      }
    end
  end
end
