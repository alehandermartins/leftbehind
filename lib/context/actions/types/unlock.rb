module LB
  class Action::Unlock < Action::Base
    include Located
    include Cooperative
    UNLOCK_PRICE = 2

    def run context
      super context

      return @context if computed?

      unlock = lambda do |action|
        unless @context.locations[location][:status] == :locked
          add_status :fail
          action.add_info reason: 'action.unlock.result.fail.redundancy'
          return @context
        end

        unless able?
          add_status :fail
          action.add_info reason: 'action.unlock.result.fail.no_materials'
          return @context
        end

        add_status :success
        action.add_status :success
      end

      run_multiple unlock
      
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

     def run_multiple action_block
      cowork_actions.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      hack_location if cowork_actions.any? {|the_action| the_action.status == :success }

      @context
    end
    
    def able?
      performer.inventory[:parts] + @context.team.inventory[:parts] >= UNLOCK_PRICE
    end

    def spend_material
      return with_help if UNLOCK_PRICE > performer.inventory[:parts]
      performer.inventory.subtract :parts, UNLOCK_PRICE
    end

    def with_help
      team_price = UNLOCK_PRICE - performer.inventory[:parts]
      performer.inventory.subtract_all :parts
      @context.team.inventory.subtract :parts, team_price
    end

    def unlock
      @context.locations.unlock location
    end
  end
end
