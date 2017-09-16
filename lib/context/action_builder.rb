require_relative './actions'

class ActionBuilder

  ACTIONS_MAP = {
    'search' => LB::Action::Search,
    'defend' => LB::Action::Defend,
    'craft' => LB::Action::Craft,
    'spy' => LB::Action::Spy,
    'steal' => LB::Action::Steal,
    'work' => LB::Action::Work,
    'share' => LB::Action::Share,
    'vote' => LB::Action::Vote,
    'fusion' => LB::Action::Fusion,
    'eat' => LB::Action::Eat,
    'playdead' => LB::Action::PlayDead,
    'escape' => LB::Action::Escape,
    'none' => LB::Action::None,
    'unlock' => LB::Action::Unlock
  }

  def for player
    @player = player
    self
  end

  def at slot
    @slot = slot
    self
  end

  def parameterized_with params
    @params = params
    self
  end

  def build
    check_buildable!
    action_class = ACTIONS_MAP[@params[:name]]
    action_class.new @player, @slot, @params[:payload]
  end

  private
  def check_buildable!
    raise :not_enough_params if @player.nil? || @slot.nil?
  end
end
