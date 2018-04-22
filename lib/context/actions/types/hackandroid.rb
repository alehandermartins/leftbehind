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
          log_hack_to_everyone(action.performer, action.information) if @context.players[target].condition == :ok
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

      if success?
        add_info fix: target_player.calculate_fix
        add_to_log
      end
      performer.information.add_action performer.uuid, slot, information

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

    def log_hack_to_everyone player, hack_info
      @context.players.each{ |player|
        knows = player.information.players[target][:traits].include?(:c3po) || player.information.players[target][:traits].include?(:terminator)
        player.information.add_action player.uuid, slot, hack_info if knows
      }
    end
  end
end
