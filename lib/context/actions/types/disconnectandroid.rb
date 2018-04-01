module LB
  class Action::DisconnectAndroid < Action::Base
    include WithTarget

    def run context
      super context

      return @context if computed?

      add_status :success
      @context
    end

    def resolve context
      super context

      @context.players[target].disconnect
      add_to_everyone_log
      @context
    end

    private
    def add_to_everyone_log
      @context.players.each{ |the_player|
        the_player.information.add_to performer.uuid, slot, information(self.class.name)
      }
    end
  end
end
