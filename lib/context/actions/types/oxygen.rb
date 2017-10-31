module LB
  class Action::Oxygen < Action::Base
    include Alien
    include EndGame

    def run context
      super context

      return @context if computed?
      return @context if devoured?

      unless able?
        add_status :fail
        return @context
      end

      add_status :success
      @context
    end

    def resolve context
      super context

      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      return @context unless success?

      performer.inventory.add :food, 1
      @context
    end

    def able?
      performer.inventory[:food] < 2
    end
  end
end
