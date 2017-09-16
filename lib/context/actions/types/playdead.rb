module LB
  class Action::PlayDead < Action::Base

    def run context
      super context
      add_status :success
      @context
    end

    def resolve context
      super context
      @context
    end
 end
end
