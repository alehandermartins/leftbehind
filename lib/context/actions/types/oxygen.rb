module LB
  class Action::Oxygen < Action::Base
    include IA
    include EndGame

    def run context
      super context
      payload[:location] = '7'

      return @context if computed?
      return @context if killed?

      if performer.escaped?
        escaped_action(self)
        return @context
      end

      unless able?
        add_status :fail
        add_info reason: 'action.oxygen.result.fail'
        return @context
      end

      add_status :success
      performer.inventory.add :food, 1
      @context
    end

    def resolve context
      super context

      performer.information.add_action(performer.uuid, slot, information)
      @context
    end

    def able?
      performer.inventory[:food] < 2
    end
  end
end
