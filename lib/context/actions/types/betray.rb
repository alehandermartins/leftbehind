module LB
  class Action::Betray < Action::Base

    def run context
      super context
      return @context if computed?

      add_status :success if payload[:decision] == true
      add_status :fail if payload[:decision] == false

      @context
    end

    def resolve context
      super context

      betray if success?
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