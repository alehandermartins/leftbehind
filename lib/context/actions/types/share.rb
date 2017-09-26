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

      if target == 'team'
        @context.team.inventory.add resource, 1
        performer.inventory.subtract resource, 1
        performer.shared_inventory.add resource, 1
        add_to_everyone_log
      else
        performer.inventory.subtract resource, 1
        @context.players[target].inventory.add resource, 1
        add_to_log
      end

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end

    def add_to_log
      @context.players[target].information.add_to performer.uuid, slot, information(self.class.name)
    end

    def add_to_everyone_log
      @context.players.each{ |the_player|
        the_player.information.add_to performer.uuid, slot, information(self.class.name)
      }
    end
  end
end
