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

      performer.add_trait :traitor if payload[:decision] == true
      add_info reason: 'action.betray.result.yes'
      add_event_to_everyone
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end

    private

    def add_event_to_everyone
      @context.players.each{ |the_player|
        the_player.add_event :betray
      }
    end
  end
end