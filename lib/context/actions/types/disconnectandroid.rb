module LB
  class Action::DisconnectAndroid < Action::Base
    include WithTarget
    include IA

    def run context
      super context

      return @context if computed?

      add_status :success
      @context
    end

    def resolve context
      super context
      return @context unless success?

      log_to_everyone
      target_action.add_status :fail
      @context.players[target].disconnect
      @context.slots.replace_actions @context.players[target], slot, dead_action
      @context
    end
  end
end
