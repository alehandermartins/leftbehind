module LB
  class Action::Craft < Action::Base
    include WithItem
    include IA

    def run context
      super context
      payload[:location] = '6'

      return @context if computed?
      return @context if killed?

      unless able?
        add_status :fail
        return @context
      end

      add_status :success
      spend_material
      @context
    end

    def resolve context
      super context

      performer.information.add_action(performer.uuid, slot, information)
      performer.inventory.add_item item.to_sym if success?
      @context
    end

    private
    def able?
      performer.inventory[:parts] + @context.team.inventory[:parts] >= price
    end

    def spend_material
      return with_help if price > performer.inventory[:parts]
      performer.inventory.subtract :parts, price
    end

    def with_help
      team_price = price - performer.inventory[:parts]
      performer.inventory.subtract_all :parts
      @context.team.inventory.subtract :parts, team_price
    end
  end
end
