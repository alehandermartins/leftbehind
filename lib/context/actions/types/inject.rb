module LB
  class Action::Inject < Action::Base
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

      performer.add_trait :android if payload[:decision] == true
      add_info reason: 'action.inject.result.android'
      add_event_to_everyone :inject
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end
  end
end
