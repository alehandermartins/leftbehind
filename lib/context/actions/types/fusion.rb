module LB
  class Action::Fusion < Action::Base
    include Cooperative

    def run context
      super context

      return @context if computed?
      add_status :success

      @context
    end

    def resolve context
      super context

      return @context if resolved?

      kill_everyone unless someone_entered?
      kill_heroes
      remove_damaged_helmets
      place_backup_helmets

      add_event_to_everyone :fusion

      (same_actions).each {|same_action|
        same_action.add_status :resolved
      }

      @context
    end

    private
    def place_backup_helmets
      backup_helmets.each{ |helmet|
        @context.locations[@context.locations.locked.sample(random: @context.random_generator)][:inventory][helmet] += 1
      }
    end

    def backup_helmets
      alive_players = @context.players.alive.size
      helmets = alive_players - total_helmets
      helmets = 0 if helmets < 0
      Array.new(helmets, :helmet)
    end

    def total_helmets
      @context.players.map{ |player|
        player.inventory[:helmet]
      }.inject(0, :+)
    end

    def remove_damaged_helmets
      (same_actions).each {|same_action|
        remove_helmets same_action.performer if safely_entered? same_action
      }
    end

    def remove_helmets player
      player.inventory.subtract_all :helmet
      log_to_everyone player, info('action.fusion.result.entered')
    end

    def safely_entered? action
      action.payload[:decision] == true && action.performer.inventory[:helmet] > 0
    end

    def kill_heroes
      (same_actions).each {|same_action|
        kill same_action.performer if hero? same_action
      }
    end

    def hero? action
      action.payload[:decision] == true && action.performer.inventory[:helmet] == 0
    end

    def kill player
      player.status = :radiated
      log_to_everyone player, info('player.status.radiated')
    end

    def kill_everyone
      @context.players.each{|player|
        player.status = :exploded
        log_to_everyone player, info('player.status.exploded')
      }
    end

    def someone_entered?
      (same_actions).any? {|same_action|
        same_action.payload[:decision] == true
      }
    end

    def info _info
      {
        action: self.class.name,
        result: {info: _info}
      }
    end
  end
end
