module LB
  class Action::Hack < Action::Base
    include Located
    include Cooperative
    include IA
    HACK_PRICE = 2

    def run context
      super context

      return @context if computed?
      return @context if killed?

      hack = lambda do |action|

        if @context.locations[location][:status] == :hacked
          action.add_status :fail
          action.add_info reason: 'redundancy'
          return @context
        end

        unless able?
          action.add_status :fail
          action.add_info reason: 'no_materials'
          return @context
        end

        spend_material
        action.add_status :success
        @context.locations.hack location
      end

      run_multiple hack

      @context
    end

    def resolve context
      super context

      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      return @context unless success?
      @context
    end

    private

    def run_multiple action_block
      cowork_actions.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      @context
    end

    def able?
      performer.inventory[:energy] + @context.team.inventory[:energy] >= HACK_PRICE
    end

    def spend_material
      return with_help if HACK_PRICE > performer.inventory[:energy]
      performer.inventory.subtract :energy, HACK_PRICE
    end

    def with_help
      team_price = HACK_PRICE - performer.inventory[:energy]
      performer.inventory.subtract_all :energy
      @context.team.inventory.subtract :energy, team_price
    end
  end
end
