module LB
  class Action::None < Action::Base

    def run context
      super context
      add_status :success
      @context
    end

    def resolve context
      super context
      performer.information.add_action performer.uuid, slot, information
      @context
    end
 end
end
