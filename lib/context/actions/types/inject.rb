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
      add_event_to_everyone
      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))

      @context
    end

    private

    def add_event_to_everyone
      @context.players.each{ |the_player|
        the_player.add_event :inject
      }
    end
  end
end
