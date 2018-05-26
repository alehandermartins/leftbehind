module LB
  class Action::Unlock < Action::Base
    include Located
    include WithTarget
    include IA
    include Cooperative
    include EndGame
    UNLOCK_PRICE = 2

    def run context
      super context
      payload[:location] = '1'

      return @context if computed?
      return @context if killed?

      unlock = lambda do |action|
        unless @context.locations[target][:status] == :locked
          action.add_status :fail
          action.add_info reason: 'action.unlock.result.redundancy'
          return @context
        end

        unless able?
          action.add_status :fail
          action.add_info reason: 'action.unlock.result.no_materials'
          return @context
        end

        spend_material
        action.add_status :success
        @context.locations.unlock target
      end

      run_multiple unlock

      @context
    end

    def resolve context
      super context

      performer.information.add_action(performer.uuid, slot, information)
      log_to_everyone if success?

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
      performer.inventory[:energy] >= UNLOCK_PRICE
    end

    def spend_material
      performer.inventory.subtract :energy, UNLOCK_PRICE
    end
  end
end
