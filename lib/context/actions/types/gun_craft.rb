module LB
  class Action::GunCraft < Action::Base

    def run context
      super context
      return @context if computed?
      add_status :success

      @context
    end

    def resolve context
      super context
      return @context if resolved?

      add_event_to_everyone :gun_craft
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end
  end
end