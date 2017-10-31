module LB
  class Action::Hack < Action::Base
    include Located
    include Cooperative
    include Alien

    def run context
      super context

      return @context if computed?
      return @context if devoured?

      hack = lambda do |action|
        action.add_status :success
      end

      run_multiple hack

      @context
    end

    def run_multiple action_block
      cowork_actions.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      hack_location if cowork_actions.any? {|the_action| the_action.status == :success }

      @context
    end

    def resolve context
      super context

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end

    private
    def hack_location
      @context.locations.hack location
    end
  end
end
