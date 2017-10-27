module LB
  class Action::Oxygen < Action::Base
    include Alien
    include EndGame

    def run context
      super context
      
      return @context if computed?
      return @context if devoured?

      add_status :fail unless able?
      
      @context
    end

    def resolve context
      super context
      return @context unless success?

      performer.inventory.add :food, 1 
      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      @context
    end

    def able?
      performer.inventory[:food] <= 2
    end
  end
end
