module LB
  class Action::Unlock < Action::Base
    include Located

    def run context
      super context

      return @context if computed?
      unless capable?
        add_status :fail
        return @context
      end

      add_status :success
      @context
    end

    def resolve context
      super context

      return @context unless success?
      unlock
      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      @context
    end

    private
      def capable?
        performer.inventory[:pick] > 0
      end

      def unlock
        @context.locations[location][:status] = :unlocked
      end
  end
end
