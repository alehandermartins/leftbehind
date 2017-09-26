module LB
  class Action::Work < Action::Base
    include Cooperative
    include WithItem
    include Alien
    include EndGame

    def run context
      super context

      return @context if computed?
      return @context if devoured?

      work = lambda do |action|
        if fixed?
          action.add_status :fail
          action.add_info reason: 'action.work.result.already_fixed'
          action.add_info reason: 'action.escape.result.shuttle_left' if action.performer.trapped?
          return @context
        end

        if team_able?
          action.add_status :success
          @context.team.inventory.subtract :parts, 1
          action.performer.shared_inventory.add :work, 1
          return @context
        end

        if player_able?(action.performer)
          action.add_status :success
          action.performer.inventory.subtract :parts, 1
          action.performer.shared_inventory.add :work, 1
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

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      return @context unless success?

      fix
      add_to_everyone_else_log performer.uuid
      @context
    end

    def run_multiple action_block
      cowork_actions.sort_by(&method(:poorest_first)).each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      @context
    end

    def player_able?(player)
      player.inventory[:parts] > 0
    end

    def team_able?
      @context.team.inventory[:parts] > 0
    end

    private
      def poorest_first the_action
        the_action.performer.inventory[:parts]
      end

      def add_to_everyone_else_log target
        @context.players.reject{ |the_player|
          the_player.uuid == performer.uuid
        }.each{ |the_player|
          @context.players[the_player.uuid].information.add_to(target, slot, information(self.class.name))
        }
      end
  end
end
