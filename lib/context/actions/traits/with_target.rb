module LB
  module WithTarget
    def target
      payload[:target]
    end

    def target_inventory
      @context.players[target].inventory
    end

    def player_escaped? player
      @context.players[player].escaped?
    end

    def target_left_behind? the_action
      the_action.performer.escaped? && (!player_escaped? target)
    end

    def target_escaped? the_action
      !the_action.performer.escaped? && (player_escaped? target)
    end

    def target_action
      @context.slots[slot].actions.each do |the_action|
        return the_action if the_action.performer.uuid == target
      end
    end
  end
end
