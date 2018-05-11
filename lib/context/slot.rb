class Slot

  def add action
    @actions ||= []
    @actions << action
  end

  def actions
    @actions
  end

  def run_on context
    actions.sort_by{ |the_action|
      LB.actions_map.keys.index the_action.class.name
    }.each do |the_action|
      the_action.run context
    end
  end

  def resolve_for context
    actions.sort_by{ |the_action|
      LB.actions_map.values.index the_action.class
    }.each do |the_action|
      the_action.resolve context
    end
  end

  def to_h
    @actions.map { |the_action|
      the_action.to_h
    }
  end

  def replace new_action
    actions.map!{ |action| action[:performer].uuid == new_action[:performer].uuid ? new_action : action }
  end

  def completed? num_players
    actions.group_by {|action| action[:performer].uuid}.length == num_players
  end

  def completed_for? player
    actions.any? { |action| action[:performer].uuid == player}
  end
end
