require_relative './actions'

class ActionBuilder

  ACTIONS_MAP = {
    'search' => LB::Action::Search,
    'oxygen' => LB::Action::Oxygen,
    'defend' => LB::Action::Defend,
    'hack' => LB::Action::Hack,
    'craft' => LB::Action::Craft,
    'spy' => LB::Action::Spy,
    'steal' => LB::Action::Steal,
    'work' => LB::Action::Work,
    'share' => LB::Action::Share,
    'vote' => LB::Action::Vote,
    'eat' => LB::Action::Eat,
    'playdead' => LB::Action::PlayDead,
    'escape' => LB::Action::Escape,
    'none' => LB::Action::None,
    'unlock' => LB::Action::Unlock,
    'fusion' => LB::Action::Fusion,
    'inject' => LB::Action::Inject,
    'android' => LB::Action::Android,
    'hackandroid' => LB::Action::HackAndroid,
    'disconnectandroid' => LB::Action::DisconnectAndroid
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
    @params[:payload] = @params[:payload] || {}
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
