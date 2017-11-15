require 'yaml'

module Services
  class Actions
    SLOTS_PER_DAY = 6

    class << self

      def actions_validation actions, game, player
        game_status = Services::GameStatus.new game
        stats = game_status.get_stats
        actions_needed = {
          :actions => 4,
          :events => 1
        }
        stage = stage_for player, stats

        !(actions.nil? || actions.length != actions_needed[stage])
      end

      def save_actions game, player, actions
        save game, player, actions

        game_status = Services::GameStatus.new game
        stats = game_status.get_stats
        context = game_status.current_context

        next_phase(game, context) unless context.players.alive.any? { |the_player|
          stage_for(the_player.uuid, stats) == :wait
        }
      end

      def get_stats_for player, game
        game_status = Services::GameStatus.new game
        game_status.get_stats[player]
      end

      def add_default game, context, stats
        save_the_dead game[:uuid], context
        context.players.alive.each{ |player|
          stage = stage_for player.uuid, stats
          stage = event_for player.uuid, stats if stage == :events
          save game[:uuid], player.uuid, LB::Default::Actions.default_actions[stage] if absent?(context, player.uuid)
        }
        time = game[:time].to_i + game[:lapse].to_i
        Repos::Games.save_time game[:uuid], time
        context = Context.build_for game[:uuid]
        add_actions game[:uuid], context
      end

      private
      def stage_for player, stats
        stats[player][:game_stats][:players][player][:stage]
      end

      def event_for player, stats
        stats[player][:game_stats][:players][player][:event]
      end

      def next_phase game, context
        save_the_dead game, context
        Repos::Games.save_time game
        game_status = Services::GameStatus.new game
        context = game_status.get_context
        add_actions game, context
        Services.Http.notify(context.players.identifiers, game)
      end

      def save_the_dead game, context
        day_slot = context.slots.completed_number % SLOTS_PER_DAY
        context.players.each{ |player|
          if player.status != :alive
            save game, player.uuid, LB::Default::Actions.dead_actions if day_slot == 0
            save game, player.uuid, LB::Default::Actions.dead_events if day_slot == 4
          end
        }
      end

      def add_actions game, context
        day_slot = context.slots.completed_number % SLOTS_PER_DAY
        add_eating_actions game, context if day_slot == 5
      end

      def save game, player, actions
        transformed_actions = transform game, player, actions
        remove_actions game, player, transformed_actions
        Repos::Actions.save transformed_actions
      end

      def remove_actions game, player, transformed_actions
        transformed_actions.map{ |action|
          Repos::Actions.remove game, player, action[:slot]
        }
      end

      def retrieve game, player
        repo_actions = Repos::Actions.grab_for player, game
      end

      def transform game, player, actions
        resulting_action = Hash.new
        actions.keys.map { |slot|
          resulting_action.merge! game: game, player: player, slot: slot_to_index(game, slot)
          resulting_action.merge actions[slot]
        }
      end

      def slot_to_index game, slot
        day(game) * SLOTS_PER_DAY + 1 + %w{morning afternoon evening midnight events eating}.index(slot)
      end

      def day game
        number_of_completed_slots(game) / SLOTS_PER_DAY
      end

      def number_of_completed_slots game
        raise LB::Invalid::Game unless Repos::Games.exists? game
        actions_by_player = Services::Games.players(game).map { |the_player|
          retrieve game, the_player['uuid']
        }

        actions_by_player.map(&:count).min
      end

      def add_eating_actions game, context
        context.players.each{ |player|
          save game, player.uuid, LB::Default::Actions.eating_action if player.status == :alive
          save game, player.uuid, LB::Default::Actions.dead_eating if player.status != :alive
        }
      end

      def absent? context, player
        context.slots.completed_number == context.slots.max_completed || context.slots.completed_number_for(player) != context.slots.max_completed
      end
    end
  end
end
