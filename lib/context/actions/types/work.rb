module LB
  class Action::Work < Action::Base
    include Cooperative
    include WithItem
    include IA
    include EndGame

    def run context
      super context
      payload[:location] = '8'

      return @context if computed?
      return @context if killed?

      work = lambda do |action|
        if fixed?
          action.add_status :fail
          action.add_info reason: 'action.work.result.already_fixed'
          action.add_info reason: 'action.escape.result.shuttle_left' if action.performer.trapped?
          return @context
        end

        if able?
          action.add_status :success
          performer.inventory.subtract :parts, 1
          return @context
        end

        action.add_status :fail
        action.add_info reason: 'action.work.result.no_fixing_materials'
        @context
      end

      run_multiple work
    end

    def resolve context
      super context

      performer.information.add_action performer.uuid, slot, information
      return @context unless success?

      fix
      log_to_everyone
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
      performer.inventory[:parts] > 0
    end
  end
end
