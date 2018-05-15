module LB
  class Action::Gunsmith < Action::Base

    def run context
      super context
      return @context if computed?

      add_status :success if payload[:decision] == true
      add_status :fail if payload[:decision] == false

      @context
    end

    def resolve context
      super context

      performer.add_trait :gunsmith if success?
      add_event_to_everyone :gunsmith
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end
  end
end