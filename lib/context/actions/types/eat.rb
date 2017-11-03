module LB
  class Action::Eat < Action::Base
    include WithResource

    def run context
      super context

      return @context if computed?

      add_status :success
      add_bounty resource => 1
      @context
    end

    def resolve context
      super context

      if able?
        feed_from_team
        return @context
      end

      if starving?
        performer.kill
        add_to_everyone_log
        return @context
      end

      performer.inventory.subtract resource, bounty[resource]
      @context
    end

    private
    def feed_from_team
      @context.team.inventory.subtract resource, bounty[resource]
    end

    def starving?
      performer.inventory[:food] == 0
    end

    def able?
      (@context.team.inventory[resource] != 0) && !voted?
    end

    def voted?
      @context.team.information.has_key?(:voting) && @context.team.information[:voting].has_key?(slot - 1) && @context.team.information[:voting][slot - 1][:result][:winners].include?(performer.uuid)
    end

    def add_to_everyone_log
      @context.players.each{ |the_player|
        the_player.information.add_to performer.uuid, slot, info
      }
    end

    def info
      {
        action: self.class.name,
        result: {info: 'player.status.starved'},
        inventory: nil
      }
    end
  end
end
