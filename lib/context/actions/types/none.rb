module LB
  class Action::None < Action::Base

    def run context
      super context
      add_status :success
      @context
    end

    def resolve context
      super context
      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end
 end
end
