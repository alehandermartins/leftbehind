module LB
  class Action::Share < Action::Base
    include Cooperative
    include WithResource
    include WithTarget

    def run context
      super context
      return @context if computed?

      unless able?
        add_status :fail
        return @context
      end

      performer.inventory.subtract resource, 1
      add_status :success
      @context
    end

    def resolve context
      super context

      if success?
        @context.players[target].inventory.add resource, 1
        add_to_log
      end

      performer.information.add_action performer.uuid, slot, information
      @context
    end

    private
    def able?
      performer.inventory[resource] > 0
    end

    def add_to_log
      return unless @context.players[target].alive?
      @context.players[target].information.add_action performer.uuid, slot, information
    end
  end
end
