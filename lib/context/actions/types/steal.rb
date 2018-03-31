module LB
  class Action::Steal < Action::Base
    include WithResource
    include WithTarget
    include Cooperative
    include EndGame

    def run context
      super context

      return @context if computed?

      steal = lambda do |action|

        escaped_action(action) if target_left_behind?(action)
        trapped_action(action) if target_escaped?(action)
        return @context if action.computed?

        unless has_something? action
          action.add_status :fail
          action.add_info :reason => 'action.steal.result.empty'
          return @context
        end

        action.add_status :success
        action.add_bounty action.resource => 1
        target_inventory.subtract action.resource, 1
        @context
      end

      run_multiple steal
    end

    def resolve context
      super context

      manage_resources if success?
      performer.information.add_to performer.uuid, slot, information(self.class.name, true)

      @context
    end

    private

    def run_multiple action_block
      cowork_actions.shuffle(random: @context.random_generator).each do |the_action|
        the_action.ensure_context @context
        action_block.call(the_action)
      end

      @context
    end

    def has_something? action
      (target_inventory.has_key? action.resource) && (target_inventory[action.resource] > 0)
    end

    def manage_resources
      performer.inventory.add resource, bounty[resource]
    end
  end
end
