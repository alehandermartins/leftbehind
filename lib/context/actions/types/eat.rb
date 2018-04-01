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
        add_to_everyone_log info
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
      performer.traits.include?(:injected) || performer.traits.include?(:android)
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
