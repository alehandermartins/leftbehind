module LB
  class Action::Android < Action::Base
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

      c3po if payload[:decision] == true
      terminator if payload[:decision] == false
      add_event_to_everyone
      add_to_everyone_log

      @context
    end

    private

    def add_event_to_everyone
      @context.players.each{ |the_player|
        the_player.add_event :android
      }
    end

    def c3po
      performer.add_trait :c3po
      performer.fix 2
    end

    def terminator
      performer.add_trait :terminator
    end
  end
end
