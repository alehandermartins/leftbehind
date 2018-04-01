module LB
  class Action::Share < Action::Base
    include Cooperative
    include WithResource
    include WithTarget

    def run context
      super context
      return @context if computed?

      add_status :success
      @context
    end

    def resolve context
      super context

      performer.inventory.subtract resource, 1
      @context.players[target].inventory.add resource, 1
      add_to_log

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end

    def add_to_log
      return unless @context.players[target].alive?
      @context.players[target].information.add_to performer.uuid, slot, information(self.class.name)
    end
  end
end
