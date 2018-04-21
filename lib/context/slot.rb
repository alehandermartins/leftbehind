class Slot

  ACTIONS_PRIORITIES = [
    'LB::Action::PlayDead',
    'LB::Action::None',
    'LB::Action::Defend',
    'LB::Action::Escape',
    'LB::Action::DisconnectAndroid',
    'LB::Action::HackAndroid',
    'LB::Action::Work',
    'LB::Action::Craft',
    'LB::Action::Search',
    'LB::Action::Oxygen',
    'LB::Action::Hack',
    'LB::Action::Share',
    'LB::Action::Unlock',
    'LB::Action::Steal',
    'LB::Action::Spy',
    'LB::Action::Eat',
    'LB::Action::Vote',
    'LB::Action::Fusion',
    'LB::Action::Inject',
    'LB::Action::Android'
  ]

  def add action
    @actions ||= []
    @actions << action
  end

  def actions
    @actions
  end

  def run_on context
    actions.sort_by{ |the_action|
      ACTIONS_PRIORITIES.index the_action.class.name
    }.each do |the_action|
      the_action.run context
    end
  end

  def resolve_for context
    actions.sort_by{ |the_action|
      ACTIONS_PRIORITIES.index the_action.class.name
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
