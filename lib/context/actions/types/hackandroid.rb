module LB
  class Action::HackAndroid < Action::Base
    include WithTarget
    include Cooperative
    include EndGame

    def run context
      super context

      return @context if computed?

      hack = lambda do |action|
        unless @context.players[target].condition == :broken
          action.add_status :fail
          action.add_info reason: 'action.hackandroid.result.already_fixed'
          return @context
        end

        if team_able?
          action.add_status :success
          @context.team.inventory.subtract :parts, 1
          @context.players[target].fix
          action.add_info reason: 'action.hackandroid.result.success'
          if @context.players[target].condition == :ok
            action.add_info reason: 'action.hackandroid.result.finally_fixed'
            log_to_everyone(action.performer, action.information)
          end
          return @context
        end

        action.add_status :fail
        action.add_info reason: 'action.hackandroid.result.no_fixing_materials'
        @context
      end

      run_multiple hack
      @context
    end

    def resolve context
      super context

      performer.information.add_action performer.uuid, slot, information
      add_to_log if success?

      @context
    end

    private
    def run_multiple action_block
      cowork_actions.each do |the_action|
        next escaped_action(the_action) if target_left_behind?(the_action)
        next trapped_action(self) if target_escaped?(the_action)
        action_block.call(the_action)
      end

      @context
    end

    def team_able?
      @context.team.inventory[:parts] > 0
    end

    def add_to_log
      return unless @context.players[target].alive?
      @context.players[target].information.add_action performer.uuid, slot, information
    end
  end
end
