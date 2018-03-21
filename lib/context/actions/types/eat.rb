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
      return @context if injected?

      if starving?
        performer.kill
        add_to_everyone_log
        return @context
      end

      performer.inventory.subtract resource, bounty[resource]
      @context
    end

    private
    def starving?
      performer.inventory[:food] == 0
    end

    def injected?
      performer.traits.include? :injected   
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
