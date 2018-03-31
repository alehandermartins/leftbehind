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
          action.add_info reason: 'action.hackAndroid.result.already_fixed'
          return @context
        end

        if team_able?
          action.add_status :success
          @context.team.inventory.subtract :parts, 1
          @context.players[target].fix
          return @context
        end

        action.add_status :fail
        action.add_info reason: 'action.hackAndroid.result.no_fixing_materials'
        @context
      end

      run_multiple hack
      @context
    end

    def resolve context
      super context

      performer.information.add_to performer.uuid, slot, information(self.class.name)
      eturn @context unless success?
      add_to_log

      @context
    end

    private
    def run_multiple action_block
      cowork_actions.each do |the_action|
        next escaped_action(the_action) if the_action.target_left_behind?
        next trapped_action(self) if the_action.target_escaped?
        action_block.call(the_action)
      end

      @context
    end

    def team_able?
      @context.team.inventory[:parts] > 0
    end

    def add_to_log
      @context.players[target].information.add_to performer.uuid, slot, information(self.class.name)
    end
  end
end
