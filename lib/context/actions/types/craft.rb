module LB
  class Action::Craft < Action::Base
    include WithItem

    def run context
      super context

      unless is_possible?
        add_status :fail
        return @context
      end

      add_status :success
      spend_material
      @context
    end

    def resolve context
      super context
      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      return @context unless success?
      performer.inventory.add_item item.to_sym
      @context
    end

    private
    def is_possible?
      performer.inventory[:parts] >= price
    end

    def spend_material
      performer.inventory.subtract :parts, price
    end
  end
end
