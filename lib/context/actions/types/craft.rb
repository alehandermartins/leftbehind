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
      price.keys.all? { |res|
        performer.inventory[res] >= price[res]
      }
    end

    def spend_material
      price.keys.each { |res|
        performer.inventory.subtract res, price[res]
      }
    end
  end
end
