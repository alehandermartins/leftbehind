class ActionBuilder

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
    action_class = LB.actions_map[@params[:name]]
    action_class.new @player, @slot, @params[:payload]
  end

  private
  def check_buildable!
    raise :not_enough_params if @player.nil? || @slot.nil?
  end
end
