module LB
  class Action::Betray < Action::Base
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

      betray if payload[:decision] == true
      add_info reason: 'action.betray.result.yes'
      add_event_to_everyone :betray
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end

    private
    def betray
      @context.ia.deploy
      performer.add_trait :betrayer
      log_to_everyone
    end
  end
end